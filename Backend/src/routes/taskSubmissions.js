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

router.post(
  "/",
  verifyToken,
  isAdmin,
  autoRefreshToken,
  taskSubmissionController.createTaskSubmission
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
