import React, { useState } from 'react';
import DocumentViewer from '../components/DocumentViewer.js';
import TranslationViewer from '../components/TranslationViewer.js';
import LanguageSelector from '../components/LanguageSelector.js';
import ProgressIndicator from '../components/ProgressIndicator.js';
import { ArrowLeft, Play } from 'lucide-react';
import { Job } from '../types/index.js';
import { getDownloadUrl } from '../services/api.js';

interface TranslationPageProps {
  file: File | null;
  job: Job | null;
  loading: boolean;
  onBack: () => void;
  onTranslate: (text: string, targetLang: string) => void;
}

export default function TranslationPage({
  file,
  job,
  loading,
  onBack,
  onTranslate,
}: TranslationPageProps) {
  const [selectedLanguage, setSelectedLanguage] = useState('');

  const handleTranslateClick = () => {
    if (!selectedLanguage || !job?.originalText) return;
    onTranslate(job.originalText, selectedLanguage);
  };

  const handleDownloadPdf = () => {
    if (!job?.id) return;
    window.open(getDownloadUrl(job.id), '_blank');
  };

  return (
    <div className="relative min-h-screen bg-[#030712] px-6 py-8 flex flex-col space-y-6 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-[#7000ff]/5 blur-[120px] pointer-events-none" />

      {/* Top Header Actions */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-white/10 relative z-10">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-all active:scale-95"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <h2 className="text-xl font-black text-white uppercase tracking-tight">FormSetu Studio</h2>
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Side-by-side Translation Interface</p>
          </div>
        </div>

        {/* Translation Trigger Control */}
        <div className="flex items-end gap-3 w-full md:w-auto">
          <LanguageSelector
            selectedLanguage={selectedLanguage}
            onChange={setSelectedLanguage}
            disabled={loading}
          />
          <button
            onClick={handleTranslateClick}
            disabled={!selectedLanguage || loading || !job?.originalText}
            className="flex items-center justify-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#7000ff] to-[#00f2ff] text-white font-bold text-sm shadow-[0_0_20px_rgba(0,242,255,0.25)] hover:opacity-90 active:scale-95 transition-all disabled:opacity-40 disabled:scale-100 disabled:shadow-none h-[46px]"
          >
            <Play size={14} fill="currentColor" />
            <span>Translate</span>
          </button>
        </div>
      </div>

      {/* Progress Monitor */}
      {job && (job.status === 'ocr' || job.status === 'translating') && (
        <div className="py-2">
          <ProgressIndicator status={job.status} progress={job.progress} />
        </div>
      )}

      {/* Side-by-side Split Pane */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 relative z-10">
        <DocumentViewer file={file} extractedText={job?.originalText || ''} />
        <TranslationViewer
          translatedText={job?.translatedText || ''}
          originalText={job?.originalText || ''}
          loading={loading}
          onDownloadPdf={handleDownloadPdf}
        />
      </div>
    </div>
  );
}
