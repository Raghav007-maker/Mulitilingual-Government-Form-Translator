import { ITranslationProvider } from './translator.interface.js';
import { TranslationRequest, TranslationResponse } from '../../types/index.js';
import { logger } from '../../utils/logger.js';
import { AppError } from '../../utils/errors.js';

const GOOGLE_URL = 'https://translate.googleapis.com/translate_a/single';

function splitChunks(text: string, max = 4500): string[] {
  const chunks: string[] = [];
  let buf = '';
  // Split on double newlines or end of sentences
  for (const seg of text.split(/((?:\n\n+)|(?:[.!?]+\s+))/g)) {
    if ((buf + seg).length > max && buf) {
      chunks.push(buf);
      buf = seg.trimStart();
    } else {
      buf += seg;
    }
  }
  if (buf) chunks.push(buf);
  return chunks.filter(Boolean);
}

async function fetchTranslation(params: URLSearchParams): Promise<any> {
  const res = await fetch(`${GOOGLE_URL}?${params}`, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    },
  });
  if (!res.ok) throw new AppError(`Google Translate API error: HTTP ${res.status}`, res.status);
  return res.json();
}

export class GoogleTranslateService implements ITranslationProvider {
  public readonly name = 'google-translate';

  public async translate(req: TranslationRequest): Promise<TranslationResponse> {
    const { text, target, source = 'auto' } = req;
    
    try {
      logger.info(`Translating text of size ${text.length} chars to language ${target}...`);
      const chunks = splitChunks(text, 4500);
      const translatedParts: string[] = [];

      for (const chunk of chunks) {
        const params = new URLSearchParams({
          client: 'gtx',
          sl: source,
          tl: target,
          dt: 't',
          q: chunk,
        });

        const data = await fetchTranslation(params);
        if (!Array.isArray(data?.[0])) {
          throw new AppError('Unexpected response structure from translation service', 502);
        }
        
        const chunkTranslation = data[0].map((item: any) => item[0] ?? '').join('');
        translatedParts.push(chunkTranslation);
      }

      const translatedText = translatedParts.join('\n\n');
      
      // Standardize detection
      let detectedLang = 'en';
      
      return {
        translatedText,
        detectedLanguage: {
          language: detectedLang,
          confidence: 0.9
        },
        provider: this.name
      };
    } catch (error: any) {
      logger.error(`Google translation failed: ${error.message || error}`);
      throw new AppError(`Google translation failed: ${error.message || 'Unknown error'}`, 500);
    }
  }
}
