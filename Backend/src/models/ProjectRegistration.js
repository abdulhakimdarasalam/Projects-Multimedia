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
});

module.exports = ProjectRegistration;
