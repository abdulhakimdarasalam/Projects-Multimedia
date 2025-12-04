const express = require("express");

const router = express.Router();
const taskSubmissionController = require("../controllers/taskSubmissionController");
const {
  verifyToken,
  isAdmin,
  autoRefreshToken,
} = require("../middlewares/authMiddleware");

const upload = require("../middlewares/upload");
const prepareUploadMeta = require("../middlewares/prepareUploadMeta");

router.get(
  "/:id",
  verifyToken,
  autoRefreshToken,
  taskSubmissionController.getTaskSubmissionById
);

router.get(
  "/user/:userId",
  verifyToken,
  autoRefreshToken,
  taskSubmissionController.getAllTaskSubmissionsByUserId
);

// Get all submissions for a specific task (admin review)
router.get(
  "/by-task/:taskId",
  verifyToken,
  autoRefreshToken,
  taskSubmissionController.getAllTaskSubmissionsByTaskId
);

router.post(
  "/",
  verifyToken,
  isAdmin,
  autoRefreshToken,
  taskSubmissionController.createTaskSubmission
);

// Auto-create submission for user (non-admin). User can create their own submission
// for a task they want to submit. If already exists, returns existing one.
router.post(
  "/auto-create",
  verifyToken,
  autoRefreshToken,
  taskSubmissionController.autoCreateTaskSubmission
);

router.put(
  "/:id",
  verifyToken,
  isAdmin,
  autoRefreshToken,
  taskSubmissionController.updateTaskSubmission
);

router.delete(
  "/:id",
  verifyToken,
  isAdmin,
  autoRefreshToken,
  taskSubmissionController.deleteTaskSubmission
);

router.put(
  "/:id/submit",
  verifyToken,
  autoRefreshToken,
  prepareUploadMeta,
  upload.single("content"),
  taskSubmissionController.submitTask
);

router.put(
  "/:id/approve",
  verifyToken,
  isAdmin,
  autoRefreshToken,
  taskSubmissionController.approveTask
);

router.put(
  "/:id/reject",
  verifyToken,
  isAdmin,
  autoRefreshToken,
  taskSubmissionController.rejectTask
);

module.exports = router;
