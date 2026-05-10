const express = require("express");
const router = express.Router();
const {
  addQuestionsToSession,
  togglePinQuestion,
  updateQuestionNote,
  deleteQuestion,
} = require("../controllers/questionController");
const protect = require("../middleware/authMiddleware");

router.post("/:sessionId", protect, addQuestionsToSession);
router.put("/:id/pin", protect, togglePinQuestion);
router.put("/:id/note", protect, updateQuestionNote);
router.delete("/:id", protect, deleteQuestion);

module.exports = router;
