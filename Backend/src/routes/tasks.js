const express = require("express");

const router = express.Router();
const taskController = require("../controllers/taskController");
const {
  verifyToken,
  isAdmin,
  autoRefreshToken,
} = require("../middlewares/authMiddleware");

router.get("/:id", taskController.getAllTasksByProjectId);
router.post(
  "/",
  verifyToken,
  isAdmin,
  autoRefreshToken,
  taskController.createTask
);
router.put(
  "/:id",
  verifyToken,
  isAdmin,
  autoRefreshToken,
  taskController.updateTask
);
router.delete(
  "/:id",
  verifyToken,
  isAdmin,
  autoRefreshToken,
  taskController.deleteTask
);

module.exports = router;
