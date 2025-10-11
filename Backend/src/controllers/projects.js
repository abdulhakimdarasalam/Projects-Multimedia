const { Project } = require("../models");
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

    // Tangani error validasi dari Sequelize
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

    // Tangani error lain
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
    // update hanya field yang dikirim
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
    res.status(200).json({ message: "Project deleted (soft) successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
