const { Project, User, ProjectRegistration } = require("../models");
const { ValidationError } = require("sequelize");

// Ambil data project registrations dengan filter status
// Contoh di fe: GET /project-registrations?status=all/pending/accepted/rejected
exports.getAllProjectRegistrations = async (req, res) => {
  try {
    const { status } = req.query; // Ambil query param 'status' (opsional)
    const whereClause = {}; // Mulai tanpa filter, tambah nanti

    // Filter berdasarkan status kalau ada
    if (status && status !== "all") {
      // Validasi status valid
      const validStatuses = ["pending", "accepted", "rejected"]; // Sesuaikan enum di model
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          message: "Status tidak valid. Gunakan: pending, accepted, rejected",
        });
      }
      whereClause.status = status;
    }

    const projectRegistrations = await ProjectRegistration.findAll({
      where: whereClause,
      include: [
        { model: Project, as: "Project" },
        { model: User, as: "User" },
      ],
      order: [["createdAt", "DESC"]],
      // Optional: Pagination
      limit: req.query.limit ? parseInt(req.query.limit) : 50,
      offset: req.query.offset ? parseInt(req.query.offset) : 0,
    });

    // Kalau status='all', grouping manual di BE (opsional, biar FE nggak filter)
    let responseData = projectRegistrations;
    if (status === "all" || !status) {
      const grouped = {
        pending: projectRegistrations.filter((pr) => pr.status === "pending"),
        accepted: projectRegistrations.filter((pr) => pr.status === "accepted"),
        rejected: projectRegistrations.filter((pr) => pr.status === "rejected"),
      };
      responseData = grouped;
    }

    res.status(200).json({
      data: responseData,
      total: projectRegistrations.length,
      status: status || "all", // Info untuk FE
    });
  } catch (error) {
    console.error("Error fetching project registrations:", error);
    if (error instanceof ValidationError) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Something went wrong" });
    }
  }
};

exports.getMyProjects = async (req, res) => {
  try {
    // Ambil userId dari JWT payload (yang diisi oleh middleware verifyToken)
    const userId = req.user.id;

    if (!userId) {
      return res
        .status(401)
        .json({ message: "User ID tidak ditemukan pada token." });
    }

    // Ambil semua project milik user tersebut
    const projects = await ProjectRegistration.findAll({
      where: { user_id: userId },
      include: [{ model: Project, as: "Project" }],
    });

    // Jika tidak ada project
    if (projects.length === 0) {
      return res
        .status(404)
        .json({ message: "Belum ada proyek yang dibuat oleh user ini." });
    }

    res.status(200).json(projects);
  } catch (error) {
    console.error("Error mengambil proyek user:", error);
    res
      .status(500)
      .json({ message: "Terjadi kesalahan saat mengambil proyek." });
  }
};

exports.createProjectRegistration = async (req, res) => {
  try {
    const { project_id } = req.body;
    const user_id = req.user.id; // ambil dari middleware verifyToken

    // Validasi input
    if (!project_id) {
      return res.status(400).json({ message: "project_id wajib diisi." });
    }

    // Cek apakah user sudah pernah daftar ke project yang sama
    const existingRegistration = await ProjectRegistration.findOne({
      where: { user_id, project_id },
    });

    if (existingRegistration) {
      return res.status(400).json({
        message: "Anda sudah mendaftar ke project ini sebelumnya.",
      });
    }

    // Buat pendaftaran baru
    const registration = await ProjectRegistration.create({
      user_id,
      project_id,
    });

    res.status(201).json({
      message: "Pendaftaran project berhasil dikirim.",
      registration,
    });
  } catch (error) {
    console.error("Error creating project registration:", error);
    res.status(500).json({
      message: "Terjadi kesalahan pada server.",
    });
  }
};

exports.acceptRegistration = async (req, res) => {
  try {
    const { id } = req.params;
    const registration = await ProjectRegistration.findByPk(id);

    if (!registration) {
      return res.status(404).json({ message: "Pendaftaran tidak ditemukan." });
    }

    await registration.update({ status: "accepted" });
    res.status(200).json({
      message: "Pendaftaran diterima.",
      data: registration,
    });
  } catch {
    console.error("Error accepting project registration:", error);
    res.status(500).json({
      message: "Terjadi kesalahan pada server.",
    });
  }
};

exports.rejectRegistration = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({
        message:
          "Body request tidak ditemukan. Pastikan Content-Type: application/json dan body dikirim dengan benar.",
      });
    }

    const { id } = req.params;
    const { rejection_reason } = req.body;

    // Pastikan rejection_reason ada
    if (!rejection_reason) {
      return res
        .status(400)
        .json({ message: "Alasan penolakan (rejection_reason) wajib diisi." });
    }

    const registration = await ProjectRegistration.findByPk(id);

    if (!registration) {
      return res.status(404).json({ message: "Pendaftaran tidak ditemukan." });
    }

    await registration.update({
      status: "rejected",
      rejection_reason,
    });
    res.status(200).json({ message: "Pendaftaran ditolak." });
  } catch (error) {
    console.error("Error rejecting project registration:", error);
    res.status(500).json({
      message: "Terjadi kesalahan pada server.",
    });
  }
};
