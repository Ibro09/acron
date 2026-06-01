import express from "express";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import { Connection, Keypair, PublicKey, SystemProgram, Transaction, sendAndConfirmTransaction } from "@solana/web3.js";
import { createServer as createViteServer } from "vite";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Base58 decoding helper to parse base58 key formats directly without external dependency issues
function decodeBase58(str: string): Uint8Array {
  const ALPHABET = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
  const ALPHABET_MAP: Record<string, number> = {};
  for (let i = 0; i < ALPHABET.length; i++) {
    ALPHABET_MAP[ALPHABET[i]] = i;
  }
  const bytes = [0];
  for (let i = 0; i < str.length; i++) {
    const c = str[i];
    if (!(c in ALPHABET_MAP)) throw new Error("Non-base58 character in private key");
    let carry = ALPHABET_MAP[c];
    for (let j = 0; j < bytes.length; j++) {
      carry += bytes[j] * 58;
      bytes[j] = carry & 0xff;
      carry >>= 8;
    }
    while (carry > 0) {
      bytes.push(carry & 0xff);
      carry >>= 8;
    }
  }
  for (let i = 0; i < str.length && str[i] === "1"; i++) {
    bytes.push(0);
  }
  return new Uint8Array(bytes.reverse());
}

// Fetch live conversion rate for SOL to USD using public API (CoinGecko)
async function getSolToUsdRate(): Promise<number> {
  try {
    const res = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd");
    const json = await res.json() as any;
    if (json && json.solana && json.solana.usd) {
      return Number(json.solana.usd);
    }
  } catch (err) {
    console.warn("CoinGecko API call failed, using fallback rate of $150/SOL", err);
  }
  return 150.0; // Fail-safe fallback rate in case of Coingecko rate-limit or downtime
}

// Dynamically read .env from disk to prevent stale process.env caches
function loadLiveEnv(): Record<string, string> {
  const env: Record<string, string> = { ...process.env as Record<string, string> };
  try {
    const envPath = path.join(process.cwd(), ".env");
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, "utf-8");
      const lines = content.split(/\r?\n/);
      for (const line of lines) {
        const trimmedLine = line.trim();
        // Ignore comments or empty lines
        if (!trimmedLine || trimmedLine.startsWith("#")) continue;
        const equalIdx = trimmedLine.indexOf("=");
        if (equalIdx > 0) {
          const key = trimmedLine.slice(0, equalIdx).trim();
          let val = trimmedLine.slice(equalIdx + 1).trim();
          // Strip quotes around value
          if (val.startsWith('"') && val.endsWith('"')) {
            val = val.slice(1, -1);
          } else if (val.startsWith("'") && val.endsWith("'")) {
            val = val.slice(1, -1);
          }
          env[key] = val;
        }
      }
    }
  } catch (err) {
    console.error("Error reading live .env file:", err);
  }
  return env;
}

// Parse configuration on server start or on demand
function getPayerConfig() {
  let configError: string | null = null;
  let payerKeypair: Keypair | null = null;
  let payerPublicKey: string | null = null;

  const env = loadLiveEnv();
  const privateKeyRaw = env.SOLANA_PRIVATE_KEY;
  const network = env.SOLANA_NETWORK || "devnet";
  const rpcUrl = env.SOLANA_RPC_URL || "https://api.devnet.solana.com";

  if (!privateKeyRaw) {
    configError = "SOLANA_PRIVATE_KEY is missing from environment. Please create a .env file containing SOLANA_PRIVATE_KEY=\"your_key_here\".";
  } else {
    try {
      let secretKey: Uint8Array;
      let trimmed = privateKeyRaw.trim();
      
      // Clean up accidental line prefix copy-paste (e.g. "SOLANA_PRIVATE_KEY=...")
      if (trimmed.startsWith("SOLANA_PRIVATE_KEY")) {
        const eqIdx = trimmed.indexOf("=");
        if (eqIdx !== -1) {
          trimmed = trimmed.substring(eqIdx + 1).trim();
        }
      }
      
      // Clean up outer quotes
      if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
        trimmed = trimmed.substring(1, trimmed.length - 1).trim();
      }
      if (trimmed.startsWith("'") && trimmed.endsWith("'")) {
        trimmed = trimmed.substring(1, trimmed.length - 1).trim();
      }

      if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
        // Handle raw array string (e.g. [1, 2, 3...])
        const parsedArray = JSON.parse(trimmed);
        if (Array.isArray(parsedArray)) {
          secretKey = new Uint8Array(parsedArray);
        } else {
          throw new Error("Invalid private key format: parsed JSON is not an array");
        }
      } else {
        // Handle base58 string format
        secretKey = decodeBase58(trimmed);
      }

      if (secretKey.length !== 64) {
        throw new Error(`Invalid private key length: expected 64 bytes, got ${secretKey.length} bytes`);
      }

      payerKeypair = Keypair.fromSecretKey(secretKey);
      payerPublicKey = payerKeypair.publicKey.toBase58();
    } catch (err: any) {
      configError = `Failed to parse private key: ${err.message || err}`;
    }
  }

  return {
    payerKeypair,
    payerPublicKey,
    network,
    rpcUrl,
    configError,
    configured: !configError && !!payerKeypair
  };
}

