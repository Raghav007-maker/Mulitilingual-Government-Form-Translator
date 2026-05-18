import multer from 'multer';
import { env } from '../config/env.js';
import { isAllowedFile } from '../utils/sanitize.js';
import { AppError } from '../utils/errors.js';
import fs from 'fs';
import path from 'path';

// Ensure upload directory exists
const uploadDir = env.TEMP_FILE_DIR;
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

export const uploadMiddleware = multer({
  storage,
  limits: {
    fileSize: env.MAX_FILE_SIZE_MB * 1024 * 1024
  },
  fileFilter: (_req, file, cb) => {
    if (isAllowedFile(file.mimetype, file.originalname)) {
      cb(null, true);
    } else {
      cb(new AppError('Invalid file type. Only PDF, PNG, JPG, JPEG, and TXT files are allowed.', 400) as any, false);
    }
  }
});
