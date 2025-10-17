const express = require("express");

const router = express.Router();
const projectsController = require("../controllers/projects");
const {
  verifyToken,
  isAdmin,
  autoRefreshToken,
} = require("../middlewares/authMiddleware");

router.get(
  "/data",
  verifyToken,
  autoRefreshToken,
  projectsController.getAllProjects
);
router.post(
  "/create",
  verifyToken,
  isAdmin,
  autoRefreshToken,
  projectsController.createProject
);
router.put(
  "/edit/:id",
  verifyToken,
  isAdmin,
  autoRefreshToken,
  projectsController.updateProject
);
router.delete(
  "/delete/:id",
  verifyToken,
  isAdmin,
  autoRefreshToken,
  projectsController.deleteProject
);

module.exports = router;