// 1. Endpoint: Check solana payer configuration state
app.get("/api/solana-config", async (req, res) => {
  const config = getPayerConfig();
  
  if (!config.configured) {
    return res.json({
      success: false,
      configured: false,
      error: config.configError,
      network: config.network,
      rpcUrl: config.rpcUrl
    });
  }

  // If valid, fetch balance of that payer wallet to include in config checks
  try {
    const connection = new Connection(config.rpcUrl, "confirmed");
    const balanceLamports = await connection.getBalance(config.payerKeypair!.publicKey);
    const balanceSol = balanceLamports / 1e9;
    
    return res.json({
      success: true,
      configured: true,
      publicKey: config.payerPublicKey,
      network: config.network,
      rpcUrl: config.rpcUrl,
      balanceSol,
      balanceLamports
    });
  } catch (err: any) {
    return res.json({
      success: true,
      configured: true,
      publicKey: config.payerPublicKey,
      network: config.network,
      rpcUrl: config.rpcUrl,
      balanceSol: 0,
      balanceLamports: 0,
      error: `Could not fetch balance from RPC node: ${err.message || err}`
    });
  }
});

// 2. Endpoint: Request a real Solana SOL transfer withdrawal
app.post("/api/withdraw", async (req, res) => {
  const { recipientAddress, amount } = req.body;

  if (!recipientAddress) {
    return res.status(400).json({ success: false, error: "Recipient Solana address is required." });
  }
  if (!amount || Number(amount) <= 0) {
    return res.status(400).json({ success: false, error: "Withdraw amount must be greater than zero." });
  }

  const config = getPayerConfig();
  if (!config.configured || !config.payerKeypair) {
    return res.status(500).json({ 
      success: false, 
      error: `Disbursing server wallet is not loaded. Setup Error: ${config.configError || "Unknown secret key setup issue."}`
    });
  }

  try {
    // Validate recipient publicKey
    let toPublicKey: PublicKey;
    try {
      toPublicKey = new PublicKey(recipientAddress);
    } catch {
      return res.status(400).json({ success: false, error: "The provided wallet address is not a valid Solana public key." });
    }

    // Connect to network
    const connection = new Connection(config.rpcUrl, "confirmed");

    // Fetch live SOL conversion rate
    const solRate = await getSolToUsdRate();
    const solAmount = Number(amount) / solRate;
    
    // Converted to lamports (1 SOL = 1e9 lamports)
    let lamports = Math.round(solAmount * 1_000_000_000);

    // Enforce 1 lamport minimum safety
    if (lamports <= 0) {
      lamports = 1;
    }

    // Rent safety check to prevent "Transaction results in an account (1) with insufficient funds for rent"
    try {
      const rentExemptMin = await connection.getMinimumBalanceForRentExemption(0);
      const recipientBalance = await connection.getBalance(toPublicKey);
      
      // If receiver account has no SOL, their ending balance must be at least rent-exempt minimum.
      // We automatically raise/bump the transaction amount so they receive at least rentExemptMin SOL.
      if (recipientBalance === 0 && lamports < rentExemptMin) {
        console.log(`Bumping lamports from ${lamports} to ${rentExemptMin} to satisfy recipient account rent-exemption.`);
        lamports = rentExemptMin;
      } else if (recipientBalance > 0 && recipientBalance + lamports < rentExemptMin) {
        // Just in case they have a tiny fraction, raise to ensure they meet the minimum
        lamports = rentExemptMin - recipientBalance;
      }
    } catch (rentErr) {
      console.warn("Failed to check recipient rent exemption from Solana connection. Proceeding with calculated lamports:", rentErr);
    }

    // Check payer's current balance
    const payerBalance = await connection.getBalance(config.payerKeypair.publicKey);
    const rentExemptFeeSafety = 5000; // estimated tx sign fee limit
    
    if (payerBalance < lamports + rentExemptFeeSafety) {
      return res.status(400).json({
        success: false,
        error: `Insufficient balance on disbursing server wallet.\n\n` +
               `Required: ${(lamports / 1e9).toFixed(9)} SOL ($${Number(amount).toFixed(4)} USD) + fee\n` +
               `Current Payer Balance: ${(payerBalance / 1e9).toFixed(9)} SOL\n\n` +
               `Payer Wallet Address: ${config.payerPublicKey}\n` +
               `Please deposit/faucet test SOL into this payer address on Solana ${config.network}.`
      });
    }

    // Build the transfer Transaction
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: config.payerKeypair.publicKey,
        toPubkey: toPublicKey,
        lamports: lamports,
      })
    );

    // Sign, send, and wait for confirmation
    const signature = await sendAndConfirmTransaction(
      connection,
      transaction,
      [config.payerKeypair],
      { commitment: "confirmed" }
    );

    const explorerUrl = `https://explorer.solana.com/tx/${signature}?cluster=${config.network === "mainnet-beta" ? "" : config.network}`;

    return res.json({
      success: true,
      signature,
      solAmount: lamports / 1e9,
      lamports,
      solRate,
      explorerUrl
    });

  } catch (err: any) {
    console.error("Solana withdraw transaction failed:", err);
    let errorMessage = err.message || String(err);
    if (err.logs && Array.isArray(err.logs)) {
      errorMessage += `\n\nLogs:\n${err.logs.join("\n")}`;
    }
    return res.status(500).json({
      success: false,
      error: `Transaction failed: ${errorMessage}. Please try again later.`
    });
  }
});

// Vite & Static file serving setup for development vs production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server successfully started on http://0.0.0.0:${PORT}`);
  });
}

startServer();
