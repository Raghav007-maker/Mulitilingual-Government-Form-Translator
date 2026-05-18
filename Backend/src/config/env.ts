import dotenv from 'dotenv';

dotenv.config();

export const env = {
  PORT: process.env.PORT || '3001', // Maintain port 3001 as previously used
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
  GOOGLE_TRANSLATE_API_KEY: process.env.GOOGLE_TRANSLATE_API_KEY || '',
  MAX_FILE_SIZE_MB: parseInt(process.env.MAX_FILE_SIZE_MB || '20', 10),
  TEMP_FILE_DIR: process.env.TEMP_FILE_DIR || './uploads',
  NODE_ENV: process.env.NODE_ENV || 'development',
};

if (!env.GEMINI_API_KEY) {
  console.warn('WARNING: GEMINI_API_KEY is not defined. OCR features will fail.');
}
