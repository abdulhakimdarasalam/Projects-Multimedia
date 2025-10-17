const Project = require("./Project");
const User = require("./User");
const ProjectRegistration = require("./ProjectRegistration");
const Task = require("./Task");
const TaskSubmission = require("./TaskSubmission");

User.hasMany(ProjectRegistration, { foreignKey: "user_id" });
ProjectRegistration.belongsTo(User, { foreignKey: "user_id" });

Project.hasMany(ProjectRegistration, { foreignKey: "project_id" });
ProjectRegistration.belongsTo(Project, { foreignKey: "project_id" });

Project.hasMany(Task, { foreignKey: "project_id" });
Task.belongsTo(Project, { foreignKey: "project_id" });

Task.hasOne(TaskSubmission, { foreignKey: "task_id" });
TaskSubmission.belongsTo(Task, { foreignKey: "task_id" });

User.hasMany(TaskSubmission, { foreignKey: "user_id" });
TaskSubmission.belongsTo(User, { foreignKey: "user_id" });

module.exports = {
  User,
  Project,
  ProjectRegistration,
  Task,
  TaskSubmission,
};
