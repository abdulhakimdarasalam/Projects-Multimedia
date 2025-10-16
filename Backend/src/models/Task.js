const { DataTypes } = require("sequelize");
const sequalize = require("../config/db");

const Task = sequalize.define(
  "Task",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Name is required",
        },
        notNull: {
          msg: "Name is required",
        },
      },
    },
    description: {
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
    value_weight: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Value weight is required" },
        notNull: { msg: "Value weight is required" },
        isInt: { msg: "Value weight must be an integer" },
        min: {
          args: [1],
          msg: "Value weight must be at least 1",
        },
        max: {
          args: [10],
          msg: "Value weight cannot be more than 10",
        },
      },
    },
    project_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Projects",
        key: "id",
      },
      validate: {
        notNull: { msg: "Project ID is required" },
        isInt: { msg: "Project ID must be an integer" },
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

module.exports = Task;
