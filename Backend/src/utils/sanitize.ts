import path from 'path';

export function sanitizeText(raw: string, maxLength = 50000): string {
  return raw
    .replace(/\0/g, '') // Null bytes
    .replace(/\r\n/g, '\n') // Line endings
    .replace(/\r/g, '\n')
    .replace(/[ \t]{3,}/g, '  ') // Collapse spaces
    .trim()
    .slice(0, maxLength);
}

const ALLOWED_MIME_TYPES = new Set([
  'application/pdf',
  'image/png',
  'image/jpeg',
  'image/jpg',
  'text/plain',
]);

const ALLOWED_EXTENSIONS = new Set([
  '.pdf',
  '.png',
  '.jpg',
  '.jpeg',
  '.txt',
]);

export function isAllowedFile(mimeType: string, filename: string): boolean {
  const ext = path.extname(filename).toLowerCase();
  return ALLOWED_MIME_TYPES.has(mimeType) || ALLOWED_EXTENSIONS.has(ext);
}
