var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_fs = __toESM(require("fs"), 1);
var import_dotenv = __toESM(require("dotenv"), 1);
var import_web3 = require("@solana/web3.js");
var import_vite = require("vite");
import_dotenv.default.config();
var app = (0, import_express.default)();
var PORT = 3e3;
app.use(import_express.default.json());
function decodeBase58(str) {
  const ALPHABET = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
  const ALPHABET_MAP = {};
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
      bytes[j] = carry & 255;
      carry >>= 8;
    }
    while (carry > 0) {
      bytes.push(carry & 255);
      carry >>= 8;
    }
  }
  for (let i = 0; i < str.length && str[i] === "1"; i++) {
    bytes.push(0);
  }
  return new Uint8Array(bytes.reverse());
}
async function getSolToUsdRate() {
  try {
    const res = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd");
    const json = await res.json();
    if (json && json.solana && json.solana.usd) {
      return Number(json.solana.usd);
    }
  } catch (err) {
    console.warn("CoinGecko API call failed, using fallback rate of $150/SOL", err);
  }
  return 150;
}
function loadLiveEnv() {
  const env = { ...process.env };
  try {
    const envPath = import_path.default.join(process.cwd(), ".env");
    if (import_fs.default.existsSync(envPath)) {
      const content = import_fs.default.readFileSync(envPath, "utf-8");
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
function getPayerConfig() {
  let configError = null;
  let payerKeypair = null;
  let payerPublicKey = null;
  const env = loadLiveEnv();
  const privateKeyRaw = env.SOLANA_PRIVATE_KEY;
  const network = env.SOLANA_NETWORK || "devnet";
  const rpcUrl = env.SOLANA_RPC_URL || "https://api.devnet.solana.com";
  if (!privateKeyRaw) {
    configError = 'SOLANA_PRIVATE_KEY is missing from environment. Please create a .env file containing SOLANA_PRIVATE_KEY="your_key_here".';
  } else {
    try {
      let secretKey;
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
          throw new Error("Invalid private key format: parsed JSON is not an array");
        }
      } else {
        secretKey = decodeBase58(trimmed);
      }
      if (secretKey.length !== 64) {
        throw new Error(`Invalid private key length: expected 64 bytes, got ${secretKey.length} bytes`);
      }
      payerKeypair = import_web3.Keypair.fromSecretKey(secretKey);
      payerPublicKey = payerKeypair.publicKey.toBase58();
    } catch (err) {
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
  try {
    const connection = new import_web3.Connection(config.rpcUrl, "confirmed");
    const balanceLamports = await connection.getBalance(config.payerKeypair.publicKey);
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
  } catch (err) {
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
    let toPublicKey;
    try {
      toPublicKey = new import_web3.PublicKey(recipientAddress);
    } catch {
      return res.status(400).json({ success: false, error: "The provided wallet address is not a valid Solana public key." });
    }
    const connection = new import_web3.Connection(config.rpcUrl, "confirmed");
    const solRate = await getSolToUsdRate();
    const solAmount = Number(amount) / solRate;
    let lamports = Math.round(solAmount * 1e9);
    if (lamports <= 0) {
      lamports = 1;
    }
    try {
      const rentExemptMin = await connection.getMinimumBalanceForRentExemption(0);
      const recipientBalance = await connection.getBalance(toPublicKey);
      if (recipientBalance === 0 && lamports < rentExemptMin) {
        console.log(`Bumping lamports from ${lamports} to ${rentExemptMin} to satisfy recipient account rent-exemption.`);
        lamports = rentExemptMin;
      } else if (recipientBalance > 0 && recipientBalance + lamports < rentExemptMin) {
        lamports = rentExemptMin - recipientBalance;
      }
    } catch (rentErr) {
      console.warn("Failed to check recipient rent exemption from Solana connection. Proceeding with calculated lamports:", rentErr);
    }
    const payerBalance = await connection.getBalance(config.payerKeypair.publicKey);
    const rentExemptFeeSafety = 5e3;
    if (payerBalance < lamports + rentExemptFeeSafety) {
      return res.status(400).json({
        success: false,
        error: `Insufficient balance on disbursing server wallet.

Required: ${(lamports / 1e9).toFixed(9)} SOL ($${Number(amount).toFixed(4)} USD) + fee
Current Payer Balance: ${(payerBalance / 1e9).toFixed(9)} SOL

Payer Wallet Address: ${config.payerPublicKey}
Please deposit/faucet test SOL into this payer address on Solana ${config.network}.`
      });
    }
    const transaction = new import_web3.Transaction().add(
      import_web3.SystemProgram.transfer({
        fromPubkey: config.payerKeypair.publicKey,
        toPubkey: toPublicKey,
        lamports
      })
    );
    const signature = await (0, import_web3.sendAndConfirmTransaction)(
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
  } catch (err) {
    console.error("Solana withdraw transaction failed:", err);
    let errorMessage = err.message || String(err);
    if (err.logs && Array.isArray(err.logs)) {
      errorMessage += `

Logs:
${err.logs.join("\n")}`;
    }
    return res.status(500).json({
      success: false,
      error: `Transaction failed: ${errorMessage}. Please try again later.`
    });
  }
});
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server successfully started on http://0.0.0.0:${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
