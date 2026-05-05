require("dotenv").config();

const express = require("express");
const cors = require("cors");
const pool = require("./config/db");
const authRoutes = require("./routes/auth.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);

pool.connect()
  .then(() => console.log("DB connected"))
  .catch(err => console.error("DB connection error:", err));

app.get("/", (req, res) => {
  res.send("Auth Service Running");
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Auth service running on port ${PORT}`);
});