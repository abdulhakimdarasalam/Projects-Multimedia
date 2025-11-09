// controllers/dashboardUserController.js
const { User, Project, ProjectRegistration } = require("../models");
const { Op } = require("sequelize");

exports.getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id; // Diambil dari middleware verifyToken

    // 1. "Tugas Aktif Saya" (status 'ongoing')
    const activeProjects = await ProjectRegistration.count({
      where: { user_id: userId }, // <-- INI BENAR (pakai underscore)
      include: [
        {
          model: Project,
          required: true,
          where: { status: "ongoing" }, // Sesuai tabel 'Projects' kamu
        },
      ],
    });

    // 2. "Semua Projek" (Total project di DB)
    const allProjects = await Project.count();

    res.status(200).json({
      status: "success",
      data: {
        activeProjects: activeProjects,
        allProjects: allProjects,
      },
    });
  } catch (error) {
    console.error("Dashboard Stats Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
