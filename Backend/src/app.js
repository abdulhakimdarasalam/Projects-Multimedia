const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();
const authRouter = require("./routes/auth");
const usersRouter = require("./routes/users");
const projectsRouter = require("./routes/projects");
const projectRegistrationsRouter = require("./routes/projectRegistrations");
const tasksRouter = require("./routes/tasks");
const taskSubmissionRouter = require("./routes/taskSubmissions");

app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin: 'http://localhost:3000'
}));

app.use("/auth", authRouter);
app.use("/users", usersRouter);
app.use("/projects", projectsRouter);
app.use("/project-registrations", projectRegistrationsRouter);
app.use("/tasks", tasksRouter);
app.use("/task-submissions", taskSubmissionRouter);

module.exports = app;
