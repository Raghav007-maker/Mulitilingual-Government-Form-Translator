import { Router } from 'express';
import { uploadController, downloadController, cleanupController } from '../controllers/upload.controller.js';
import { uploadMiddleware } from '../middleware/upload.middleware.js';
import { uploadRateLimiter } from '../middleware/rateLimit.middleware.js';

const router = Router();

router.post('/upload', uploadRateLimiter, uploadMiddleware.single('file'), uploadController);
router.get('/download/:jobId', downloadController);
router.delete('/cleanup/:jobId', cleanupController);

export default router;
