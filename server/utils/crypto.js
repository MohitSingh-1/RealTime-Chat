import crypto from "crypto";

// Secret key (32 bytes for AES-256)
const SECRET_KEY = process.env.ENCRYPTION_SECRET || "12345678901234567890123456789012"; // 32 chars
const IV_LENGTH = 16; // AES block size

// Encrypt message
export const encrypt = (text) => {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(SECRET_KEY), iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return `${iv.toString("hex")}:${encrypted}`; // Store iv + encrypted data
};

// Decrypt message
export const decrypt = (data) => {
  const [ivHex, encryptedData] = data.split(":");
  const iv = Buffer.from(ivHex, "hex");
  const decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(SECRET_KEY), iv);
  let decrypted = decipher.update(encryptedData, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
};
