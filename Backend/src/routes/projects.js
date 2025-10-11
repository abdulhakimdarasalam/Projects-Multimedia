const express = require("express");

const router = express.Router();
const projectsController = require("../controllers/projects");
const { verifyToken, isAdmin } = require("../middlewares/authMiddleware");

router.get("/data", verifyToken, projectsController.getAllProjects);
router.post("/create", verifyToken, isAdmin, projectsController.createProject);

module.exports = router;
