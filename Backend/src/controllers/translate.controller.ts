import { Request, Response, NextFunction } from 'express';
import { GoogleTranslateService } from '../services/translation/google.service.js';
import { JobStore } from '../utils/jobStore.js';
import { AppError } from '../utils/errors.js';
import { logger } from '../utils/logger.js';

const translationService = new GoogleTranslateService();

export async function translateController(req: Request, res: Response, next: NextFunction) {
  const { text, targetLang, jobId } = req.body;

  if (!text || !targetLang) {
    return next(new AppError('text and targetLang are required fields', 400));
  }

  logger.info(`Received translation request | target: ${targetLang} | size: ${text.length}`);

  if (jobId) {
    JobStore.update(jobId, { status: 'translating', progress: 70, targetLanguage: targetLang });
  }

  try {
    const result = await translationService.translate({
      text,
      target: targetLang,
    });

    if (jobId) {
      JobStore.update(jobId, {
        status: 'done',
        progress: 100,
        translatedText: result.translatedText,
      });
    }

    return res.status(200).json({
      success: true,
      translatedText: result.translatedText,
      detectedLanguage: result.detectedLanguage,
      provider: result.provider,
    });

  } catch (error: any) {
    if (jobId) {
      JobStore.update(jobId, { status: 'error', error: error.message || 'Translation failed' });
    }
    return next(error);
  }
}
