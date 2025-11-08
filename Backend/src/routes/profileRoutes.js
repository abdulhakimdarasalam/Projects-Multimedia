// routes/profileRoutes.js
const express = require("express");
const {
  getMyProfile,
  updateMyProfile,
} = require("../controllers/profileController");
// Impor middleware kamu
const { verifyToken } = require("../middlewares/authMiddleware.js"); // <-- Sesuaikan path

const router = express.Router();

// Gunakan 'verifyToken' untuk melindungi kedua rute
router.get("/auth/me", verifyToken, getMyProfile);
router.put("/profile", verifyToken, updateMyProfile);

module.exports = router;
