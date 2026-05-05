const express = require("express");
const router = express.Router();

const {
  create,
  add,
  get,
  getAll,
  deleteQuestion,
  deleteQuiz,
  updateQuiz,
  updateQuestion
} = require("../controllers/quiz.controller");

const authenticate = require("../middleware/auth.middleware");

router.get("/", authenticate, getAll);
router.post("/", authenticate, create);
router.post("/:quizId/questions", add);
router.get("/:quizId", get);
router.delete("/questions/:id", authenticate, deleteQuestion);
router.delete("/:id", authenticate, deleteQuiz);
router.put("/:id", authenticate, updateQuiz);
router.put("/questions/:id", authenticate, updateQuestion);

module.exports = router;