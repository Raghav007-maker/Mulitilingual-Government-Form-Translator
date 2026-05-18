export type JobStatus = 'queued' | 'ocr' | 'translating' | 'done' | 'error';

export interface Job {
  id: string;
  status: JobStatus;
  progress: number;
  originalText?: string;
  translatedText?: string;
  targetLanguage?: string;
  fileName?: string;
  fileType?: string;
  error?: string;
}

export interface Language {
  code: string;
  name: string;
  nativeName: string;
}
