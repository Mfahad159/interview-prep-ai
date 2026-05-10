# Interview Prep AI - MERN Stack Platform

An advanced interview preparation platform utilizing Artificial Intelligence to generate role-specific questions and detailed concept explanations. The application is built on the MERN (MongoDB, Express.js, React, Node.js) stack and integrates with OpenRouter for multi-model AI fallbacks.

## Technical Stack

### Frontend
- React 19 (Vite)
- TypeScript
- Tailwind CSS (v4)
- React Router Dom (v7)
- Axios for API Communication
- React Markdown & Syntax Highlighter for AI response rendering

### Backend
- Node.js & Express.js
- MongoDB (Mongoose ODM)
- JSON Web Token (JWT) for Authentication
- OpenRouter API (Accessing Gemini 1.5, Llama 3.1, and GPT-3.5)
- OpenAI SDK (Compatible interface for OpenRouter)

## Key Features

- **Atomic Session Management**: Create interview sessions with specific roles, experience levels, and focus topics. AI questions are generated instantly upon session creation.
- **AI-Powered Question Generation**: Context-aware interview questions generated based on user-provided parameters.
- **Deep Concept Learning**: An integrated "Learn More" feature that fetches detailed AI explanations for any question, including formatted code blocks and structured insights.
- **Multi-Model AI Fallback**: A robust backend logic that attempts generation across multiple AI models (Gemini, Llama, Mistral, GPT) to ensure high availability.
- **Secure Authentication**: Full user authentication system with JWT persistence and protected routing.
- **Premium UI/UX**: Modern, responsive design featuring glassmorphism, high-contrast badges, and interactive accordion-style Q&A components.

## Project Structure

```text
/backend
  /controllers     - Request handling logic
  /models          - MongoDB schemas
  /routes          - API endpoint definitions
  /utils           - Helper functions and AI integration
  server.js        - Main entry point

/frontend
  /src
    /components    - Reusable UI cards and layouts
    /context       - Global user state management
    /pages         - Main application views (Dashboard, InterviewPrep, Auth)
    /utils         - Axios configuration and API paths
```

## Setup and Installation

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas account or local MongoDB instance
- OpenRouter API Key

### Backend Configuration
1. Navigate to the `/backend` directory.
2. Install dependencies: `npm install`.
3. Create a `.env` file based on `.env.example` with the following variables:
   - `MONGO_URI`
   - `JWT_SECRET`
   - `OPENROUTER_API_KEY`
   - `PORT` (default: 5001)
4. Start the server: `npm run dev`.

### Frontend Configuration
1. Navigate to the `/frontend/interview-prep-ai` directory.
2. Install dependencies: `npm install`.
3. Start the development server: `npm run dev`.

## Deployment

### Vercel Deployment
The project is optimized for Vercel deployment using the provided `vercel.json` configurations in both frontend and backend directories.

1. **Backend**: Set up as a Node.js serverless function. Ensure all Environment Variables are added in the Vercel dashboard.
2. **Frontend**: Configure `VITE_API_BASE_URL` to point to the production backend URL. The frontend `vercel.json` handles SPA routing to prevent 404 errors on page refresh.

## License
This project is developed for academic purposes as part of the Semester 6 Web Development curriculum.
