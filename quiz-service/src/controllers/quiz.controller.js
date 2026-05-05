const {
  createQuiz,
  addQuestion,
  getQuizById
} = require("../services/quiz.service");

const pool = require("../config/db");

// CREATE QUIZ
async function create(req, res) {
  try {
    const { title, description } = req.body;
    const userId = req.user.id;

    const quiz = await createQuiz(title, description, userId);
    res.json(quiz);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// ADD QUESTION
async function add(req, res) {
  try {
    const { quizId } = req.params;

    const question = await addQuestion(quizId, req.body);
    res.json(question);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// GET ONE QUIZ
async function get(req, res) {
  try {
    const { quizId } = req.params;

    const quiz = await getQuizById(quizId);
    res.json(quiz);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// GET ALL QUIZZES
async function getAll(req, res) {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      "SELECT * FROM quizzes WHERE created_by=$1 ORDER BY id DESC",
      [userId]
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// DELETE QUESTION
async function deleteQuestion(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const result = await pool.query(
      `DELETE FROM questions 
       WHERE id=$1 AND quiz_id IN (
         SELECT id FROM quizzes WHERE created_by=$2
       )
       RETURNING *`,
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(403).json({ error: "Not allowed" });
    }

    res.json({ message: "Question deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// DELETE QUIZ
async function deleteQuiz(req, res) {
  try {
    const { id } = req.params;

    // cek ownership (biar lebih aman)
    const userId = req.user.id;
    const check = await pool.query(
      "SELECT * FROM quizzes WHERE id=$1 AND created_by=$2", [id, userId]
    );
    if (check.rows.length === 0) {
      return res.status(403).json({ error: "Not allowed" });
    }

    await pool.query("DELETE FROM quizzes WHERE id = $1", [id]);

    res.json({ message: "Quiz deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// UPDATE QUIZ
async function updateQuiz(req, res) {
  try {
    const { id } = req.params;
    const { title, description } = req.body;
    const userId = req.user.id;

    const result = await pool.query(
      "UPDATE quizzes SET title=$1, description=$2 WHERE id=$3 AND created_by=$4 RETURNING *",
      [title, description, id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(403).json({ error: "Not authorized" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// UPDATE QUESTION
async function updateQuestion(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const {
      question_text,
      option_a,
      option_b,
      option_c,
      option_d,
      correct_answer
    } = req.body;

    const result = await pool.query(
      `UPDATE questions 
       SET question_text=$1, option_a=$2, option_b=$3, option_c=$4, option_d=$5, correct_answer=$6 
       WHERE id=$7 AND quiz_id IN (
         SELECT id FROM quizzes WHERE created_by=$8
       )
       RETURNING *`,
      [question_text, option_a, option_b, option_c, option_d, correct_answer, id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(403).json({ error: "Not authorized" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  create,
  add,
  get,
  getAll,
  deleteQuestion,
  deleteQuiz,
  updateQuiz,
  updateQuestion
};