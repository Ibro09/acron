import { Handler } from "@netlify/functions";
import path from "path";
import fs from "fs";
import { Connection, Keypair, PublicKey, SystemProgram, Transaction, sendAndConfirmTransaction } from "@solana/web3.js";

// Base58 decoding helper
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

// Fetch live conversion rate for SOL to USD
async function getSolToUsdRate(): Promise<number> {
  try {
    const res = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd");
    const json = (await res.json()) as any;
    if (json && json.solana && json.solana.usd) {
      return Number(json.solana.usd);
    }
  } catch (err) {
    console.warn("CoinGecko API call failed, using fallback rate of $150/SOL", err);
  }
  return 150.0;
}

// Load environment variables
function loadLiveEnv(): Record<string, string> {
  const env: Record<string, string> = { ...process.env as Record<string, string> };
  try {
    const envPath = path.join(process.cwd(), ".env");
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, "utf-8");
      const lines = content.split(/\r?\n/);
      for (const line of lines) {
        const trimmedLine = line.trim();
        if (!trimmedLine || trimmedLine.startsWith("#")) continue;
        const equalIdx = trimmedLine.indexOf("=");
        if (equalIdx > 0) {
          const key = trimmedLine.slice(0, equalIdx).trim();
          let val = trimmedLine.slice(equalIdx + 1).trim();
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

// Parse payer config
function getPayerConfig() {
  let configError: string | null = null;
  let payerKeypair: Keypair | null = null;
  let payerPublicKey: string | null = null;

  const env = loadLiveEnv();
  const privateKeyRaw = env.SOLANA_PRIVATE_KEY;
  const network = env.SOLANA_NETWORK || "devnet";
  const rpcUrl = env.SOLANA_RPC_URL || "https://api.devnet.solana.com";

  if (!privateKeyRaw) {
    configError = "SOLANA_PRIVATE_KEY is missing from environment.";
  } else {
    try {
      let secretKey: Uint8Array;
      let trimmed = privateKeyRaw.trim();

      if (trimmed.startsWith("SOLANA_PRIVATE_KEY")) {
        const eqIdx = trimmed.indexOf("=");
        if (eqIdx !== -1) {
          trimmed = trimmed.substring(eqIdx + 1).trim();
        }
      }

      if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
        trimmed = trimmed.substring(1, trimmed.length - 1).trim();
      }
      if (trimmed.startsWith("'") && trimmed.endsWith("'")) {
        trimmed = trimmed.substring(1, trimmed.length - 1).trim();
      }

      if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
        const parsedArray = JSON.parse(trimmed);
        if (Array.isArray(parsedArray)) {
          secretKey = new Uint8Array(parsedArray);
        } else {
          throw new Error("Invalid private key format");
        }
      } else {
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

const handler: Handler = async (event) => {
  const path = event.path.replace("/.netlify/functions/api", "").replace(/\?.*/, "");
  const method = event.httpMethod;

  // CORS headers
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };

  if (method === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
      body: ""
    };
  }

  try {
    // GET /api/solana-config
    if (method === "GET" && path === "/solana-config") {
      const config = getPayerConfig();

      if (!config.configured) {
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            success: false,
            configured: false,
            error: config.configError,
            network: config.network,
            rpcUrl: config.rpcUrl
          })
        };
      }

      try {
        const connection = new Connection(config.rpcUrl, "confirmed");
        const balanceLamports = await connection.getBalance(config.payerKeypair!.publicKey);
        const balanceSol = balanceLamports / 1e9;

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            success: true,
            configured: true,
            publicKey: config.payerPublicKey,
            network: config.network,
            rpcUrl: config.rpcUrl,
            balanceSol,
            balanceLamports
          })
        };
      } catch (err: any) {
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            success: true,
            configured: true,
            publicKey: config.payerPublicKey,
            network: config.network,
            rpcUrl: config.rpcUrl,
            balanceSol: 0,
            balanceLamports: 0,
            error: `Could not fetch balance: ${err.message || err}`
          })
        };
      }
    }

    // POST /api/withdraw
    if (method === "POST" && path === "/withdraw") {
      const body = JSON.parse(event.body || "{}");
      const { recipientAddress, amount } = body;

      if (!recipientAddress) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ success: false, error: "Recipient Solana address is required." })
        };
      }
      if (!amount || Number(amount) <= 0) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ success: false, error: "Withdraw amount must be greater than zero." })
        };
      }

      const config = getPayerConfig();
      if (!config.configured || !config.payerKeypair) {
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({
            success: false,
            error: `Disbursing server wallet is not loaded. Setup Error: ${config.configError || "Unknown error"}`
          })
        };
      }

      try {
        let toPublicKey: PublicKey;
        try {
          toPublicKey = new PublicKey(recipientAddress);
        } catch {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ success: false, error: "Invalid Solana public key." })
          };
        }

        const connection = new Connection(config.rpcUrl, "confirmed");
        const solRate = await getSolToUsdRate();
        const solAmount = Number(amount) / solRate;

        let lamports = Math.round(solAmount * 1_000_000_000);
        if (lamports <= 0) {
          lamports = 1;
        }

        try {
          const rentExemptMin = await connection.getMinimumBalanceForRentExemption(0);
          const recipientBalance = await connection.getBalance(toPublicKey);

          if (recipientBalance === 0 && lamports < rentExemptMin) {
            console.log(`Bumping lamports from ${lamports} to ${rentExemptMin}`);
            lamports = rentExemptMin;
          } else if (recipientBalance > 0 && recipientBalance + lamports < rentExemptMin) {
            lamports = rentExemptMin - recipientBalance;
          }
        } catch (rentErr) {
          console.warn("Failed to check recipient rent exemption:", rentErr);
        }

        const payerBalance = await connection.getBalance(config.payerKeypair.publicKey);
        const rentExemptFeeSafety = 5000;

        if (payerBalance < lamports + rentExemptFeeSafety) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({
              success: false,
              error: `Insufficient balance on disbursing server wallet.\n\nRequired: ${(lamports / 1e9).toFixed(9)} SOL + fee\nCurrent: ${(payerBalance / 1e9).toFixed(9)} SOL\n\nPayer: ${config.payerPublicKey}`
            })
          };
        }

        const transaction = new Transaction().add(
          SystemProgram.transfer({
            fromPubkey: config.payerKeypair.publicKey,
            toPubkey: toPublicKey,
            lamports: lamports
          })
        );

        const signature = await sendAndConfirmTransaction(
          connection,
          transaction,
          [config.payerKeypair],
          { commitment: "confirmed" }
        );

        const explorerUrl = `https://explorer.solana.com/tx/${signature}?cluster=${config.network === "mainnet-beta" ? "" : config.network}`;

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            success: true,
            signature,
            solAmount: lamports / 1e9,
            lamports,
            solRate,
            explorerUrl
          })
        };
      } catch (err: any) {
        console.error("Solana withdraw failed:", err);
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({
            success: false,
            error: `Transaction failed: ${err.message || String(err)}`
          })
        };
      }
    }

    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ success: false, error: "Not found" })
    };
  } catch (err: any) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ success: false, error: err.message || "Server error" })
    };
  }
};

export { handler };
