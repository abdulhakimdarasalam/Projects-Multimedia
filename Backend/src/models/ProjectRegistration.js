const { DataTypes } = require("sequelize");
const sequalize = require("../config/db");

const ProjectRegistration = sequalize.define("ProjectRegistration", {
  status: {
    type: DataTypes.ENUM("pending", "accepted", "rejected"),
    defaultValue: "pending",
  },
  rejection_reason: {
    type: DataTypes.STRING,
    allowNull: true,
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
  project_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Projects",
      key: "id",
    },
    validate: {
      notEmpty: {
        msg: "Project ID is required",
      },
      notNull: {
        msg: "Project ID is required",
      },
    },
  },
});

module.exports = ProjectRegistration;
