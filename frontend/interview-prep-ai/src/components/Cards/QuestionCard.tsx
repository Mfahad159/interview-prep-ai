import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import {
  LuChevronDown,
  LuPin,
  LuSparkles,
  LuCopy,
  LuCheck
} from "react-icons/lu";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import toast from "react-hot-toast";

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
}

const QuestionCard = ({ question, onPin, onDelete }: QuestionCardProps) => {
  const [expanded, setExpanded] = useState(false);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const fetchExplanation = async () => {
    if (explanation) return;
    setLoading(true);
    try {
      const res = await axiosInstance.post(API_PATHS.AI.GENERATE_EXPLANATION, {
        question: question.question,
        currentAnswer: question.answer,
      });
      setExplanation(res.data.explanation);
    } catch (err) {
      toast.error("Failed to fetch explanation.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`bg-white rounded-xl border border-slate-100 shadow-sm transition-all overflow-hidden ${
        expanded ? "shadow-md ring-1 ring-slate-100" : "hover:shadow-md"
      }`}
    >
      {/* Header Row */}
      <div className="p-4 sm:p-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 overflow-hidden cursor-pointer" onClick={() => setExpanded(!expanded)}>
          <span className="text-slate-400 font-bold text-lg shrink-0">Q</span>
          <h3 className="text-[15px] font-medium text-slate-800 leading-snug hover:text-black truncate">
            {question.question}
          </h3>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => onPin(question._id)}
            className={`p-1.5 rounded-lg transition-colors ${
              question.isPinned 
                ? "bg-indigo-50 text-indigo-600" 
                : "bg-slate-50 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600"
            }`}
          >
            <LuPin size={15} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setExpanded(true);
              fetchExplanation();
            }}
            className="flex items-center gap-1.5 bg-[#E7F7F4] text-[#0D9488] px-3 py-1.5 rounded-lg text-[11px] font-bold hover:bg-[#D1F2EB] transition-colors"
          >
            <LuSparkles size={13} />
            Learn More
          </button>

          <button
            onClick={() => setExpanded(!expanded)}
            className={`text-slate-400 p-1 hover:bg-slate-50 rounded-lg transition-all ${
              expanded ? "rotate-180" : ""
            }`}
          >
            <LuChevronDown size={18} />
          </button>
        </div>
      </div>

      {/* Expanded Answer Area */}
      {expanded && (
        <div className="px-5 pb-5 pt-0">
          <div className="bg-slate-50/50 rounded-xl p-5 border border-slate-100/50">
            {/* Main Answer */}
            <div className="prose prose-sm max-w-none text-slate-700 leading-relaxed whitespace-pre-wrap mb-4">
              {question.answer}
            </div>

            {/* AI Explanation Area */}
            {(loading || explanation) && (
              <div className="mt-6 pt-6 border-t border-slate-200/60">
                <div className="flex items-center gap-2 mb-4 text-[#0D9488]">
                  <LuSparkles size={14} />
                  <span className="text-[11px] font-bold uppercase tracking-wider">Detailed AI Explanation</span>
                </div>

                {loading ? (
                  <div className="flex items-center gap-3 py-4">
                    <div className="h-4 w-4 border-2 border-[#0D9488] border-t-transparent rounded-full animate-spin" />
                    <span className="text-xs text-slate-400">Generating insights...</span>
                  </div>
                ) : (
                  <div className="markdown-content prose prose-slate prose-sm max-w-none">
                    <ReactMarkdown
                      components={{
                        code({ node, inline, className, children, ...props }: any) {
                          const match = /language-(\w+)/.exec(className || "");
                          const language = match ? match[1].toUpperCase() : "CODE";
                          const codeString = String(children).replace(/\n$/, "");
                          
                          return !inline && match ? (
                            <div className="my-4 rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm">
                              <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 flex items-center justify-between">
                                <div className="flex items-center gap-2 text-slate-500 font-bold text-[10px] tracking-widest uppercase">
                                  <span>{`<>`}</span>
                                  <span>{language}</span>
                                </div>
                                <button 
                                  onClick={() => copyToClipboard(codeString)}
                                  className="text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                  {copied ? <LuCheck size={14} className="text-green-500" /> : <LuCopy size={14} />}
                                </button>
                              </div>
                              <SyntaxHighlighter
                                style={vscDarkPlus as any}
                                language={match[1]}
                                PreTag="div"
                                customStyle={{ margin: 0, padding: '1rem', fontSize: '13px', background: '#ffffff' }}
                                codeTagProps={{ style: { color: '#334155' } }}
                                {...props}
                              >
                                {codeString}
                              </SyntaxHighlighter>
                            </div>
                          ) : (
                            <code className={className} {...props}>
                              {children}
                            </code>
                          );
                        },
                      }}
                    >
                      {explanation!}
                    </ReactMarkdown>
                  </div>
                )}
              </div>
            )}
            
            <div className="mt-4 pt-4 border-t border-slate-200/50 flex justify-end">
              <button
                onClick={() => onDelete(question._id)}
                className="text-[10px] uppercase tracking-wider font-bold text-red-400 hover:text-red-600 transition-colors"
              >
                Remove Question
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionCard;
