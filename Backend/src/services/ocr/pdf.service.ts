import fs from 'fs';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');
import { logger } from '../../utils/logger.js';

export class PdfService {
  public async extractTextLayer(filePath: string): Promise<string> {
    try {
      logger.info(`Checking digital text layer for PDF: ${filePath}`);
      const dataBuffer = fs.readFileSync(filePath);
      const data = await pdfParse(dataBuffer);
      const extractedText = data.text ? data.text.trim() : '';
      
      logger.info(`Completed pdf-parse text extraction. Extracted ${extractedText.length} characters.`);
      return extractedText;
    } catch (error: any) {
      logger.warn(`pdf-parse failed to extract text (might be scanned or corrupted): ${error.message || error}`);
      return '';
    }
  }
}
