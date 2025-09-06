// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

// API Endpoints
export const API_ENDPOINTS = {
  TRANSLATE: `${API_BASE_URL}/api/translate`,
  DETECT: `${API_BASE_URL}/api/detect`,
  LANGUAGES: `${API_BASE_URL}/api/languages`,
  HEALTH: `${API_BASE_URL}/health`,
} as const;
