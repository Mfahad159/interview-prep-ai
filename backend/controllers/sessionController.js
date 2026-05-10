const Session = require("../models/Session");
const Question = require("../models/Question");
const { generateInterviewQuestionsInternal } = require("./aiController");

// @desc    Create a new session
// @route   POST /api/sessions
// @access  Private
const createSession = async (req, res) => {
  const { role, experience, topicsToFocus, description } = req.body;

  try {
    // 1. Create the session shell
    const session = await Session.create({
      user: req.user._id,
      role,
      experience,
      topicsToFocus,
      description,
    });

    // 2. Automatically generate 10 questions via Gemini
    const aiQuestions = await generateInterviewQuestionsInternal({
      role,
      experience,
      topicsToFocus,
      numberOfQuestions: 10,
    });

    // 3. Save questions to DB and link to session
    const savedQuestions = await Promise.all(
      aiQuestions.map((q) =>
        Question.create({
          session: session._id,
          question: q.question,
          answer: q.answer,
        })
      )
    );

    // 4. Update session with question references
    session.questions = savedQuestions.map((q) => q._id);
    await session.save();

    res.status(201).json(session);
  } catch (err) {
    console.error("Session Creation Error:", err);
    res.status(500).json({ message: "Failed to create session and generate questions", error: err.message });
  }
};

// @desc    Get all sessions for the logged-in user
// @route   GET /api/sessions
// @access  Private
const getMySessions = async (req, res) => {
  try {
    const sessions = await Session.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// @desc    Get a single session by ID with its questions
// @route   GET /api/sessions/:id
// @access  Private
const getSessionById = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id).populate("questions");

    if (!session) return res.status(404).json({ message: "Session not found" });

    if (session.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    res.json(session);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// @desc    Delete a session and its questions
// @route   DELETE /api/sessions/:id
// @access  Private
const deleteSession = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);

    if (!session) return res.status(404).json({ message: "Session not found" });

    if (session.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await Question.deleteMany({ session: session._id });
    await session.deleteOne();

    res.json({ message: "Session deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = { createSession, getMySessions, getSessionById, deleteSession };
