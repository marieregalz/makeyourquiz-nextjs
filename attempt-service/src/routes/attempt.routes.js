const express = require("express");
const router = express.Router();

const { submit } = require("../controllers/attempt.controller");
const authenticate = require("../middleware/auth.middleware");

router.post("/:quizId/submit", authenticate, submit);

module.exports = router;