const express = require("express");
const router = express.Router();

const dashboardController = require("../controllers/dashboardAdminController");

const { verifyToken, isAdmin } = require("../middlewares/authMiddleware");

router.get(
  "/dashboard",
  verifyToken,
  isAdmin,
  dashboardController.getAdminDashboardData
);

module.exports = router;
