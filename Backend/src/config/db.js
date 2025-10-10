require("dotenv").config();
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_NAME, // project_management
  process.env.DB_USER, // root
  process.env.DB_PASS, // root
  {
    host: process.env.DB_HOST, // localhost
    dialect: "mysql",
  }
);

(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ MySQL connected via Docker!");
  } catch (err) {
    console.error("❌ Connection error:", err);
  }
})();

module.exports = sequelize;
