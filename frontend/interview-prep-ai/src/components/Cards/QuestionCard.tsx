import React, { useState } from "react";
import {
  LuChevronDown,
  LuChevronUp,
  LuPin,
  LuPinOff,
  LuSparkles,
  LuTrash2,
} from "react-icons/lu";

interface Question {
  _id: string;
  question: string;
  answer: string;
  note?: string;
  isPinned: boolean;
}

interface QuestionCardProps {
  question: Question;
  onPin: (id: string) => void;
  onDelete: (id: string) => void;
  onExplain: (question: Question) => void;
}

const QuestionCard = ({ question, onPin, onDelete, onExplain }: QuestionCardProps) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={`bg-white rounded-2xl border shadow-sm transition-shadow hover:shadow-md p-5 ${
        question.isPinned ? "border-amber-300 shadow-amber-100" : "border-slate-100"
      }`}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-3">
        <button
          className="flex-1 text-left text-sm font-semibold text-gray-800 leading-snug"
          onClick={() => setExpanded((prev) => !prev)}
        >
          {question.question}
        </button>

        <div className="flex items-center gap-2 shrink-0 mt-0.5">
          {/* Pin */}
          <button
            title={question.isPinned ? "Unpin" : "Pin to top"}
            onClick={() => onPin(question._id)}
            className={`transition-colors ${
              question.isPinned ? "text-amber-500" : "text-slate-300 hover:text-amber-400"
            }`}
          >
            {question.isPinned ? <LuPin size={15} /> : <LuPinOff size={15} />}
          </button>

          {/* AI Explain */}
          <button
            title="Get concept explanation"
            onClick={() => onExplain(question)}
            className="text-slate-300 hover:text-violet-500 transition-colors"
          >
            <LuSparkles size={15} />
          </button>

          {/* Delete */}
          <button
            title="Delete question"
            onClick={() => onDelete(question._id)}
            className="text-slate-300 hover:text-red-400 transition-colors"
          >
            <LuTrash2 size={15} />
          </button>

          {/* Expand toggle */}
          <button
            onClick={() => setExpanded((prev) => !prev)}
            className="text-slate-400 hover:text-slate-700 transition-colors"
          >
            {expanded ? <LuChevronUp size={16} /> : <LuChevronDown size={16} />}
          </button>
        </div>
      </div>

      {/* Expanded answer */}
      {expanded && (
        <div className="mt-4 pt-4 border-t border-slate-100">
          <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
            {question.answer}
          </p>
          {question.note && (
            <div className="mt-3 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
              <p className="text-xs font-semibold text-amber-700 mb-0.5">📝 Your Note</p>
              <p className="text-xs text-amber-800">{question.note}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QuestionCard;
