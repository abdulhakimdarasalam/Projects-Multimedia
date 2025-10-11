const { Project } = require("../models");

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
    res.status(500).json({ message: "Something went wrong" });
  }
};
