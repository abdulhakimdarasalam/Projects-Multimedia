const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

// Impor SEMUA middleware auth
const {
  verifyToken, // <-- IMPORT INI
  autoRefreshToken,
} = require("./middlewares/authMiddleware.js");

const app = express();

// --- Import Rute ---
const authRouter = require("./routes/auth");
const usersRouter = require("./routes/users");
const projectsRouter = require("./routes/projects");
const projectRegistrationsRouter = require("./routes/projectRegistrations");
const tasksRouter = require("./routes/tasks");
const taskSubmissionRouter = require("./routes/taskSubmissions");
const profileRoutes = require("./routes/profileRoutes"); // (misal: /api)
const adminRoutes = require("./routes/adminRoutes");
const dashboardUserRoutes = require("./routes/dashboardUserRoutes");

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use("/auth", authRouter);

app.use(verifyToken);

app.use("/users", usersRouter);
app.use("/projects", projectsRouter);
app.use("/project-registrations", projectRegistrationsRouter);
app.use("/tasks", tasksRouter);
app.use("/task-submissions", taskSubmissionRouter);
app.use("/api", profileRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/dashboard-user", dashboardUserRoutes);

// --- 3. ERROR HANDLER REFRESH TOKEN ---
app.use(autoRefreshToken);

module.exports = app;
