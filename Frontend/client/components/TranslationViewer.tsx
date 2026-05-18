import React, { useState } from 'react';
import { Copy, Check, FileCheck, Languages } from 'lucide-react';

interface TranslationViewerProps {
  translatedText: string;
  originalText: string;
  loading: boolean;
  onDownloadPdf: () => void;
}

export default function TranslationViewer({
  translatedText,
  originalText,
  loading,
  onDownloadPdf,
}: TranslationViewerProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!translatedText) return;
    navigator.clipboard.writeText(translatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const displayText = translatedText || originalText;

  return (
    <div className="flex flex-col h-[600px] rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/10 overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/[0.01]">
        <div className="flex items-center space-x-2 text-white">
          <Languages size={18} className="text-[#7000ff]" />
          <h3 className="font-semibold text-sm uppercase tracking-wider">
            {translatedText ? 'Translated Document' : 'Extracted Text Output'}
          </h3>
        </div>
        <div className="flex items-center space-x-2">
          {displayText && (
            <button
              onClick={handleCopy}
              className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-colors"
              title="Copy to Clipboard"
            >
              {copied ? <Check size={16} className="text-[#00f2ff]" /> : <Copy size={16} />}
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 p-6 relative flex flex-col">
        {loading ? (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex flex-col items-center justify-center space-y-4">
            <div className="w-10 h-10 border-4 border-[#00f2ff] border-t-transparent rounded-full animate-spin" />
            <p className="text-sm font-semibold text-white tracking-wider animate-pulse">Translating Form Content...</p>
          </div>
        ) : null}

        {displayText ? (
          <textarea
            readOnly
            value={displayText}
            placeholder="Translation will appear here..."
            className="flex-1 w-full p-4 rounded-xl bg-black/20 border border-white/5 text-gray-200 font-sans text-base focus:outline-none resize-none leading-relaxed"
          />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-500 space-y-2">
            <Languages size={48} className="opacity-20 text-[#7000ff]" />
            <p className="text-sm">Upload a document to extract and translate text</p>
          </div>
        )}
      </div>

      {translatedText && (
        <div className="px-6 py-4 border-t border-white/10 bg-white/[0.01] flex justify-end">
          <button
            onClick={onDownloadPdf}
            className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#7000ff] to-[#00f2ff] text-white font-semibold text-sm shadow-[0_0_20px_rgba(112,0,255,0.3)] hover:opacity-90 active:scale-95 transition-all"
          >
            <FileCheck size={16} />
            <span>Download Translated PDF</span>
          </button>
        </div>
      )}
    </div>
  );
}
