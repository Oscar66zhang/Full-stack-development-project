const crypto = require("crypto");

const KEY_LENGTH = 64;

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const derivedKey = crypto.scryptSync(String(password), salt, KEY_LENGTH);

  return `scrypt$${salt}$${derivedKey.toString("hex")}`;
}

function verifyPassword(password, storedPassword) {
  if (!storedPassword || typeof storedPassword !== "string") return false;

  const [algorithm, salt, storedKey] = storedPassword.split("$");
  if (algorithm !== "scrypt" || !salt || !storedKey) return false;

  try {
    const storedBuffer = Buffer.from(storedKey, "hex");
    if (storedBuffer.length !== KEY_LENGTH) return false;

    const suppliedBuffer = crypto.scryptSync(
      String(password),
      salt,
      storedBuffer.length,
    );

    return crypto.timingSafeEqual(storedBuffer, suppliedBuffer);
  } catch {
    return false;
  }
}

module.exports = { hashPassword, verifyPassword };
