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

router.post(
  "/",
  verifyToken,
  autoRefreshToken,
  projectRegistrationsController.createProjectRegistration
);

router.put(
  "/:id/accept",
  verifyToken,
  isAdmin,
  autoRefreshToken,
  projectRegistrationsController.acceptRegistration
);
router.put(
  "/:id/reject",
  verifyToken,
  isAdmin,
  autoRefreshToken,
  projectRegistrationsController.rejectRegistration
);

module.exports = router;
