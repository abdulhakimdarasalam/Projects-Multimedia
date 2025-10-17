const express = require("express");

const router = express.Router();
const taskController = require("../controllers/taskController");
const {
  verifyToken,
  isAdmin,
  autoRefreshToken,
} = require("../middlewares/authMiddleware");

router.get("/data/:id", taskController.getAllTasksByProjectId);
router.post(
  "/create",
  verifyToken,
  isAdmin,
  autoRefreshToken,
  taskController.createTask
);
router.put(
  "/edit/:id",
  verifyToken,
  isAdmin,
  autoRefreshToken,
  taskController.updateTask
);
router.delete(
  "/delete/:id",
  verifyToken,
  isAdmin,
  autoRefreshToken,
  taskController.deleteTask
);

module.exports = router;
