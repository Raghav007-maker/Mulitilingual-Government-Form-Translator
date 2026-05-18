import PDFDocument from 'pdfkit';
import fs from 'fs';
import { logger } from '../../utils/logger.js';
import { AppError } from '../../utils/errors.js';

export class PdfGeneratorService {
  /**
   * Identifies the correct pre-installed system Unicode font on Windows
   * for the specific script characters present in the text block.
   */
  private getSystemFontForText(text: string): string | undefined {
    const fontsMap = [
      { regex: /[\u0B80-\u0BFF]/, path: 'C:\\Windows\\Fonts\\latha.ttf' },      // Tamil
      { regex: /[\u0C00-\u0C7F]/, path: 'C:\\Windows\\Fonts\\gautami.ttf' },    // Telugu
      { regex: /[\u0D00-\u0D7F]/, path: 'C:\\Windows\\Fonts\\kartika.ttf' },    // Malayalam
      { regex: /[\u0C80-\u0CFF]/, path: 'C:\\Windows\\Fonts\\tunga.ttf' },      // Kannada
      { regex: /[\u0980-\u09FF]/, path: 'C:\\Windows\\Fonts\\vrinda.ttf' },     // Bengali
      { regex: /[\u0A80-\u0AFF]/, path: 'C:\\Windows\\Fonts\\shruti.ttf' },     // Gujarati
      { regex: /[\u0900-\u097F]/, path: 'C:\\Windows\\Fonts\\mangal.ttf' },     // Devanagari (Hindi, Marathi)
      { regex: /[\u0A00-\u0A7F]/, path: 'C:\\Windows\\Fonts\\raavi.ttf' }       // Gurmukhi (Punjabi)
    ];

    for (const item of fontsMap) {
      if (item.regex.test(text) && fs.existsSync(item.path)) {
        logger.info(`Detected Unicode script in output. Mapping system font: ${item.path}`);
        return item.path;
      }
    }

    // Default basic multilingual fallback
    const basicFallback = 'C:\\Windows\\Fonts\\arial.ttf';
    if (fs.existsSync(basicFallback)) {
      return basicFallback;
    }

    return undefined;
  }

  public async generatePdf(text: string, outputPath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ margin: 50 });
        const stream = fs.createWriteStream(outputPath);
        
        doc.pipe(stream);

        // Map script-specific Unicode fonts dynamically
        const fontPath = this.getSystemFontForText(text);

        // Header Title
        doc
          .fontSize(18)
          .font(fontPath ? fontPath : 'Helvetica-Bold')
          .text('FormSetu - Translated Document Output', { align: 'center' })
          .moveDown(1.5);

        // Body Text
        doc
          .fontSize(12)
          .font(fontPath ? fontPath : 'Helvetica')
          .text(text, { align: 'left', lineGap: 5 });

        doc.end();

        stream.on('finish', () => {
          logger.info(`Successfully generated translated PDF with correct Unicode rendering: ${outputPath}`);
          resolve();
        });

        stream.on('error', (err) => {
          logger.error(`PDF generation stream error: ${err.message}`);
          reject(new AppError(`PDF generation failed: ${err.message}`, 500));
        });
      } catch (error: any) {
        logger.error(`PDF generation failed: ${error.message || error}`);
        reject(new AppError(`PDF generation failed: ${error.message || 'Unknown error'}`, 500));
      }
    });
  }
}
