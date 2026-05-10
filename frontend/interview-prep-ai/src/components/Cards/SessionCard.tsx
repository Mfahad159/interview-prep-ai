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

  const getInitials = (role: string) => {
    return role
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div
      className="bg-white border border-gray-300/40 rounded-xl p-2 overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => navigate(`/interview-prep/${session._id}`)}
    >
      {/* Colored Header Area */}
      <div 
        className="rounded-lg p-4 relative"
        style={{ background: "#E7F7F4" }}
      >
        <div className="flex items-start gap-4">
          {/* Initials Box */}
          <div className="flex-shrink-0 w-12 h-12 bg-white rounded-md flex items-center justify-center">
            <span className="text-lg font-semibold text-black">
              {getInitials(session.role)}
            </span>
          </div>

          {/* Content Container */}
          <div className="flex-grow">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-[17px] font-medium text-black">{session.role}</h2>
                <p className="text-xs font-medium text-gray-900">
                  {session.topicsToFocus}
                </p>
              </div>

              {/* Delete Button */}
              <button
                type="button"
                className="bg-[#FFE6E9] text-[#FF5B6D] text-[10px] font-bold px-3 py-1 rounded-full hover:bg-[#FFD1D6] transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(session._id);
                }}
              >
                delete
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Details Section */}
      <div className="px-3 pb-3">
        <div className="flex items-center gap-3 mt-4">
          <div className="text-[10px] font-medium text-black px-3 py-1 border-[1px] border-slate-300 rounded-full">
            Experience: {session.experience} {Number(session.experience) === 1 ? "Year" : "Years"}
          </div>
          <div className="text-[10px] font-medium text-black px-3 py-1 border-[1px] border-slate-300 rounded-full">
            {session.questions?.length ?? 0} Q&A
          </div>
          <div className="text-[10px] font-medium text-black px-3 py-1 border-[1px] border-slate-300 rounded-full">
            Last Updated: {new Date(session.createdAt).toLocaleDateString("en-GB", {
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            })}
          </div>
        </div>

        {/* Description */}
        <div className="mt-3">
          <p className="text-[11px] text-slate-500 leading-relaxed">
            {session.description || `Preparing for ${session.role.toLowerCase()} roles`}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SessionCard;
