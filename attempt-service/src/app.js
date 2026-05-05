require("dotenv").config();

const express = require("express");
const cors = require("cors");
const pool = require("./config/db");

const app = express();

app.use(cors());
app.use(express.json());

// DB connection
pool.connect()
  .then(() => console.log("DB connected"))
  .catch(err => console.error("DB connection error:", err));

const attemptRoutes = require("./routes/attempt.routes");
app.use("/attempts", attemptRoutes);

// test route
app.get("/", (req, res) => {
  res.send("Attempt Service Running");
});

const PORT = process.env.PORT || 3003;

app.listen(PORT, () => {
  console.log(`Attempt service running on port ${PORT}`);
});