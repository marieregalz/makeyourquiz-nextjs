const pool = require("../config/db");

// SUBMIT ATTEMPT
async function submitAttempt(userId, quizId, answers) {
  // ambil semua question dari quiz
  const questionsRes = await pool.query(
    "SELECT * FROM questions WHERE quiz_id = $1",
    [quizId]
  );

  const questions = questionsRes.rows;

  let score = 0;

  // create attempt dulu
  const attemptRes = await pool.query(
    "INSERT INTO attempts (user_id, quiz_id, score, total_questions) VALUES ($1,$2,$3,$4) RETURNING *",
    [userId, quizId, 0, questions.length]
  );

  const attemptId = attemptRes.rows[0].id;

  // loop jawaban user
  for (let ans of answers) {
    const question = questions.find(q => q.id === ans.question_id);

    const isCorrect =
    question.correct_answer.toUpperCase() ===
    ans.selected_answer.toUpperCase();

    if (isCorrect) score++;

    await pool.query(
      `INSERT INTO answers (attempt_id, question_id, selected_answer, is_correct)
       VALUES ($1,$2,$3,$4)`,
      [attemptId, ans.question_id, ans.selected_answer, isCorrect]
    );
  }

  // update score
  await pool.query(
    "UPDATE attempts SET score = $1 WHERE id = $2",
    [score, attemptId]
  );

  return {
    attemptId,
    score,
    total: questions.length,
    quiz_id: quizId
  };
}

module.exports = { submitAttempt };