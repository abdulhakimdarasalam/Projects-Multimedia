const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const User = sequelize.define("User", {
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
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: {
        msg: "Email is required",
      },
      notNull: {
        msg: "Email is required",
      },
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Password is required",
      },
      notNull: {
        msg: "Password is required",
      },
    },
  },
  role: { type: DataTypes.ENUM("admin", "member"), defaultValue: "member" },
});

module.exports = User;
