import { TranslationRequest, TranslationResponse } from '../../types/index.js';

export interface ITranslationProvider {
  name: string;
  translate(req: TranslationRequest): Promise<TranslationResponse>;
}
