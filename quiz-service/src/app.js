require("dotenv").config();

const express = require("express");
const cors = require("cors");
const pool = require("./config/db");

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// DB connection
pool.connect()
  .then(() => console.log("DB connected"))
  .catch(err => console.error("DB connection error:", err));

// routes
const quizRoutes = require("./routes/quiz.routes");
app.use("/quizzes", quizRoutes);

// test route
app.get("/", (req, res) => {
  res.send("Quiz Service Running");
});

// start server (TERAKHIR)
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Quiz service running on port ${PORT}`);
});