export interface OcrResult {
  text: string;
  method: 'direct-read' | 'pdf-parse' | 'gemini';
  pageCount?: number;
}

export interface TranslationRequest {
  text: string;
  target: string;
  source?: string;
}

export interface TranslationResponse {
  translatedText: string;
  detectedLanguage?: {
    language: string;
    confidence?: number;
  };
  provider: string;
}

export interface ITranslationProvider {
  name: string;
  translate(req: TranslationRequest): Promise<TranslationResponse>;
}
