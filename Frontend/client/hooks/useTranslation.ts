import { useState } from 'react';
import { uploadFile, translateText, cleanupJob } from '../services/api.js';
import { Job } from '../types/index.js';

export function useTranslation() {
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startTranslationFlow = async (file: File) => {
    setLoading(true);
    setError(null);
    setJob({
      id: '',
      status: 'ocr',
      progress: 30,
      fileName: file.name,
      fileType: file.type,
    });

    try {
      // Upload & OCR
      const { jobId, originalText } = await uploadFile(file);
      
      setJob({
        id: jobId,
        status: 'done',
        progress: 60,
        originalText,
        fileName: file.name,
        fileType: file.type,
      });
      setLoading(false);
      return { jobId, originalText };
    } catch (err: any) {
      setError(err.message || 'File upload and OCR failed');
      setJob(prev => prev ? { ...prev, status: 'error', error: err.message } : null);
      setLoading(false);
      throw err;
    }
  };

  const triggerTranslation = async (text: string, targetLang: string, jobId?: string) => {
    if (!text) return;
    setLoading(true);
    setError(null);
    if (jobId) {
      setJob(prev => prev ? { ...prev, status: 'translating', progress: 80, targetLanguage: targetLang } : null);
    }

    try {
      const { translatedText } = await translateText(text, targetLang, jobId);
      setJob(prev => prev ? {
        ...prev,
        status: 'done',
        progress: 100,
        translatedText,
        targetLanguage: targetLang,
      } : {
        id: jobId || '',
        status: 'done',
        progress: 100,
        originalText: text,
        translatedText,
        targetLanguage: targetLang,
      });
      setLoading(false);
    } catch (err: any) {
      setError(err.message || 'Translation failed');
      setJob(prev => prev ? { ...prev, status: 'error', error: err.message } : null);
      setLoading(false);
      throw err;
    }
  };

  const reset = () => {
    if (job?.id) {
      cleanupJob(job.id);
    }
    setJob(null);
    setError(null);
    setLoading(false);
  };

  return {
    job,
    loading,
    error,
    startTranslationFlow,
    triggerTranslation,
    reset,
  };
}
