import { Router } from 'express';
import { z } from 'zod';
import { translateController } from '../controllers/translate.controller.js';
import { validate } from '../middleware/validate.middleware.js';
import { translateRateLimiter } from '../middleware/rateLimit.middleware.js';

const router = Router();

const translateSchema = z.object({
  body: z.object({
    text: z.string().min(1, 'text must contain at least 1 character'),
    targetLang: z.string().min(2, 'targetLang must be at least 2 characters'),
    jobId: z.string().optional(),
  }),
});

router.post('/translate', translateRateLimiter, validate(translateSchema), translateController);

export default router;
