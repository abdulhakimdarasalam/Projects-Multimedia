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
        notNull: {
          msg: "Title is required",
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
    end_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "End date is required",
        },
        notNull: {
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
