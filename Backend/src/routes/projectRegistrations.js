const express = require("express");

const router = express.Router();
const projectRegistrationsController = require("../controllers/projectRegistrationsController");
const {
  verifyToken,
  isAdmin,
  autoRefreshToken,
} = require("../middlewares/authMiddleware");

router.get(
  "/data",
  verifyToken,
  autoRefreshToken,
  projectRegistrationsController.getAllProjectRegistrations
);
router.get(
  "/acc/data",
  verifyToken,
  autoRefreshToken,
  projectRegistrationsController.getAllAcceptedProjectRegistrations
);
router.get(
  "/rejected/data",
  verifyToken,
  autoRefreshToken,
  projectRegistrationsController.getAllRejectedProjectRegistrations
);

router.post(
  "/create",
  verifyToken,
  autoRefreshToken,
  projectRegistrationsController.createProjectRegistration
);

router.put(
  "/acc/:id",
  verifyToken,
  isAdmin,
  autoRefreshToken,
  projectRegistrationsController.acceptRegistration
);
router.put(
  "/reject/:id",
  verifyToken,
  isAdmin,
  autoRefreshToken,
  projectRegistrationsController.rejectRegistration
);

module.exports = router;
