// Free Google Translate API (no API key required)
const GOOGLE_TRANSLATE_URL = "https://translate.googleapis.com/translate_a/single";

interface TranslationRequest {
  text: string;
  target: string;
  source?: string;
  format?: "text" | "html";
}

interface TranslationResponse {
  translatedText: string;
  detectedLanguage?: {
    confidence: number;
    language: string;
  };
}

interface DetectionResponse {
  confidence: number;
  language: string;
}

interface LanguageInfo {
  code: string;
  name: string;
}

// Language code mapping for Google Translate
const LANGUAGE_MAP: Record<string, string> = {
  "hi": "hi", // Hindi
  "bn": "bn", // Bengali
  "ta": "ta", // Tamil
  "te": "te", // Telugu
  "mr": "mr", // Marathi
  "gu": "gu", // Gujarati
  "kn": "kn", // Kannada
  "ml": "ml", // Malayalam
  "pa": "pa", // Punjabi
  "or": "or", // Odia
  "as": "as", // Assamese
  "ur": "ur", // Urdu
  "en": "en", // English
  "auto": "auto"
};

async function translateWithGoogle(text: string, target: string, source: string = "auto"): Promise<{ ok: boolean; json?: any; error?: string }> {
  try {
    const targetLang = LANGUAGE_MAP[target] || target;
    const sourceLang = source === "auto" ? "auto" : (LANGUAGE_MAP[source] || source);
    
    const params = new URLSearchParams({
      client: "gtx",
      sl: sourceLang,
      tl: targetLang,
      dt: "t",
      q: text
    });

    const response = await fetch(`${GOOGLE_TRANSLATE_URL}?${params}`, {
      method: "GET",
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
      }
    });

    if (!response.ok) {
      return { ok: false, error: `HTTP ${response.status}: ${response.statusText}` };
    }

    const data = await response.json();
    
    if (!data || !Array.isArray(data) || !data[0] || !Array.isArray(data[0])) {
      return { ok: false, error: "Invalid response format from Google Translate" };
    }

    const translatedText = data[0].map((item: any) => item[0]).join("");
    const detectedLanguage = data[2] || sourceLang;

    return {
      ok: true,
      json: {
        translatedText,
        detectedLanguage: {
          confidence: 0.9,
          language: detectedLanguage
        }
      }
    };
  } catch (error: any) {
    return { ok: false, error: error.message || "Translation failed" };
  }
}

async function detectLanguageWithGoogle(text: string): Promise<{ ok: boolean; json?: any; error?: string }> {
  try {
    const params = new URLSearchParams({
      client: "gtx",
      sl: "auto",
      tl: "en",
      dt: "t",
      q: text
    });

    const response = await fetch(`${GOOGLE_TRANSLATE_URL}?${params}`, {
      method: "GET",
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
      }
    });

    if (!response.ok) {
      return { ok: false, error: `HTTP ${response.status}: ${response.statusText}` };
    }

    const data = await response.json();
    
    if (!data || !Array.isArray(data) || !data[2]) {
      return { ok: false, error: "Invalid response format from Google Translate" };
    }

    const detectedLanguage = data[2];
    const confidence = 0.8; // Google doesn't provide confidence, so we estimate

    return {
      ok: true,
      json: [{
        confidence,
        language: detectedLanguage
      }]
    };
  } catch (error: any) {
    return { ok: false, error: error.message || "Language detection failed" };
  }
}

function splitIntoChunks(text: string, max = 4000): string[] {
  const parts: string[] = [];
  let buf = "";
  const segments = text.split(/(\n\n+|[.!?]+\s+)/g); // preserve separators
  
  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i];
    if ((buf + seg).length > max && buf) {
      parts.push(buf);
      buf = seg.trimStart();
    } else {
      buf += seg;
    }
  }
  
  if (buf) parts.push(buf);
  return parts.filter(Boolean);
}

export async function translateText(request: TranslationRequest): Promise<TranslationResponse> {
  const { text, target, source = "auto", format = "text" } = request;
  
  // Google Translate supports all our languages
  const tgt = LANGUAGE_MAP[target] || target;
  
  const chunks = splitIntoChunks(text, 4000);
  
  if (chunks.length === 1) {
    const resp = await translateWithGoogle(text, tgt, source);
    
    if (!resp.ok) {
      throw new Error(`Translation failed: ${resp.error}`);
    }
    
    return resp.json;
  }
  
  let combined = "";
  for (const part of chunks) {
    const resp = await translateWithGoogle(part, tgt, source);
    
    if (!resp.ok) {
      throw new Error(`Translation failed: ${resp.error}`);
    }
    
    combined += (combined ? "\n\n" : "") + (resp.json?.translatedText || "");
  }
  
  return { translatedText: combined };
}

export async function detectLanguage(text: string): Promise<DetectionResponse[]> {
  const resp = await detectLanguageWithGoogle(text);
  
  if (!resp.ok) {
    throw new Error(`Language detection failed: ${resp.error}`);
  }
  
  return resp.json;
}

export async function getSupportedLanguages(): Promise<LanguageInfo[]> {
  // Return the languages we support
  return [
    { code: "en", name: "English" },
    { code: "hi", name: "Hindi" },
    { code: "bn", name: "Bengali" },
    { code: "ta", name: "Tamil" },
    { code: "te", name: "Telugu" },
    { code: "mr", name: "Marathi" },
    { code: "gu", name: "Gujarati" },
    { code: "kn", name: "Kannada" },
    { code: "ml", name: "Malayalam" },
    { code: "pa", name: "Punjabi" },
    { code: "or", name: "Odia" },
    { code: "as", name: "Assamese" },
    { code: "ur", name: "Urdu" }
  ];
}
