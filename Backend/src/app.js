const express = require("express");

const app = express();
const usersRouter = require("./routes/users");
const projectsRouter = require("./routes/projects");
const projectRegistrationsRouter = require("./routes/projectRegistrations");
const tasksRouter = require("./routes/tasks");

app.use(express.json());

app.use("/users", usersRouter);
app.use("/projects", projectsRouter);
app.use("/projectRegistrations", projectRegistrationsRouter);
app.use("/tasks", tasksRouter);

module.exports = app;
