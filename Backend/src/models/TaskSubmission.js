const { DataTypes } = require("sequelize");
const sequalize = require("../config/db");

const TaskSubmission = sequalize.define(
  "TaskSubmission",
  {
    content: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    start_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Start date is required",
        },
        notNull: {
          msg: "Start date is required",
        },
      },
    },
    deadline: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Deadline is required",
        },
        notNull: {
          msg: "Deadline is required",
        },
      },
    },
    submitted_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("pending", "submitted", "approved", "rejected"),
      defaultValue: "pending",
    },
    rejection_reason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    task_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Tasks",
        key: "id",
      },
      validate: {
        notEmpty: {
          msg: "Task ID is required",
        },
        notNull: {
          msg: "Task ID is required",
        },
      },
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
      validate: {
        notEmpty: {
          msg: "User ID is required",
        },
        notNull: {
          msg: "User ID is required",
        },
      },
    },
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    paranoid: true,
    deletedAt: "deleted_at",
    timestamps: true,
  }
);

module.exports = TaskSubmission;
