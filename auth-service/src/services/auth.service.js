const pool = require("../config/db.js");
const bcrypt = require("bcrypt");

async function registerUser(name, email, password) {
  const hashedPassword = await bcrypt.hash(password, 10);

  const result = await pool.query(
    "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *",
    [name, email, hashedPassword]
  );

  return result.rows[0];
}

async function loginUser(email, password) {
  const result = await pool.query(
    "SELECT * FROM users WHERE email = $1",
    [email]
  );

  const user = result.rows[0];

  if (!user) throw new Error("User not found");

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) throw new Error("Invalid password");

  return user;
}

module.exports = { registerUser, loginUser };