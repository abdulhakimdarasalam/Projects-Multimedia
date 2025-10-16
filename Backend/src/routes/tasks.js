const express = require("express");

const router = express.Router();
const taskController = require("../controllers/taskController");
const { verifyToken, isAdmin } = require("../middlewares/authMiddleware");

router.get("/data/:id", taskController.getAllTasksByProjectId);
router.post("/create", verifyToken, isAdmin, taskController.createTask);
router.put("/edit/:id", verifyToken, isAdmin, taskController.updateTask);
router.delete("/delete/:id", verifyToken, isAdmin, taskController.deleteTask);

module.exports = router;
