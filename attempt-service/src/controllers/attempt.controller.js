const { submitAttempt } = require("../services/attempt.service");

async function submit(req, res) {
  try {
    const userId = req.user.id; // dari JWT
    const { quizId } = req.params;
    const { answers } = req.body;

    const result = await submitAttempt(userId, quizId, answers);

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { submit };