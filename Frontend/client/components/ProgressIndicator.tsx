import React from 'react';

interface ProgressIndicatorProps {
  status: 'queued' | 'ocr' | 'translating' | 'done' | 'error';
  progress: number;
}

export default function ProgressIndicator({ status, progress }: ProgressIndicatorProps) {
  const getStatusLabel = () => {
    switch (status) {
      case 'queued':
        return 'Queueing document...';
      case 'ocr':
        return 'Running Gemini 2.5 Flash OCR...';
      case 'translating':
        return 'Translating text chunks...';
      case 'done':
        return 'Process complete!';
      case 'error':
        return 'Error processing document';
      default:
        return 'Processing...';
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-2">
      <div className="flex justify-between items-center text-xs font-semibold uppercase tracking-wider text-gray-400">
        <span>{getStatusLabel()}</span>
        <span className="text-[#00f2ff]">{progress}%</span>
      </div>
      <div className="w-full h-2 rounded-full bg-white/5 border border-white/10 overflow-hidden">
        <div
          style={{ width: `${progress}%` }}
          className="h-full bg-gradient-to-r from-[#7000ff] to-[#00f2ff] rounded-full transition-all duration-500 ease-out"
        />
      </div>
    </div>
  );
}
