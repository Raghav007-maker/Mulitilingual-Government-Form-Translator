import { useCallback, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LANGUAGES, LanguageCode } from "@/lib/translator";
import { Check, Copy, Loader2, Languages, Download } from "lucide-react";
import UrlLoader from "@/components/UrlLoader";
import { API_ENDPOINTS } from "@/lib/config";

// pdfjs-dist worker (Vite)
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import * as pdfjsLib from "pdfjs-dist";
// Tesseract for OCR
import Tesseract from "tesseract.js";

// Configure PDF.js worker - use local worker file
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';
}

export default function DocumentTranslator() {
  const [sourceText, setSourceText] = useState("");
  const [translated, setTranslated] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [target, setTarget] = useState<LanguageCode>("hi");
  const [detected, setDetected] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [useOCR, setUseOCR] = useState(true);
  const [ocrLang, setOcrLang] = useState("eng+hin");
  const [ocrProgress, setOcrProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  const targetLabel = useMemo(() => LANGUAGES.find(l => l.code === target)?.name ?? target, [target]);

  const runOcrOnPdf = useCallback(async (pdf: any) => {
    let out = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale: 2 });
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) continue;
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      await page.render({ canvasContext: ctx, viewport }).promise;
      const dataUrl = canvas.toDataURL("image/png");
      const { data } = await Tesseract.recognize(dataUrl, ocrLang, {
        logger: (m) => {
          if (m.status === "recognizing text" && typeof m.progress === "number") {
            setOcrProgress(Math.round(((i - 1) / pdf.numPages + m.progress / pdf.numPages) * 100));
          }
        },
      });
      out += (i > 1 ? "\n\n" : "") + (data?.text || "");
    }
    return out.trim();
  }, [ocrLang]);

  const onFile = useCallback(async (file: File) => {
    setFileName(file.name);
    setSourceText("");
    setTranslated("");
    setOcrProgress(0);
    setError(null);
    setLoading(true);

    try {
      if (file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")) {
        console.log("Processing PDF file:", file.name);
        const buf = await file.arrayBuffer();
        
        // Try to load PDF with fallback options
        let pdf;
        try {
          pdf = await pdfjsLib.getDocument({ 
            data: buf,
            verbosity: 0,
            useWorkerFetch: false,
            isEvalSupported: false
          }).promise;
        } catch (pdfError) {
          console.warn("PDF.js failed, trying fallback approach:", pdfError);
          // Fallback: try without worker
          pdfjsLib.GlobalWorkerOptions.workerSrc = '';
          try {
            pdf = await pdfjsLib.getDocument({ 
              data: buf,
              verbosity: 0,
              useWorkerFetch: false,
              isEvalSupported: false
            }).promise;
          } catch (fallbackError) {
            console.error("PDF.js fallback also failed:", fallbackError);
            throw new Error("Failed to load PDF. Please try a different file or use OCR option.");
          }
        }
        
        console.log("PDF loaded, pages:", pdf.numPages);
        let text = "";
        
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          const pageText = content.items.map((it: any) => (it.str ?? "")).join(" ");
          text += (i > 1 ? "\n\n" : "") + pageText;
        }
        
        text = text.trim();
        console.log("Extracted text length:", text.length);
        
        if (!text && useOCR) {
          console.log("No text found, using OCR...");
          try {
            const ocrText = await runOcrOnPdf(pdf);
            setSourceText(ocrText);
            console.log("OCR completed, text length:", ocrText.length);
          } catch (ocrError: any) {
            console.error("OCR failed:", ocrError);
            setError("OCR failed: " + (ocrError.message || "Unknown error"));
          }
        } else {
          setSourceText(text);
        }
      } else if (file.type.startsWith("text/") || file.name.toLowerCase().endsWith(".txt")) {
        console.log("Processing text file:", file.name);
        const text = await file.text();
        setSourceText(text);
        console.log("Text loaded, length:", text.length);
      } else {
        console.log("Processing unknown file type:", file.type);
        const text = await file.text().catch(() => "");
        setSourceText(text);
      }
    } catch (e: any) {
      console.error("File processing error:", e);
      setError("Failed to process file: " + (e?.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  }, [runOcrOnPdf, useOCR]);

  const handleDetect = useCallback(async () => {
    if (!sourceText.trim()) return;
    setLoading(true);
    try {
      const r = await fetch(API_ENDPOINTS.DETECT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ q: sourceText.slice(0, 2000) }),
      });
      const data = await r.json();
      const best = Array.isArray(data) ? data[0] : Array.isArray(data?.[0]) ? data[0][0] : null;
      setDetected(best?.language || null);
    } finally {
      setLoading(false);
    }
  }, [sourceText]);

  const handleTranslate = useCallback(async () => {
    if (!sourceText.trim()) return;
    setLoading(true);
    setError(null);
    
    try {
      console.log("Starting translation...", { textLength: sourceText.length, target });
      
      const r = await fetch(API_ENDPOINTS.TRANSLATE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ q: sourceText, target, source: "auto", format: "text" }),
      });
      
      console.log("Translation response status:", r.status);
      
      if (!r.ok) {
        const errorText = await r.text();
        console.error("Translation failed:", r.status, errorText);
        setError(`Translation failed (${r.status}): ${errorText.slice(0, 200)}`);
        setTranslated("");
        return;
      }
      
      const data = await r.json();
      console.log("Translation successful:", data);
      
      if (data?.translatedText) {
        setTranslated(data.translatedText);
        console.log("Translation completed, length:", data.translatedText.length);
      } else {
        setError("No translation received from server");
        setTranslated("");
      }
    } catch (e: any) {
      console.error("Translation error:", e);
      setError(`Translation failed: ${e?.message || "Network error"}`);
      setTranslated("");
    } finally {
      setLoading(false);
    }
  }, [sourceText, target]);

  const copyOut = async () => {
    await navigator.clipboard.writeText(translated);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  const downloadOut = () => {
    const blob = new Blob([translated], { type: "text/plain;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${(fileName || "translation").replace(/\.[^.]+$/, "")}__${target}.txt`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <section className="container mx-auto" id="doc-translator">
      <Card className="bg-gradient-to-b from-black/30 to-black/10 border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="text-base sm:text-lg inline-flex items-center gap-2"><Languages className="h-5 w-5"/> PDF/Text Translator</span>
            <div className="text-xs text-muted-foreground">Target: <span className="font-medium">{targetLabel}</span>{detected ? <> · Detected: <span className="font-mono">{detected}</span></> : null}</div>
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-muted-foreground">Target language</label>
                <Select value={target} onValueChange={(v) => setTarget(v as LanguageCode)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LANGUAGES.map(l => (
                      <SelectItem key={l.code} value={l.code}>{l.name} · {l.native}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Upload PDF or text file</label>
                <Input 
                  type="file" 
                  accept=".pdf,.txt,text/plain,application/pdf" 
                  onChange={(e) => e.target.files && onFile(e.target.files[0])} 
                  className="mt-1 cursor-pointer bg-black/20 border-border/50" 
                  disabled={loading}
                />
                {loading && fileName && (
                  <div className="mt-2 text-xs text-muted-foreground">
                    Processing {fileName}...
                  </div>
                )}
              </div>
            </div>

            <UrlLoader onLoad={async (blob) => {
              const file = new File([blob], "remote", { type: blob.type || "application/pdf" });
              await onFile(file);
            }} />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <label className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                <input type="checkbox" checked={useOCR} onChange={(e) => setUseOCR(e.target.checked)} className="h-4 w-4" />
                Use OCR if PDF has no text
              </label>
              <div className="sm:col-span-2">
                <label className="text-sm text-muted-foreground">OCR languages</label>
                <Select value={ocrLang} onValueChange={setOcrLang}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="eng">English (fast)</SelectItem>
                    <SelectItem value="eng+hin">English + Hindi (default)</SelectItem>
                    <SelectItem value="eng+hin+ben+tam+tel+mar+guj+kan+mal+pan+ori+asm+urd">Major Indic set (slower)</SelectItem>
                  </SelectContent>
                </Select>
                {loading && useOCR && (
                  <div className="mt-2 text-xs text-muted-foreground">OCR progress: {ocrProgress}%</div>
                )}
              </div>
            </div>

            <label className="text-sm text-muted-foreground">Source text</label>
            <Textarea value={sourceText} onChange={(e) => setSourceText(e.target.value)} placeholder="Paste or type text here…" className="min-h-48 bg-black/20 border-border/50" />

            <div className="flex flex-wrap items-center gap-3">
              <Button onClick={handleDetect} variant="secondary" disabled={loading || !sourceText.trim()}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Detect language"}
              </Button>
              <Button onClick={handleTranslate} disabled={loading || !sourceText.trim()}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Translate"}
              </Button>
              {loading && (
                <span className="text-sm text-muted-foreground">
                  {sourceText.length > 1000 ? "Processing large text..." : "Processing..."}
                </span>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm text-muted-foreground">Translated output</label>
            <Textarea value={translated} onChange={(e) => setTranslated(e.target.value)} className="min-h-48 bg-black/20 border-border/50" placeholder="Translation will appear here…" />
            <div className="flex items-center gap-3">
              <Button onClick={copyOut} className="gap-2" disabled={!translated}>
                {copied ? <><Check className="h-4 w-4"/> Copied</> : <><Copy className="h-4 w-4"/> Copy</>}
              </Button>
              <Button onClick={downloadOut} variant="secondary" className="gap-2" disabled={!translated}>
                <Download className="h-4 w-4"/> Download .txt
              </Button>
            </div>
            {error && (
              <div className="text-xs text-destructive mt-2 break-words">{error}</div>
            )}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
