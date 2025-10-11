const express = require("express");

const router = express.Router();
const projectRegistrationsController = require("../controllers/projectRegistrationsController");
const { verifyToken, isAdmin } = require("../middlewares/authMiddleware");

router.get(
  "/data",
  verifyToken,
  projectRegistrationsController.getAllProjectRegistrations
);
router.get(
  "/acc/data",
  verifyToken,
  projectRegistrationsController.getAllAcceptedProjectRegistrations
);
router.get(
  "/rejected/data",
  verifyToken,
  projectRegistrationsController.getAllRejectedProjectRegistrations
);

router.post(
  "/create",
  verifyToken,
  projectRegistrationsController.createProjectRegistration
);

router.put(
  "/acc/:id",
  verifyToken,
  isAdmin,
  projectRegistrationsController.acceptRegistration
);
router.put(
  "/reject/:id",
  verifyToken,
  isAdmin,
  projectRegistrationsController.rejectRegistration
);

module.exports = router;
