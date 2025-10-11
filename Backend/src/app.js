const express = require("express");

const app = express();
const usersRouter = require("./routes/users");
const projectsRouter = require("./routes/projects");

app.use(express.json());

app.use("/users", usersRouter);
app.use("/projects", projectsRouter);

module.exports = app;
