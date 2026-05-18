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
  createdAt: number;
}

const jobs = new Map<string, Job>();

export const JobStore = {
  create: (id: string, fileName?: string, fileType?: string): Job => {
    const job: Job = {
      id,
      status: 'queued',
      progress: 0,
      fileName,
      fileType,
      createdAt: Date.now()
    };
    jobs.set(id, job);
    return job;
  },
  update: (id: string, patch: Partial<Job>) => {
    const job = jobs.get(id);
    if (job) {
      jobs.set(id, { ...job, ...patch });
    }
  },
  get: (id: string) => jobs.get(id),
  delete: (id: string) => jobs.delete(id),
  cleanup: () => {
    const cutoff = Date.now() - 30 * 60 * 1000; // 30 mins
    for (const [id, job] of jobs.entries()) {
      if (job.createdAt < cutoff) {
        jobs.delete(id);
      }
    }
  }
};

// Run cleanup every 5 minutes
setInterval(() => {
  JobStore.cleanup();
}, 5 * 60 * 1000);
