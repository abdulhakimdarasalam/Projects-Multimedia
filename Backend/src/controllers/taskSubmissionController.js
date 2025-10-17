const { User, Task, TaskSubmission } = require("../models");
const { ValidationError } = require("sequelize");

exports.getTaskSubmissionById = async (req, res) => {
  try {
    const taskSubmission = await TaskSubmission.findByPk(req.params.id);
    if (!taskSubmission) {
      return res.status(404).json({ message: "Task submission not found" });
    }
    res.status(200).json(taskSubmission);
  } catch (error) {
    if (error instanceof ValidationError) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Internal server error" });
    }
  }
};

// Ambil semua task submission berdasarkan user_id dengan filter status
// Contoh di fe: GET /users/123/task-submissions?status=pending/all/approved/rejected
exports.getAllTaskSubmissionsByUserId = async (req, res) => {
  try {
    const { status } = req.query; // Ambil query param 'status' (opsional)
    const whereClause = { user_id: req.params.userId };

    // Filter berdasarkan status kalau ada
    if (status && status !== "all") {
      whereClause.status = status; // Asumsi kolom 'status' di model
    }

    const taskSubmissions = await TaskSubmission.findAll({
      where: whereClause,
      // Optional: Include associations untuk data lengkap (e.g., task details)
      include: [
        { model: Task, as: "Task" }, // Dari associations sebelumnya
        { model: User, as: "User" }, // Kalau butuh user info tambahan
      ],
      // Optional: Order by createdAt atau status
      order: [["createdAt", "DESC"]],
      // Optional: Pagination untuk performa
      limit: req.query.limit ? parseInt(req.query.limit) : 50,
      offset: req.query.offset ? parseInt(req.query.offset) : 0,
    });

    // Kalau status='all', bisa tambah grouping di response (opsional, biar FE nggak filter)
    let responseData = taskSubmissions;
    if (status === "all") {
      // Grouping manual di BE (kalau data nggak terlalu banyak)
      const grouped = {
        pending: taskSubmissions.filter((ts) => ts.status === "pending"),
        completed: taskSubmissions.filter((ts) => ts.status === "completed"),
        rejected: taskSubmissions.filter((ts) => ts.status === "rejected"),
      };
      responseData = grouped;
    }

    res.status(200).json({
      data: responseData,
      total: taskSubmissions.length,
      status: status || "all",
    });
  } catch (error) {
    console.error(error);
    if (error instanceof ValidationError) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Internal server error" });
    }
  }
};

exports.createTaskSubmission = async (req, res) => {
  try {
    const existingTaskSubmission = await TaskSubmission.findOne({
      where: {
        task_id: req.body.task_id,
      },
    });

    if (existingTaskSubmission) {
      return res
        .status(400)
        .json({ message: "Task submission already exists" });
    }

    const task = await Task.findByPk(req.body.task_id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const { user_id, task_id } = req.body;
    const taskSubmission = await TaskSubmission.create({
      user_id,
      task_id,
      start_date: task.start_date,
      deadline: task.deadline,
    });
    res.status(201).json(taskSubmission);
  } catch {
    if (error instanceof ValidationError) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Internal server error" });
    }
  }
};

exports.updateTaskSubmission = async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id, task_id } = req.body;
    const taskSubmission = await TaskSubmission.findByPk(id);
    if (!taskSubmission) {
      return res.status(404).json({ message: "Task submission not found" });
    }
    if (user_id !== undefined) taskSubmission.user_id = user_id;
    if (task_id !== undefined) taskSubmission.task_id = task_id;
    await taskSubmission.save();
    res.status(200).json({ message: "Task submission updated successfully" });
  } catch (error) {
    if (error instanceof ValidationError) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Internal server error" });
    }
  }
};

exports.deleteTaskSubmission = async (req, res) => {
  try {
    const { id } = req.params;
    const taskSubmission = await TaskSubmission.findByPk(id);
    if (!taskSubmission) {
      return res.status(404).json({ message: "Task submission not found" });
    }
    await taskSubmission.destroy();
    res.status(200).json({ message: "Task submission deleted successfully" });
  } catch (error) {
    if (error instanceof ValidationError) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Internal server error" });
    }
  }
};

exports.submitTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const taskSubmission = await TaskSubmission.findByPk(id);
    if (!taskSubmission) {
      return res.status(404).json({ message: "Task submission not found" });
    }

    if (taskSubmission.status === "submitted") {
      return res
        .status(400)
        .json({ message: "Task submission has already been submitted" });
    }

    if (content !== undefined) taskSubmission.content = content;
    taskSubmission.status = "submitted";
    taskSubmission.submitted_at = new Date();
    await taskSubmission.save();
    res.status(200).json({ message: "Task submission updated successfully" });
  } catch (error) {
    if (error instanceof ValidationError) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Internal server error" });
    }
  }
};

exports.approveTask = async (req, res) => {
  try {
    const { id } = req.params;
    const taskSubmission = await TaskSubmission.findByPk(id);
    if (!taskSubmission) {
      return res.status(404).json({ message: "Task submission not found" });
    }
    taskSubmission.status = "approved";
    await taskSubmission.save();
    res.status(200).json({ message: "Task submission updated successfully" });
  } catch (error) {
    if (error instanceof ValidationError) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Internal server error" });
    }
  }
};

exports.rejectTask = async (req, res) => {
  try {
    const { id } = req.params;
    // Validasi req.body dan rejection_reason
    if (!req.body) {
      return res.status(400).json({
        message:
          "Body request tidak boleh kosong. Kirim data JSON dengan rejection_reason.",
      });
    }

    const { rejection_reason } = req.body;
    if (!rejection_reason || rejection_reason.trim() === "") {
      return res.status(400).json({
        message:
          "Alasan penolakan (rejection_reason) wajib diisi dan tidak boleh kosong.",
      });
    }
    const taskSubmission = await TaskSubmission.findByPk(id);
    if (!taskSubmission) {
      return res.status(404).json({ message: "Task submission not found" });
    }
    taskSubmission.rejection_reason = rejection_reason;
    taskSubmission.status = "rejected";
    await taskSubmission.save();
    res.status(200).json({ message: "Task submission updated successfully" });
  } catch (error) {
    console.error(error);
    if (error instanceof ValidationError) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Internal server error" });
    }
  }
};
