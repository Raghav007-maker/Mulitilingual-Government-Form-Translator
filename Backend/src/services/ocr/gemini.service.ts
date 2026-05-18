import { GoogleGenerativeAI } from '@google/generative-ai';
import { env } from '../../config/env.js';
import { logger } from '../../utils/logger.js';
import { AppError } from '../../utils/errors.js';
import fs from 'fs';

export class GeminiService {
  private genAI: GoogleGenerativeAI;

  constructor() {
    // Initialize lazily or if key is present to prevent startup failure
    if (env.GEMINI_API_KEY) {
      this.genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);
    }
  }

  private fileToGenerativePart(filePath: string, mimeType: string) {
    return {
      inlineData: {
        data: fs.readFileSync(filePath).toString('base64'),
        mimeType
      }
    };
  }

  public async extractText(filePath: string, mimeType: string): Promise<string> {
    if (!env.GEMINI_API_KEY) {
      throw new AppError('GEMINI_API_KEY is not configured. Please add it to your .env file.', 500);
    }
    
    if (!this.genAI) {
      this.genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);
    }

    try {
      logger.info(`Sending document to Gemini 2.5 Flash API for OCR... | file: ${filePath}`);
      const model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
      
      const prompt = `You are extracting text from an Indian government document.
Extract ALL visible text in reading order (top to bottom, left to right).
Preserve section headings, field labels, and instructional text.
If a field label has an adjacent blank line, underline marker, empty input box, or fillable gap next to it, represent it using underscores like "_______" to mirror the empty form inputs. For example: "प्रथम नाम :  _______ मध्य नाम : ________  अंतिम नाम : _________".
If a field label and its blank line appear together, write them on the same line.
Do not summarize, interpret, or skip any text.
Output only the extracted text, nothing else.`;

      const filePart = this.fileToGenerativePart(filePath, mimeType);
      
      const result = await model.generateContent([prompt, filePart]);
      const text = result.response.text();
      
      if (!text) {
        throw new AppError('Gemini OCR returned an empty response', 500);
      }
      
      logger.info(`Successfully completed Gemini OCR. Extracted ${text.length} characters.`);
      return text;
    } catch (error: any) {
      logger.error(`Gemini OCR failed: ${error.message || error}`);
      throw new AppError(`Gemini OCR failed: ${error.message || 'Unknown error'}`, 500);
    }
  }
}
