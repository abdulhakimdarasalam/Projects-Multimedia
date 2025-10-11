const express = require("express");

const router = express.Router();
const projectsController = require("../controllers/projects");
const { verifyToken, isAdmin } = require("../middlewares/authMiddleware");
const { route } = require("./users");

router.get("/data", verifyToken, projectsController.getAllProjects);
router.post("/create", verifyToken, isAdmin, projectsController.createProject);
router.put("/edit/:id", verifyToken, isAdmin, projectsController.updateProject);
router.delete("/delete/:id", verifyToken, isAdmin, projectsController.deleteProject);

module.exports = router;
