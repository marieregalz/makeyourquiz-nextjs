const jwt = require("jsonwebtoken");
const { registerUser, loginUser } = require("../services/auth.service");
const { generateToken } = require("../utils/jwt");

async function register(req, res) {
  try {
    const { name, email, password } = req.body;

    const user = await registerUser(name, email, password);

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    const user = await loginUser(email, password); // dari service

    const token = generateToken(user); // JWT

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

module.exports = { register, login };