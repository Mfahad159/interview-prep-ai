import React, { useState } from "react";
import Input from "../Inputs/input";

interface SessionFormProps {
  onSubmit: (data: {
    role: string;
    experience: string;
    topicsToFocus: string;
    description: string;
  }) => void;
  loading?: boolean;
}

const SessionForm = ({ onSubmit, loading = false }: SessionFormProps) => {
  const [role, setRole] = useState("");
  const [experience, setExperience] = useState("");
  const [topicsToFocus, setTopicsToFocus] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!role) return setError("Please enter the job role.");
    if (!experience) return setError("Please enter years of experience.");
    if (!topicsToFocus) return setError("Please enter topics to focus on.");
    setError("");
    onSubmit({ role, experience, topicsToFocus, description });
  };

  return (
    <div className="p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-1">
        Create Interview Session
      </h2>
      <p className="text-sm text-slate-500 mb-5">
        Fill in the details below to generate AI-powered interview questions.
      </p>

      <form onSubmit={handleSubmit} className="space-y-1">
        <Input
          value={role}
          onChange={({ target }) => setRole(target.value)}
          label="Target Role"
          placeholder="e.g. Frontend Developer"
          type="text"
        />
        <Input
          value={experience}
          onChange={({ target }) => setExperience(target.value)}
          label="Years of Experience"
          placeholder="e.g. 2"
          type="text"
        />
        <Input
          value={topicsToFocus}
          onChange={({ target }) => setTopicsToFocus(target.value)}
          label="Topics to Focus On"
          placeholder="e.g. React, TypeScript, System Design"
          type="text"
        />

        <div className="mb-4">
          <label className="text-[13px] text-slate-800">
            Description (Optional)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Any extra context about the role or company..."
            className="mt-2 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none resize-none h-24 focus:border-amber-400"
          />
        </div>

        {error && <p className="text-red-500 text-xs pb-2">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-black py-2.5 text-sm font-semibold text-white transition-colors hover:bg-amber-400 hover:text-black disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "Generating..." : "Create & Generate Questions"}
        </button>
      </form>
    </div>
  );
};

export default SessionForm;
