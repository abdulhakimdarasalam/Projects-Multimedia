const Project = require("./Project");
const User = require("./User");
const ProjectRegistration = require("./ProjectRegistration");

User.hasMany(ProjectRegistration, { foreignKey: "user_id" });
ProjectRegistration.belongsTo(User, { foreignKey: "user_id" });

Project.hasMany(ProjectRegistration, { foreignKey: "project_id" });
ProjectRegistration.belongsTo(Project, { foreignKey: "project_id" });

module.exports = {
  User,
  Project,
  ProjectRegistration,
};
