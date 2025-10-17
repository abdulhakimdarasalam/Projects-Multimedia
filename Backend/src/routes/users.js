const express = require("express");

const router = express.Router();
const usersController = require("../controllers/users");
const {
  verifyToken,
  isAdmin,
  autoRefreshToken,
} = require("../middlewares/authMiddleware");

router.get(
  "/",
  verifyToken,
  isAdmin,
  autoRefreshToken,
  usersController.getAllUsers
);
router.post("/", usersController.createUser);

module.exports = router;
