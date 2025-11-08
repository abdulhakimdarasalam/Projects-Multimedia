// tokenBlacklist.js
const jwt = require("jsonwebtoken");

// Blacklist disimpan di memori (untuk produksi, gunakan Redis agar scalable)
const tokenBlacklist = new Map();

// Durasi maksimum Access Token (harus sama dengan JWT exp)
const TOKEN_LIFETIME = 15 * 60 * 1000; // 15 menit

// Tambahkan token ke blacklist
function addToBlacklist(token) {
  try {
    const decoded = jwt.decode(token);
    const exp = decoded?.exp ? decoded.exp * 1000 : Date.now() + TOKEN_LIFETIME;
    tokenBlacklist.set(token, exp);
  } catch (err) {
    console.error("Gagal menambahkan token ke blacklist:", err);
  }
}

// Cek apakah token sudah diblacklist
function isBlacklisted(token) {
  return tokenBlacklist.has(token);
}

// Hapus token yang sudah expired dari blacklist (auto cleanup)
function cleanupBlacklist() {
  const now = Date.now();
  for (const [token, exp] of tokenBlacklist.entries()) {
    if (exp < now) {
      tokenBlacklist.delete(token);
    }
  }
}

// Jalankan cleanup setiap 10 menit agar ringan
setInterval(cleanupBlacklist, 10 * 60 * 1000).unref();

module.exports = { addToBlacklist, isBlacklisted };
