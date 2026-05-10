export const BASE_URL = "http://localhost:5001";

export const API_PATHS = {
  AUTH: {
    REGISTER: "/api/auth/register",
    LOGIN: "/api/auth/login",
    GET_PROFILE: "/api/auth/profile",
    UPLOAD_IMAGE: "/api/auth/upload-image",
  },
  SESSION: {
    CREATE: "/api/sessions",
    GET_ALL: "/api/sessions",
    GET_BY_ID: (id) => `/api/sessions/${id}`,
    DELETE: (id) => `/api/sessions/${id}`,
  },
  QUESTION: {
    ADD: (sessionId) => `/api/questions/${sessionId}`,
    PIN: (id) => `/api/questions/${id}/pin`,
    UPDATE_NOTE: (id) => `/api/questions/${id}/note`,
    DELETE: (id) => `/api/questions/${id}`,
  },
  AI: {
    GENERATE_QUESTIONS: "/api/ai/generate-questions",
    GENERATE_EXPLANATION: "/api/ai/generate-explanation",
  },
};
