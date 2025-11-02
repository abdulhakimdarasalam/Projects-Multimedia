const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const User = sequelize.define(
  "User",
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

    // --- KOLOM BARU YANG DITAMBAHKAN ---
    phone: {
      type: DataTypes.STRING,
      allowNull: true, // Set 'true' jika boleh kosong, 'false' jika wajib
    },
    dob: {
      type: DataTypes.DATEONLY, // DATEONLY lebih baik untuk tgl lahir drpd DATE
      allowNull: true,
    },
    gender: {
      type: DataTypes.ENUM("Male", "Female"), // Sesuaikan dengan <select> di frontend
      allowNull: true,
    },
    // ---------------------------------

    role: { type: DataTypes.ENUM("admin", "member"), defaultValue: "member" },
    refresh_token: { type: DataTypes.TEXT, allowNull: true },
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    paranoid: true, // Ini untuk soft delete
    deletedAt: "deleted_at", // Memberitahu sequelize nama kolomnya
    timestamps: true,
  }
);

module.exports = User;
