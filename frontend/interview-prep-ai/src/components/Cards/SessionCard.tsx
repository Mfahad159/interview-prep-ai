import React from "react";
import { useNavigate } from "react-router-dom";
import { LuTrash2, LuBriefcase, LuClock, LuBookOpen } from "react-icons/lu";

interface Session {
  _id: string;
  role: string;
  experience: string;
  topicsToFocus: string;
  description?: string;
  questions: string[];
  createdAt: string;
}

interface SessionCardProps {
  session: Session;
  onDelete: (id: string) => void;
}

const SessionCard = ({ session, onDelete }: SessionCardProps) => {
  const navigate = useNavigate();

  return (
    <div
      className="bg-white border border-amber-100 rounded-2xl shadow-sm hover:shadow-md hover:shadow-amber-100 transition-shadow cursor-pointer p-5 flex flex-col gap-3 relative group"
      onClick={() => navigate(`/interview-prep/${session._id}`)}
    >
      {/* Delete button */}
      <button
        type="button"
        className="absolute top-4 right-4 text-slate-300 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
        onClick={(e) => {
          e.stopPropagation();
          onDelete(session._id);
        }}
      >
        <LuTrash2 size={16} />
      </button>

      {/* Role */}
      <div className="flex items-center gap-2">
        <div className="h-9 w-9 flex items-center justify-center rounded-xl bg-amber-50">
          <LuBriefcase className="text-amber-500" size={18} />
        </div>
        <div>
          <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wide">Role</p>
          <h3 className="text-sm font-semibold text-gray-900 leading-tight">{session.role}</h3>
        </div>
      </div>

      {/* Meta */}
      <div className="flex items-center gap-4 text-xs text-slate-500">
        <span className="flex items-center gap-1">
          <LuClock size={12} />
          {session.experience} yrs exp
        </span>
        <span className="flex items-center gap-1">
          <LuBookOpen size={12} />
          {session.questions?.length ?? 0} Q&amp;As
        </span>
      </div>

      {/* Topics */}
      <div className="flex flex-wrap gap-1.5 mt-1">
        {session.topicsToFocus
          .split(",")
          .slice(0, 4)
          .map((topic, i) => (
            <span
              key={i}
              className="text-[11px] bg-amber-50 text-amber-700 border border-amber-200 rounded-full px-2.5 py-0.5 font-medium"
            >
              {topic.trim()}
            </span>
          ))}
      </div>

      {/* Date */}
      <p className="text-[11px] text-slate-400 mt-auto pt-2 border-t border-slate-50">
        {new Date(session.createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })}
      </p>
    </div>
  );
};

export default SessionCard;
