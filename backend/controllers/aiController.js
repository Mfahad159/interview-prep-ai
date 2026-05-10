const { GoogleGenerativeAI } = require("@google/generative-ai");
const {
  generateQuestionsPrompt,
  generateConceptExplanationPrompt,
} = require("../utils/prompts");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Helper: call Gemini and return the text response.
 */
const callGemini = async (prompt) => {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
};

// @desc    Generate interview Q&As using Gemini AI
// @route   POST /api/ai/generate-questions
// @access  Private
const generateInterviewQuestions = async (req, res) => {
  const { role, experience, topicsToFocus, numberOfQuestions } = req.body;

  try {
    const prompt = generateQuestionsPrompt(
      role,
      experience,
      topicsToFocus,
      numberOfQuestions
    );

    const aiResponse = await callGemini(prompt);

    // AI might return markdown blocks (```json ... ```). We need to strip them.
    const cleanJson = aiResponse.replace(/```json/g, "").replace(/```/g, "").trim();
    const questions = JSON.parse(cleanJson);

    res.status(200).json(questions);
  } catch (err) {
    console.error("AI Question Generation Error:", err);
    res.status(500).json({ message: "Failed to generate AI questions", error: err.message });
  }
};

// @desc    Generate concept explanation using Gemini AI
// @route   POST /api/ai/generate-explanation
// @access  Private
const generateConceptExplanation = async (req, res) => {
  const { question, currentAnswer } = req.body;

  try {
    const prompt = generateConceptExplanationPrompt(question, currentAnswer);
    const explanation = await callGemini(prompt);

    res.status(200).json({ explanation });
  } catch (err) {
    console.error("AI Explanation Error:", err);
    res.status(500).json({ message: "Failed to generate concept explanation", error: err.message });
  }
};

module.exports = {
  generateInterviewQuestions,
  generateConceptExplanation,
};
