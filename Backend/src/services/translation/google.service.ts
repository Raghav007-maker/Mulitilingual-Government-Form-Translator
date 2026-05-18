import { ITranslationProvider } from './translator.interface.js';
import { TranslationRequest, TranslationResponse } from '../../types/index.js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { env } from '../../config/env.js';
import { logger } from '../../utils/logger.js';
import { AppError } from '../../utils/errors.js';

export class GoogleTranslateService implements ITranslationProvider {
  public readonly name = 'gemini-translator';
  private genAI?: GoogleGenerativeAI;

  constructor() {
    if (env.GEMINI_API_KEY) {
      this.genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);
    }
  }

  public async translate(req: TranslationRequest): Promise<TranslationResponse> {
    const { text, target, source = 'auto' } = req;
    
    if (!env.GEMINI_API_KEY) {
      throw new AppError('GEMINI_API_KEY is not configured in .env file.', 500);
    }
    
    if (!this.genAI) {
      this.genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);
    }

    try {
      const LANGUAGE_MAP: Record<string, string> = {
        hi: 'Hindi',
        bn: 'Bengali',
        ta: 'Tamil',
        te: 'Telugu',
        mr: 'Marathi',
        gu: 'Gujarati',
        kn: 'Kannada',
        ml: 'Malayalam',
        pa: 'Punjabi',
        or: 'Odia',
        as: 'Assamese',
        ur: 'Urdu',
        en: 'English'
      };
      
      const targetLanguageName = LANGUAGE_MAP[target] || target || 'English';
      logger.info(`Translating text to ${targetLanguageName} using Gemini 2.5 Flash API... target: ${target}`);
      const model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
      
      const prompt = `You are a high-fidelity translator processing official/government documents.
Translate the following extracted text (source language: ${source}) into clear, grammatically correct, structured ${targetLanguageName}.

Strict rules for formatting preservation:
1. Preserve all section headings, layout boundaries, and labels.
2. Mirror the exact structure of fillable form inputs, maintaining the exact underscore blank fill markers (e.g. "_______" or "__________") exactly as they appear in the original text next to their translated labels.
3. Do not summarize, skip, interpret, or omit any text.
4. Output only the translated text, with no extra conversational preambles, introductory markers, or metadata.

Text to translate:
---
${text}
---`;

      const result = await model.generateContent([prompt]);
      const translatedText = result.response.text();
      
      if (!translatedText) {
        throw new AppError('Gemini translator returned an empty response', 500);
      }
      
      logger.info(`Successfully completed Gemini translation. Translated ${translatedText.length} characters.`);
      
      return {
        translatedText,
        detectedLanguage: {
          language: source,
          confidence: 1.0
        },
        provider: this.name
      };
    } catch (error: any) {
      logger.error(`Gemini translation failed: ${error.message || error}`);
      throw new AppError(`Gemini translation failed: ${error.message || 'Unknown error'}`, 500);
    }
  }
}
