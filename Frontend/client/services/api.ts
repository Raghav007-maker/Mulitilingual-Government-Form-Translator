const BASE_URL = 'http://localhost:3001/api';

export async function uploadFile(file: File): Promise<{ jobId: string; originalText: string }> {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${BASE_URL}/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `Upload failed with status ${res.status}`);
  }

  const data = await res.json();
  return {
    jobId: data.jobId,
    originalText: data.originalText,
  };
}

export async function translateText(
  text: string,
  targetLang: string,
  jobId?: string
): Promise<{ translatedText: string }> {
  const res = await fetch(`${BASE_URL}/translate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text, targetLang, jobId }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `Translation failed with status ${res.status}`);
  }

  const data = await res.json();
  return {
    translatedText: data.translatedText,
  };
}

export function getDownloadUrl(jobId: string): string {
  return `${BASE_URL}/download/${jobId}`;
}

export async function cleanupJob(jobId: string): Promise<void> {
  await fetch(`${BASE_URL}/cleanup/${jobId}`, {
    method: 'DELETE',
  }).catch((err) => console.warn('Cleanup failed:', err));
}
