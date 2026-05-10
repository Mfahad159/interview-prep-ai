import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LuPlus, LuLogOut, LuBriefcase, LuBookOpen, LuSparkles } from "react-icons/lu";
import { useUser } from "../../context/UserContext";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import Modal from "../../components/Loaders/Model";
import SessionForm from "../../components/Cards/SessionForm";
import SessionCard from "../../components/Cards/SessionCard";
import toast from "react-hot-toast";

interface Session {
  _id: string;
  role: string;
  experience: string;
  topicsToFocus: string;
  description?: string;
  questions: string[];
  createdAt: string;
}

const Dashboard = () => {
  const { user, clearUser } = useUser();
  const navigate = useNavigate();

  const [sessions, setSessions] = useState<Session[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);

  // Redirect if not logged in
  useEffect(() => {
    if (!user) navigate("/");
  }, [user]);

  // Fetch all sessions
  const fetchSessions = async () => {
    setLoadingSessions(true);
    try {
      const res = await axiosInstance.get(API_PATHS.SESSION.GET_ALL);
      setSessions(res.data);
    } catch {
      toast.error("Failed to load sessions.");
    } finally {
      setLoadingSessions(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  // Create session + generate AI questions
  const handleCreateSession = async (formData: {
    role: string;
    experience: string;
    topicsToFocus: string;
    description: string;
  }) => {
    setCreating(true);
    try {
      // 1. Create the session
      const sessionRes = await axiosInstance.post(API_PATHS.SESSION.CREATE, formData);
      const newSession = sessionRes.data;

      // 2. Generate AI questions for it
      const questionsRes = await axiosInstance.post(API_PATHS.AI.GENERATE_QUESTIONS, {
        role: formData.role,
        experience: formData.experience,
        topicsToFocus: formData.topicsToFocus,
        numberOfQuestions: 10,
      });

      // 3. Save questions to the session
      await axiosInstance.post(API_PATHS.QUESTION.ADD(newSession._id), {
        questions: questionsRes.data,
      });

      toast.success("Session created with AI questions!");
      setShowCreateModal(false);
      navigate(`/interview-prep/${newSession._id}`);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to create session.");
    } finally {
      setCreating(false);
    }
  };

  // Delete session
  const handleDeleteSession = async (id: string) => {
    try {
      await axiosInstance.delete(API_PATHS.SESSION.DELETE(id));
      setSessions((prev) => prev.filter((s) => s._id !== id));
      toast.success("Session deleted.");
    } catch {
      toast.error("Failed to delete session.");
    }
  };

  const handleLogout = () => {
    clearUser();
    navigate("/");
  };

  // Derived summary stats
  const totalQuestions = sessions.reduce((acc, s) => acc + (s.questions?.length ?? 0), 0);

  return (
    <div className="min-h-screen bg-[#FFFCEF]">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-[#FFFCEF]/90 backdrop-blur border-b border-amber-100">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LuSparkles className="text-amber-500" size={20} />
            <span className="text-base font-bold text-gray-900">Interview Prep AI</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Avatar */}
            {user?.profileImageUrl ? (
              <img
                src={user.profileImageUrl}
                alt="avatar"
                className="h-8 w-8 rounded-full object-cover border border-amber-200"
              />
            ) : (
              <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center text-xs font-bold text-amber-700">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
            )}
            <span className="text-sm font-medium text-gray-700 hidden sm:block">{user?.name}</span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 text-xs text-slate-500 hover:text-red-500 transition-colors"
            >
              <LuLogOut size={15} />
              <span className="hidden sm:block">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Summary Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
          {[
            {
              icon: <LuBriefcase className="text-amber-500" size={20} />,
              label: "Total Sessions",
              value: sessions.length,
            },
            {
              icon: <LuBookOpen className="text-amber-500" size={20} />,
              label: "Total Questions",
              value: totalQuestions,
            },
            {
              icon: <LuSparkles className="text-amber-500" size={20} />,
              label: "AI Generated",
              value: totalQuestions,
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-2xl border border-amber-100 shadow-sm p-5 flex items-center gap-4"
            >
              <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-amber-50">
                {stat.icon}
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Section header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-semibold text-gray-900">Your Sessions</h2>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 bg-black text-white text-sm font-medium px-4 py-2 rounded-full hover:bg-amber-500 transition-colors"
          >
            <LuPlus size={16} />
            New Session
          </button>
        </div>

        {/* Sessions grid */}
        {loadingSessions ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-44 rounded-2xl bg-amber-50 animate-pulse" />
            ))}
          </div>
        ) : sessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="h-16 w-16 rounded-2xl bg-amber-50 flex items-center justify-center mb-4">
              <LuBriefcase className="text-amber-400" size={32} />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No sessions yet</h3>
            <p className="text-sm text-slate-400 mb-5 max-w-xs">
              Create your first session to start preparing with AI-generated questions.
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 bg-black text-white text-sm font-medium px-5 py-2.5 rounded-full hover:bg-amber-500 transition-colors"
            >
              <LuPlus size={16} />
              Create Session
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {sessions.map((session) => (
              <SessionCard
                key={session._id}
                session={session}
                onDelete={handleDeleteSession}
              />
            ))}
          </div>
        )}
      </main>

      {/* Create Session Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="New Session"
      >
        <SessionForm onSubmit={handleCreateSession} loading={creating} />
      </Modal>
    </div>
  );
};

export default Dashboard;