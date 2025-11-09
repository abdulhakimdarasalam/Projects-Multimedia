const db = require("../models");

exports.getAdminDashboardData = async (req, res) => {
  try {
    // --- 1. Persiapan Paginasi untuk Tabel ---
    const page = parseInt(req.query.page) || 1;
    const limit = 5;
    const offset = (page - 1) * limit;

    const queries = [
      // Query 0: Total User
      db.User.count({ where: { role: "MEMBER" } }),

      // Query 1: Project Aktif (ongoing)
      db.Project.count({ where: { status: "ongoing" } }),

      // Query 2: Project Completed
      db.Project.count({ where: { status: "completed" } }),

      db.Project.findAndCountAll({
        limit: limit,
        offset: offset,
        order: [["end_date", "ASC"]],
        include: [
          {
            model: db.Task,
            attributes: ["id"],
          },
        ],
        distinct: true,
      }),

      db.Project.count(), // <-- Ini untuk "Total Project"

      // Query 5: Project Pending (untuk Pie Chart)
      db.Project.count({ where: { status: "pending" } }),
    ];

    // --- 3. Eksekusi Semua Query secara Paralel ---
    const [
      totalUsersCount,
      activeProjectsCount, // "ongoing"
      completedProjectsCount,
      paginatedProjects,
      totalProjectsCount, // (Total semua status)
      pendingProjectsCount,
    ] = await Promise.all(queries);

    const summary = {
      totalProjects: totalProjectsCount,
      activeProjects: activeProjectsCount,
      totalUsers: totalUsersCount,
    };

    const projectStatusChart = [
      { status: "completed", count: completedProjectsCount },
      { status: "ongoing", count: activeProjectsCount },
      { status: "pending", count: pendingProjectsCount },
    ];

    // C. Data untuk Tabel (List Project Overview)
    const { count: totalItems, rows: projects } = paginatedProjects;
    const totalPages = Math.ceil(totalItems / limit);

    const projectList = {
      projects: projects.map((project) => ({
        id: project.id,
        namaProject: project.title,
        tugas: project.Tasks ? project.Tasks.length : 0, // Cek jika Tasks ada
        deadline: project.end_date,
        status: project.status,
      })),
      pagination: {
        currentPage: page,
        totalPages: totalPages,
        totalItems: totalItems,
        limit: limit,
      },
    };

    res.status(200).json({
      summary,
      projectStatusChart,
      projectList,
    });
  } catch (error) {
    console.error("Error fetching admin dashboard data:", error);
    res.status(500).json({
      message: "Gagal mengambil data dashboard",
      error: error.message,
    });
  }
};
