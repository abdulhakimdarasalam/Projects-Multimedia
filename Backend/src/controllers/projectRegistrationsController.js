const { ProjectRegistration } = require("../models");

exports.getAllProjectRegistrations = async (req, res) => {
  try {
    const projectRegistrations = await ProjectRegistration.findAll();
    res.status(200).json(projectRegistrations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

exports.getAllRejectedProjectRegistrations = async (req, res) => {
  try {
    const projectRegistrations = await ProjectRegistration.findAll({
      where: { status: "rejected" },
    });
    res.status(200).json(projectRegistrations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

exports.getAllAcceptedProjectRegistrations = async (req, res) => {
  try {
    const projectRegistrations = await ProjectRegistration.findAll({
      where: { status: "accepted" },
    });
    res.status(200).json(projectRegistrations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
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
    res.status(200).json({ message: "Pendaftaran diterima." });
  } catch {
    console.error("Error accepting project registration:", error);
    res.status(500).json({
      message: "Terjadi kesalahan pada server.",
    });
  }
};

exports.rejectRegistration = async (req, res) => {
  try {
    const { id } = req.params;
    const { rejection_reason } = req.body;
    const registration = await ProjectRegistration.findByPk(id);

    if (!registration) {
      return res.status(404).json({ message: "Pendaftaran tidak ditemukan." });
    }

    await registration.update({
      status: "rejected",
      rejection_reason,
    });
    res.status(200).json({ message: "Pendaftaran ditolak." });
  } catch {
    console.error("Error rejecting project registration:", error);
    res.status(500).json({
      message: "Terjadi kesalahan pada server.",
    });
  }
};
