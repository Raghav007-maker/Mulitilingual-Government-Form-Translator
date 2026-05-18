import React from 'react';
import FileUploader from '../components/FileUploader.js';
import { ArrowLeft, Sparkles } from 'lucide-react';

interface UploadPageProps {
  onBack: () => void;
  onFileSelect: (file: File) => void;
  loading: boolean;
}

export default function UploadPage({ onBack, onFileSelect, loading }: UploadPageProps) {
  return (
    <div className="relative min-h-[85vh] flex flex-col justify-center px-6 py-12 bg-[#030712] overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-[#00f2ff]/10 blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-2xl mx-auto w-full space-y-8">
        <button
          onClick={onBack}
          disabled={loading}
          className="flex items-center space-x-2 text-sm text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Back to Home</span>
        </button>

        <div className="text-center space-y-2">
          <h2 className="text-3xl font-extrabold text-white tracking-tight uppercase">
            Upload Document
          </h2>
          <p className="text-gray-400 font-medium max-w-md mx-auto">
            Choose a scanned image, a multipage PDF, or plain text file to extract form fields and translate.
          </p>
        </div>

        <FileUploader onFileSelect={onFileSelect} loading={loading} />

        {loading && (
          <div className="flex flex-col items-center justify-center space-y-4 pt-6">
            <div className="w-12 h-12 border-4 border-[#00f2ff] border-t-transparent rounded-full animate-spin" />
            <div className="flex items-center space-x-2 text-white font-semibold">
              <Sparkles size={16} className="text-[#00f2ff] animate-pulse" />
              <span>Analyzing Form & Extracting Fields...</span>
            </div>
            <p className="text-xs text-gray-500">
              Depending on document size, this could take up to a minute.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
