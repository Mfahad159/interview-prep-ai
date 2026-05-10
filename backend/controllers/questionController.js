const Question = require("../models/Question");
const Session = require("../models/Session");

// @desc    Add questions to a session
// @route   POST /api/questions/:sessionId
// @access  Private
const addQuestionsToSession = async (req, res) => {
  const { questions } = req.body; // array of { question, answer }

  try {
    const session = await Session.findById(req.params.sessionId);
    if (!session) return res.status(404).json({ message: "Session not found" });

    const createdQuestions = await Question.insertMany(
      questions.map((q) => ({
        session: session._id,
        question: q.question,
        answer: q.answer,
      }))
    );

    // Push question IDs into session
    session.questions.push(...createdQuestions.map((q) => q._id));
    await session.save();

    res.status(201).json(createdQuestions);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// @desc    Toggle pin on a question
// @route   PUT /api/questions/:id/pin
// @access  Private
const togglePinQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) return res.status(404).json({ message: "Question not found" });

    question.isPinned = !question.isPinned;
    await question.save();

    res.json(question);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// @desc    Update a question's note
// @route   PUT /api/questions/:id/note
// @access  Private
const updateQuestionNote = async (req, res) => {
  const { note } = req.body;

  try {
    const question = await Question.findById(req.params.id);
    if (!question) return res.status(404).json({ message: "Question not found" });

    question.note = note;
    await question.save();

    res.json(question);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// @desc    Delete a question
// @route   DELETE /api/questions/:id
// @access  Private
const deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) return res.status(404).json({ message: "Question not found" });

    // Remove from parent session
    await Session.findByIdAndUpdate(question.session, {
      $pull: { questions: question._id },
    });

    await question.deleteOne();
    res.json({ message: "Question deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = {
  addQuestionsToSession,
  togglePinQuestion,
  updateQuestionNote,
  deleteQuestion,
};
