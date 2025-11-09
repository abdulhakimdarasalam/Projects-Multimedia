// routes/projects.js
const express = require("express");
const router = express.Router();

// 1. Impor semua controller yang relevan
const projectsController = require("../controllers/projects");
const { verifyToken, isAdmin } = require("../middlewares/authMiddleware"); // <-- HAPUS 'autoRefreshToken' dari sini

// 2. Rute baru untuk dashboard user (HANYA perlu verifyToken)
router.get(
  "/my-projects",
  verifyToken, // <-- Rute ini untuk user, jadi TIDAK perlu isAdmin
  projectsController.getMyProjects
);

// 3. Rute-rute lama kamu (TANPA 'autoRefreshToken')
router.get("/", verifyToken, projectsController.getAllProjects);

router.post("/", verifyToken, isAdmin, projectsController.createProject);

router.put("/:id", verifyToken, isAdmin, projectsController.updateProject);

router.delete("/:id", verifyToken, isAdmin, projectsController.deleteProject);

module.exports = router;
