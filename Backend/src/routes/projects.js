const express = require("express");

const router = express.Router();
const projectsController = require("../controllers/projects");
const {
  verifyToken,
  isAdmin,
  autoRefreshToken,
} = require("../middlewares/authMiddleware");

router.get(
  "/",
  verifyToken,
  autoRefreshToken,
  projectsController.getAllProjects
);
router.post(
  "/",
  verifyToken,
  isAdmin,
  autoRefreshToken,
  projectsController.createProject
);
router.put(
  "/:id",
  verifyToken,
  isAdmin,
  autoRefreshToken,
  projectsController.updateProject
);
router.delete(
  "/:id",
  verifyToken,
  isAdmin,
  autoRefreshToken,
  projectsController.deleteProject
);

module.exports = router;
