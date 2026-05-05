const pool = require("../config/db");

// CREATE QUIZ
async function createQuiz(title, description, userId) {
  const result = await pool.query(
    "INSERT INTO quizzes (title, description, created_by) VALUES ($1, $2, $3) RETURNING *",
    [title, description, userId]
  );

  return result.rows[0];
}

// ADD QUESTION
async function addQuestion(quizId, question) {
  const {
    question_text,
    option_a,
    option_b,
    option_c,
    option_d,
    correct_answer
  } = question;

  const result = await pool.query(
    `INSERT INTO questions 
    (quiz_id, question_text, option_a, option_b, option_c, option_d, correct_answer)
    VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
    [quizId, question_text, option_a, option_b, option_c, option_d, correct_answer]
  );

  return result.rows[0];
}

// GET QUIZ + QUESTIONS
async function getQuizById(quizId) {
  const quiz = await pool.query(
    "SELECT * FROM quizzes WHERE id = $1",
    [quizId]
  );

  const questions = await pool.query(
    "SELECT * FROM questions WHERE quiz_id = $1",
    [quizId]
  );

  return {
    ...quiz.rows[0],
    questions: questions.rows
  };
}

module.exports = { createQuiz, addQuestion, getQuizById };