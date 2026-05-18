import PDFDocument from 'pdfkit';
import fs from 'fs';
import { logger } from '../../utils/logger.js';
import { AppError } from '../../utils/errors.js';

export class PdfGeneratorService {
  public async generatePdf(text: string, outputPath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ margin: 50 });
        const stream = fs.createWriteStream(outputPath);
        
        doc.pipe(stream);

        // Map system Unicode fonts on Windows to support Indian characters
        let fontPath: string | undefined = undefined;
        const possibleFontPaths = [
          'C:\\Windows\\Fonts\\arial.ttf',
          'C:\\Windows\\Fonts\\mangal.ttf',
        ];

        for (const p of possibleFontPaths) {
          if (fs.existsSync(p)) {
            fontPath = p;
            break;
          }
        }

        doc
          .fontSize(18)
          .font(fontPath ? fontPath : 'Helvetica-Bold')
          .text('FormSetu - Translated Document Output', { align: 'center' })
          .moveDown(1.5);

        doc
          .fontSize(12)
          .font(fontPath ? fontPath : 'Helvetica')
          .text(text, { align: 'left', lineGap: 4 });

        doc.end();

        stream.on('finish', () => {
          logger.info(`Successfully generated translated PDF: ${outputPath}`);
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
