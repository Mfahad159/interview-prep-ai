const { GoogleGenerativeAI } = require("@google/generative-ai");
const OpenAI = require("openai");
const {
  generateQuestionsPrompt,
  generateConceptExplanationPrompt,
} = require("../utils/prompts");

// Initialize Google AI (Native)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Initialize OpenRouter (OpenAI-Compatible)
const openRouter = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": "http://localhost:5173", // Optional, for OpenRouter rankings
    "X-Title": "Interview Prep AI",
  },
});

/**
 * Helper: call Gemini and return the text response.
 */
const callGemini = async (prompt) => {
  // 1. Try OpenRouter first (Most stable)
  if (process.env.OPENROUTER_API_KEY) {
    console.log(`🔑 API Key Found: ${process.env.OPENROUTER_API_KEY.substring(0, 8)}...`);
    const orModels = [
      "google/gemini-flash-1.5:free",
      "meta-llama/llama-3.1-8b-instruct:free",
      "mistralai/mistral-7b-instruct:free",
      "openai/gpt-3.5-turbo"
    ];

    for (const model of orModels) {
      try {
        console.log(`🚀 Attempting AI call with OpenRouter (${model})...`);
        const completion = await openRouter.chat.completions.create({
          model: model,
          messages: [{ role: "user", content: prompt }],
          temperature: 0.7,
        });
        
        if (completion.choices && completion.choices[0]) {
           console.log(`✅ OpenRouter Success with ${model}!`);
           return completion.choices[0].message.content;
        }
      } catch (err) {
        console.error(`❌ OpenRouter ${model} failed:`, err.message);
      }
    }
    console.log("⚠️ All OpenRouter models failed. Falling back to Google SDK...");
  } else {
    console.log("ℹ️ No OPENROUTER_API_KEY found in .env, using Google SDK directly.");
  }

  // 2. Fallback to Google SDK
  const modelNames = [
    "gemini-1.5-flash", 
    "gemini-1.5-flash-latest",
    "gemini-1.5-pro", 
    "gemini-pro"
  ];
  let lastError;

  for (const name of modelNames) {
    try {
      console.log(`Attempting AI call with model: ${name}...`);
      const model = genAI.getGenerativeModel({ model: name });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (err) {
      lastError = err;
      console.warn(`Model ${name} failed: ${err.message}`);
      if (err.message.includes("API key not valid")) throw err;
    }
  }

  // If all failed, list available models to the console for debugging
  try {
    const listModels = await genAI.listModels();
    console.log("--- YOUR ALLOWED MODELS ---");
    console.table(listModels.models.map(m => ({ name: m.name, displayName: m.displayName })));
  } catch (listErr) {
    console.error("Could not even list models:", listErr.message);
  }

  throw lastError;
};

// Internal helper for question generation
const generateInterviewQuestionsInternal = async ({ role, experience, topicsToFocus, numberOfQuestions }) => {
  const prompt = generateQuestionsPrompt(role, experience, topicsToFocus, numberOfQuestions);
  const aiResponse = await callGemini(prompt);
  
  // Clean and parse
  const cleanJson = aiResponse.replace(/```json/g, "").replace(/```/g, "").trim();
  return JSON.parse(cleanJson);
};

// @desc    Generate interview Q&As using Gemini AI
// @route   POST /api/ai/generate-questions
// @access  Private
const generateInterviewQuestions = async (req, res) => {
  const { role, experience, topicsToFocus, numberOfQuestions } = req.body;

  try {
    const questions = await generateInterviewQuestionsInternal({
      role,
      experience,
      topicsToFocus,
      numberOfQuestions
    });

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
  generateInterviewQuestionsInternal,
};
