import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { JobStore } from '../utils/jobStore.js';
import { GeminiService } from '../services/ocr/gemini.service.js';
import { PdfService } from '../services/ocr/pdf.service.js';
import { PdfGeneratorService } from '../services/document/pdf-generator.service.js';
import { logger } from '../utils/logger.js';
import { AppError } from '../utils/errors.js';
import { env } from '../config/env.js';
import fs from 'fs';
import path from 'path';

const geminiService = new GeminiService();
const pdfService = new PdfService();
const pdfGenerator = new PdfGeneratorService();

export async function uploadController(req: Request, res: Response, next: NextFunction) {
  const file = req.file;
  if (!file) {
    return next(new AppError('No file uploaded', 400));
  }

  const jobId = uuidv4();
  const filePath = file.path;
  const mimeType = file.mimetype;
  const originalName = file.originalname;

  logger.info(`Received upload request | file: ${originalName} | mime: ${mimeType}`);

  // Create Job in JobStore
  JobStore.create(jobId, originalName, mimeType);
  JobStore.update(jobId, { status: 'ocr', progress: 20 });

  try {
    let extractedText = '';
    const ext = path.extname(originalName).toLowerCase();
    
    // Decision Tree
    if (ext === '.txt') {
      logger.info(`Processing .txt file directly: ${filePath}`);
      extractedText = fs.readFileSync(filePath, 'utf-8');
    } else if (ext === '.pdf') {
      const digitalText = await pdfService.extractTextLayer(filePath);
      if (digitalText && digitalText.length >= 50) {
        logger.info(`Extracted digital text layer successfully from PDF.`);
        extractedText = digitalText;
      } else {
        logger.info(`PDF has minimal text layer (< 50 chars). Falling back to Gemini 2.5 Flash scanned OCR.`);
        JobStore.update(jobId, { progress: 40 });
        extractedText = await geminiService.extractText(filePath, mimeType);
      }
    } else {
      logger.info(`Processing image file with Gemini 2.5 Flash OCR...`);
      JobStore.update(jobId, { progress: 50 });
      extractedText = await geminiService.extractText(filePath, mimeType);
    }

    JobStore.update(jobId, {
      status: 'done',
      progress: 100,
      originalText: extractedText
    });

    // Cleanup: all files deleted after processing is complete!
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        logger.info(`Cleaned up temp upload file: ${filePath}`);
      }
    } catch (cleanupErr: any) {
      logger.error(`Error deleting temp file: ${cleanupErr.message}`);
    }

    return res.status(200).json({
      success: true,
      jobId,
      originalText: extractedText
    });

  } catch (error: any) {
    JobStore.update(jobId, { status: 'error', error: error.message || 'Processing failed' });
    
    // Cleanup on failure as well
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        logger.info(`Cleaned up temp upload file after error: ${filePath}`);
      }
    } catch (cleanupErr: any) {
      logger.error(`Error deleting temp file: ${cleanupErr.message}`);
    }

    return next(error);
  }
}

export async function downloadController(req: Request, res: Response, next: NextFunction) {
  const { jobId } = req.params;
  const job = JobStore.get(jobId);

  if (!job) {
    return next(new AppError('Job not found or expired', 404));
  }

  if (!job.translatedText) {
    return next(new AppError('Translated content is not ready yet', 400));
  }

  const tempPdfPath = path.join(env.TEMP_FILE_DIR, `${jobId}-translated.pdf`);

  try {
    // Generate PDF to temporary file
    await pdfGenerator.generatePdf(job.translatedText, tempPdfPath);

    // Send PDF stream to client
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${job.fileName || 'document'}-translated.pdf"`);
    
    const fileStream = fs.createReadStream(tempPdfPath);
    fileStream.pipe(res);

    // On finish, delete the temporary PDF file!
    fileStream.on('end', () => {
      try {
        if (fs.existsSync(tempPdfPath)) {
          fs.unlinkSync(tempPdfPath);
          logger.info(`Deleted temp PDF download: ${tempPdfPath}`);
        }
      } catch (cleanupErr: any) {
        logger.error(`Error deleting temp PDF file: ${cleanupErr.message}`);
      }
    });

  } catch (error: any) {
    logger.error(`Download controller failed: ${error.message}`);
    return next(error);
  }
}

export async function cleanupController(req: Request, res: Response, next: NextFunction) {
  const { jobId } = req.params;
  const job = JobStore.get(jobId);

  if (job) {
    logger.info(`Wiping Job ID ${jobId} from memory store.`);
    JobStore.delete(jobId);
  }

  return res.status(200).json({
    success: true,
    message: `Job ${jobId} and temporary structures cleaned up successfully.`
  });
}
