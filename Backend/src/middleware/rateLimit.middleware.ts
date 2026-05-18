import rateLimit from 'express-rate-limit';

// 10 requests per minute limit to strictly honor Gemini free tier limits
export const uploadRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10,
  message: {
    error: 'Too many uploads. The server is rate-limited to 10 requests per minute to prevent Gemini API quota exhaustion. Please try again in a moment.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

export const translateRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20,
  message: {
    error: 'Too many translation requests. Please try again in a minute.'
  },
  standardHeaders: true,
  legacyHeaders: false
});
