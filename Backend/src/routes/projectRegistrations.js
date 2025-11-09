const express = require("express");
const router = express.Router();
const projectRegistrationsController = require("../controllers/projectRegistrationsController");
const {
  verifyToken,
  isAdmin,
  autoRefreshToken,
} = require("../middlewares/authMiddleware");

router.get(
  "/",
  verifyToken,
  autoRefreshToken,
  projectRegistrationsController.getAllProjectRegistrations
);
router.get(
  "/my",
  verifyToken,
  autoRefreshToken,
  projectRegistrationsController.getMyProjects
);
router.post(
  "/",
  verifyToken,
  autoRefreshToken,
  projectRegistrationsController.createProjectRegistration
);

router.patch(
  "/:id/accept",
  verifyToken,
  isAdmin,
  autoRefreshToken,
  projectRegistrationsController.acceptRegistration
);

router.patch(
  "/:id/reject",
  verifyToken,
  isAdmin,
  autoRefreshToken,
  projectRegistrationsController.rejectRegistration
);

module.exports = router;
