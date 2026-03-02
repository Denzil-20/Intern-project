const express = require("express");
const cors = require("cors");
require("dotenv").config();

const taskRoutes = require("./routes/taskRoutes");

const authRoutes = require("./routes/authRoutes");
const authMiddleware = require("./middleware/authMiddleware");

const app = express();   // ← app defined FIRST

app.use(cors());
app.use(express.json());

app.use("/api/v1/auth", authRoutes);

app.use("/api/v1/tasks", taskRoutes);
// Protected test route
app.get("/api/v1/protected", authMiddleware, (req, res) => {
  res.json({
    message: "You accessed protected route",
    user: req.user
  });
});

const roleMiddleware = require("./middleware/roleMiddleware");

app.get(
  "/api/v1/admin",
  authMiddleware,
  roleMiddleware("ADMIN"),
  (req, res) => {
    res.json({ message: "Welcome Admin" });
  }
);

app.get("/", (req, res) => {
  res.send("API running");
});

const errorMiddleware = require("./middleware/errorMiddleware");

app.use(errorMiddleware);

const { swaggerUi, swaggerSpec } = require("./config/swagger");

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

module.exports = app;