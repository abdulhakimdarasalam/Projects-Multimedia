const { DataTypes } = require("sequelize");
const sequalize = require("../config/db");

const Project = sequalize.define("Project", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  start_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  end_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM("pending", "ongoing", "completed", "cancelled"),
    defaultValue: "pending",
  },
});

module.exports = Project;
