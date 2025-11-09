const { Project, ProjectRegistration, sequelize } = require("../models"); // <-- Tambah ProjectRegistration
const { ValidationError } = require("sequelize");

exports.getAllProjects = (req, res) => {
  Project.findAll()
    .then((projects) => {
      res.status(200).json(projects);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ message: "Something went wrong" });
    });
};

exports.createProject = async (req, res) => {
  try {
    const { title, description, start_date, end_date } = req.body;
    const project = await Project.create({
      title,
      description,
      start_date,
      end_date,
    });
    res.status(201).json({ message: "Project created successfully", project });
  } catch (error) {
    console.error(error);
    if (error instanceof ValidationError) {
      const messages = error.errors.map((err) => ({
        field: err.path,
        message: err.message,
      }));
      return res.status(400).json({
        message: "Validasi gagal, beberapa field wajib diisi dengan benar.",
        errors: messages,
      });
    }
    res.status(500).json({
      message: "Terjadi kesalahan pada server.",
    });
  }
};

exports.updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, start_date, end_date, status } = req.body;
    const project = await Project.findByPk(id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    if (title !== undefined) project.title = title;
    if (description !== undefined) project.description = description;
    if (start_date !== undefined) project.start_date = start_date;
    if (end_date !== undefined) project.end_date = end_date;
    if (status !== undefined) project.status = status;
    await project.save();
    res.status(200).json({ message: "Project updated successfully", project });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findByPk(id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    await project.destroy();
    res.status(200).json({
      message: "Project deleted (soft) successfully",
      project,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// ===============================================
// INI FUNGSI BARU UNTUK DASHBOARD USER
// ===============================================
/**
 * @desc    Mengambil daftar project milik user (untuk dashboard)
 * @route   GET /projects/my-projects
 * @access  Private (via verifyToken)
 */
exports.getMyProjects = async (req, res) => {
  try {
    const userId = req.user.id;
    const limit = parseInt(req.query.limit, 10) || 4;

    const registrations = await ProjectRegistration.findAll({
      where: { user_id: userId },
      limit: limit,
      include: [
        {
          model: Project,
          required: true,
        },
      ],
      order: [[Project, "updatedAt", "DESC"]],
    });

    const projects = registrations.map((reg) => {
      const p = reg.Project;
      return {
        id: p.id,
        category: "Project", // Placeholder
        title: p.title,
        description: p.description,
        deadline: p.end_date,
        lastUpdate: p.updatedAt,
      };
    });

    res.status(200).json({
      status: "success",
      data: projects,
    });
  } catch (error) {
    console.error("Get My Projects Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
