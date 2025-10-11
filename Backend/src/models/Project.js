const { DataTypes } = require("sequelize");
const sequalize = require("../config/db");

const Project = sequalize.define(
  "Project",
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Title is required",
        },
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        notEmpty: {
          msg: "Description is required",
        },
      },
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Start date is required",
        },
      },
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "End date is required",
        },
      },
    },
    status: {
      type: DataTypes.ENUM("pending", "ongoing", "completed", "cancelled"),
      defaultValue: "pending",
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    paranoid: true,
    deletedAt: "deletedAt",
    timestamps: true,
  }
);

module.exports = Project;
