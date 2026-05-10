/**
 * Builds a prompt to generate interview Q&As via Gemini.
 */
exports.generateQuestionsPrompt = (role, experience, topicsToFocus, numberOfQuestions = 10) => `
You are an expert technical interviewer.
Generate ${numberOfQuestions} interview questions for a "${role}" role 
with ${experience} years of experience.
Focus on these topics: ${topicsToFocus}.

Return ONLY a valid JSON array (no markdown, no extra text) in this format:
[
  {
    "question": "...",
    "answer": "..."
  }
]
`;

/**
 * Builds a prompt to generate a plain-English concept explanation via Gemini.
 */
exports.generateConceptExplanationPrompt = (question, currentAnswer) => `
You are an expert software engineer and technical coach.
A student asked the following interview question:

Question: "${question}"

The provided answer is: "${currentAnswer}"

Please give a beginner-friendly, thorough concept explanation that:
1. Clarifies the core concept.
2. Gives a real-world analogy if helpful.
3. Provides a code example if relevant.
4. Mentions common interview follow-ups or gotchas.

Respond in plain text (no JSON). Be clear and structured with headings.
`;
