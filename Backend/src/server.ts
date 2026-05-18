import express from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import { logger } from './utils/logger.js';
import { AppError } from './utils/errors.js';
import uploadRoutes from './routes/upload.routes.js';
import translateRoutes from './routes/translate.routes.js';

const app = express();
const PORT = env.PORT;

// Enable CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'multilingual-form-translator-backend'
  });
});

// Mount Routes under /api prefix
app.use('/api', uploadRoutes);
app.use('/api', translateRoutes);

// Error Handling Middleware
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  const statusCode = err instanceof AppError ? err.statusCode : 500;
  const message = err.message || 'Internal Server Error';
  const details = err instanceof AppError ? err.details : null;

  logger.error(`Error processing request: ${message}`, {
    statusCode,
    details,
    stack: err.stack
  });

  res.status(statusCode).json({
    success: false,
    error: message,
    details
  });
});

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ success: false, error: 'Route not found' });
});

app.listen(PORT, () => {
  logger.info(`🚀 FormSetu Backend Server running on port ${PORT}`);
  logger.info(`📊 Health check: http://localhost:${PORT}/health`);
});
