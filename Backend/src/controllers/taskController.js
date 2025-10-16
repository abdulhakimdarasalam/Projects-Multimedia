const { Task } = require("../models");
const { ValidationError } = require("sequelize");

exports.getAllTasksByProjectId = async (req, res) => {
  try {
    const { id } = req.params;
    const tasks = await Task.findAll({ where: { project_id: id } });
    res.status(200).json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

exports.createTask = async (req, res) => {
  try {
    const {
      name,
      description,
      start_date,
      deadline,
      value_weight,
      project_id,
    } = req.body;
    const task = await Task.create({
      name,
      description,
      start_date,
      deadline,
      value_weight,
      project_id,
    });
    res.status(201).json(task);
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

    res.status(500).json({ message: "Something went wrong" });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, start_date, deadline, value_weight } = req.body;
    const task = await Task.findByPk(id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    if (name !== undefined) task.name = name;
    if (description !== undefined) task.description = description;
    if (start_date !== undefined) task.start_date = start_date;
    if (deadline !== undefined) task.deadline = deadline;
    if (value_weight !== undefined) task.value_weight = value_weight;
    await task.save();
    res.status(200).json({ message: "Task updated successfully", task });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findByPk(id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    await task.destroy();
    res.status(200).json({ message: "Task deleted (soft) successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
