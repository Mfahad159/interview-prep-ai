const express = require("express");
const router = express.Router();
const {
  generateInterviewQuestions,
  generateConceptExplanation,
} = require("../controllers/aiController");
const protect = require("../middleware/authMiddleware");

router.post("/generate-questions", protect, generateInterviewQuestions);
router.post("/generate-explanation", protect, generateConceptExplanation);

module.exports = router;
