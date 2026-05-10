import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  LuArrowLeft,
  LuSparkles,
  LuPlus,
  LuTrash2,
  LuBriefcase,
  LuClock,
} from "react-icons/lu";
import toast from "react-hot-toast";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { useUser } from "../../context/UserContext";
import QuestionCard from "../../components/Cards/QuestionCard";
import AIResponseDrawer from "../../components/Cards/AIResponseDrawer";

const PAGE_SIZE = 5;

interface Question {
  _id: string;
  question: string;
  answer: string;
  note?: string;
  isPinned: boolean;
}

interface Session {
  _id: string;
  role: string;
  experience: string;
  topicsToFocus: string;
  description?: string;
  questions: Question[];
  createdAt: string;
}

const InterviewPrep = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const { user } = useUser();

  const [session, setSession] = useState<Session | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // AI Explanation state
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [explanation, setExplanation] = useState("");
  const [explanationLoading, setExplanationLoading] = useState(false);

  useEffect(() => {
    if (!user) navigate("/");
  }, [user]);

  // Fetch session details
  const fetchSession = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(API_PATHS.SESSION.GET_BY_ID(sessionId!));
      setSession(res.data);
      setQuestions(res.data.questions ?? []);
    } catch {
      toast.error("Failed to load session.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (sessionId) fetchSession();
  }, [sessionId]);

  // Sort: pinned first, then by creation order
  const sortedQuestions = useMemo(() => {
    const pinned = questions.filter((q) => q.isPinned);
    const rest = questions.filter((q) => !q.isPinned);
    return [...pinned, ...rest];
  }, [questions]);

  const visibleQuestions = sortedQuestions.slice(0, visibleCount);
  const hasMore = visibleCount < sortedQuestions.length;

  // Pin / Unpin
  const handlePin = async (id: string) => {
    try {
      const res = await axiosInstance.put(API_PATHS.QUESTION.PIN(id));
      setQuestions((prev) =>
        prev.map((q) => (q._id === id ? { ...q, isPinned: res.data.isPinned } : q))
      );
    } catch {
      toast.error("Failed to update pin.");
    }
  };

  // Delete question
  const handleDeleteQuestion = async (id: string) => {
    try {
      await axiosInstance.delete(API_PATHS.QUESTION.DELETE(id));
      setQuestions((prev) => prev.filter((q) => q._id !== id));
      toast.success("Question removed.");
    } catch {
      toast.error("Failed to delete question.");
    }
  };

  // Delete entire session
  const handleDeleteSession = async () => {
    if (!window.confirm("Delete this session and all its questions?")) return;
    try {
      await axiosInstance.delete(API_PATHS.SESSION.DELETE(sessionId!));
      toast.success("Session deleted.");
      navigate("/dashboard");
    } catch {
      toast.error("Failed to delete session.");
    }
  };

  // Generate more questions via AI
  const handleLoadMore = async () => {
    if (!session) return;
    try {
      toast.loading("Generating more questions...", { id: "loadmore" });
      const res = await axiosInstance.post(API_PATHS.AI.GENERATE_QUESTIONS, {
        role: session.role,
        experience: session.experience,
        topicsToFocus: session.topicsToFocus,
        numberOfQuestions: 5,
      });
      const addRes = await axiosInstance.post(API_PATHS.QUESTION.ADD(session._id), {
        questions: res.data,
      });
      setQuestions((prev) => [...prev, ...addRes.data]);
      setVisibleCount((prev) => prev + 5);
      toast.success("5 new questions added!", { id: "loadmore" });
    } catch {
      toast.error("Failed to generate more questions.", { id: "loadmore" });
    }
  };

  // AI Concept Explanation
  const handleExplain = async (question: Question) => {
    setSelectedQuestion(question);
    setExplanation("");
    setDrawerOpen(true);
    setExplanationLoading(true);
    try {
      const res = await axiosInstance.post(API_PATHS.AI.GENERATE_EXPLANATION, {
        question: question.question,
        currentAnswer: question.answer,
      });
      setExplanation(res.data.explanation);
    } catch {
      setExplanation("Failed to generate explanation. Please try again.");
    } finally {
      setExplanationLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFFCEF] flex items-center justify-center">
        <div className="h-8 w-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-[#FFFCEF] flex items-center justify-center">
        <p className="text-slate-500">Session not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFCEF]">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-[#FFFCEF]/90 backdrop-blur border-b border-amber-100">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 text-sm text-slate-600 hover:text-black transition-colors"
          >
            <LuArrowLeft size={16} />
            Dashboard
          </button>

          <div className="flex items-center gap-2">
            <LuSparkles className="text-amber-500" size={18} />
            <span className="text-sm font-bold text-gray-900">Interview Prep AI</span>
          </div>

          <button
            onClick={handleDeleteSession}
            className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-600 transition-colors border border-red-200 hover:border-red-400 px-3 py-1.5 rounded-full"
          >
            <LuTrash2 size={13} />
            Delete Session
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Session info */}
        <div className="bg-white rounded-2xl border border-amber-100 shadow-sm p-6 mb-7">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">{session.role}</h1>
          {session.description && (
            <p className="text-sm text-slate-500 mb-3">{session.description}</p>
          )}
          <div className="flex flex-wrap gap-3 text-xs text-slate-500 mb-4">
            <span className="flex items-center gap-1">
              <LuClock size={12} />
              {session.experience} yrs experience
            </span>
            <span className="flex items-center gap-1">
              <LuBriefcase size={12} />
              {questions.length} questions
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {session.topicsToFocus.split(",").map((t, i) => (
              <span
                key={i}
                className="text-[11px] bg-amber-50 text-amber-700 border border-amber-200 rounded-full px-2.5 py-0.5 font-medium"
              >
                {t.trim()}
              </span>
            ))}
          </div>
        </div>

        {/* Questions list */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-gray-900">
            Q&amp;A ({questions.length})
          </h2>
        </div>

        {questions.length === 0 ? (
          <div className="text-center text-slate-400 py-16 text-sm">
            No questions yet.
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {visibleQuestions.map((q) => (
              <QuestionCard
                key={q._id}
                question={q}
                onPin={handlePin}
                onDelete={handleDeleteQuestion}
                onExplain={handleExplain}
              />
            ))}
          </div>
        )}

        {/* Load More */}
        <div className="mt-6 flex flex-col items-center gap-3">
          {hasMore && (
            <button
              onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
              className="text-sm text-amber-700 border border-amber-300 hover:bg-amber-50 px-5 py-2 rounded-full transition-colors"
            >
              Show More
            </button>
          )}
          <button
            onClick={handleLoadMore}
            className="flex items-center gap-2 bg-black text-white text-sm font-medium px-5 py-2.5 rounded-full hover:bg-amber-500 transition-colors"
          >
            <LuPlus size={15} />
            Generate 5 More Questions
          </button>
        </div>
      </main>

      {/* AI Explanation Drawer */}
      {drawerOpen && selectedQuestion && (
        <AIResponseDrawer
          question={selectedQuestion.question}
          explanation={explanation}
          loading={explanationLoading}
          onClose={() => setDrawerOpen(false)}
        />
      )}
    </div>
  );
};

export default InterviewPrep;