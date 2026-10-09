require("dotenv").config();

const express = require("express");
const path = require("path");
const connectDB = require("./config/db");
const studentRoutes = require("./routes/studentRoutes");
const interventionRoutes = require("./routes/interventionRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "EduWatch API is running" });
});

app.use("/api/students", studentRoutes);
app.use("/api/interventions", interventionRoutes);
app.use("/api/auth", authRoutes);

app.use("/api", (req, res) => {
  res.status(404).json({ success: false, message: "API endpoint not found" });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Unexpected server error"
  });
});

async function startServer() {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`EduWatch is running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Server could not start:", error.message);
    process.exit(1);
  }
}

startServer();