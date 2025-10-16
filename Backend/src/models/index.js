const Project = require("./Project");
const User = require("./User");
const ProjectRegistration = require("./ProjectRegistration");
const Task = require("./Task");

User.hasMany(ProjectRegistration, { foreignKey: "user_id" });
ProjectRegistration.belongsTo(User, { foreignKey: "user_id" });

Project.hasMany(ProjectRegistration, { foreignKey: "project_id" });
ProjectRegistration.belongsTo(Project, { foreignKey: "project_id" });

Project.hasMany(Task, { foreignKey: "project_id" });
Task.belongsTo(Project, { foreignKey: "project_id" });

module.exports = {
  User,
  Project,
  ProjectRegistration,
  Task,
};
