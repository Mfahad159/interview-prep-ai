import React from "react";
import { LuX, LuSparkles } from "react-icons/lu";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface AIResponseDrawerProps {
  question: string;
  explanation: string;
  loading: boolean;
  onClose: () => void;
}

const AIResponseDrawer = ({
  question,
  explanation,
  loading,
  onClose,
}: AIResponseDrawerProps) => {
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer panel */}
      <div className="relative w-full max-w-lg bg-white h-full shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-gradient-to-r from-amber-50 to-white">
          <div className="flex items-center gap-2">
            <LuSparkles className="text-amber-500" size={18} />
            <span className="text-sm font-semibold text-gray-900">AI Concept Explanation</span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 transition-colors"
          >
            <LuX size={18} />
          </button>
        </div>

        {/* Question context */}
        <div className="px-5 py-3 bg-amber-50 border-b border-amber-100">
          <p className="text-xs font-medium text-amber-700 mb-1">Question</p>
          <p className="text-sm text-gray-800 leading-snug">{question}</p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-5 py-5">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-slate-400">
              <div className="h-8 w-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm">Generating explanation...</p>
            </div>
          ) : (
            <div className="prose prose-sm prose-slate max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{explanation}</ReactMarkdown>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIResponseDrawer;
