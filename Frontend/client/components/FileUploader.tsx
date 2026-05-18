import React, { useState, useRef } from 'react';
import { Upload, AlertCircle } from 'lucide-react';

interface FileUploaderProps {
  onFileSelect: (file: File) => void;
  loading: boolean;
}

export default function FileUploader({ onFileSelect, loading }: FileUploaderProps) {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateAndSelect = (file: File) => {
    setError(null);
    const allowedExtensions = ['.pdf', '.png', '.jpg', '.jpeg', '.txt'];
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    
    if (!allowedExtensions.includes(ext)) {
      setError('Invalid file format. Please upload PDF, PNG, JPG, JPEG, or TXT.');
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      setError('File is too large. Maximum permitted file size is 20MB.');
      return;
    }

    onFileSelect(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSelect(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      validateAndSelect(e.target.files[0]);
    }
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
          dragActive
            ? 'border-[#00f2ff] bg-[rgba(0,242,255,0.05)] scale-[1.01]'
            : 'border-white/10 bg-white/[0.03] hover:border-white/20'
        } backdrop-blur-xl`}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleChange}
          accept=".pdf,.png,.jpg,.jpeg,.txt"
          disabled={loading}
        />

        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="p-4 rounded-full bg-gradient-to-tr from-[#7000ff]/20 to-[#00f2ff]/20 border border-white/10 text-[#00f2ff] animate-pulse">
            <Upload size={32} />
          </div>
          <div>
            <p className="text-lg font-medium text-white">Drag & drop your document here</p>
            <p className="text-sm text-gray-400 mt-1">or click to browse from files</p>
          </div>
          <button
            type="button"
            onClick={onButtonClick}
            disabled={loading}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#7000ff] to-[#00f2ff] text-white font-semibold text-sm shadow-[0_0_20px_rgba(0,242,255,0.3)] hover:opacity-90 active:scale-95 transition-all disabled:opacity-50"
          >
            Choose File
          </button>
          <div className="text-xs text-gray-500 mt-2 space-y-1">
            <p>Supported: PDF, PNG, JPG, JPEG, TXT</p>
            <p>Maximum size: 20MB</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="flex items-center space-x-2 text-red-400 text-sm mt-4 p-3 rounded-xl bg-red-950/20 border border-red-500/20 max-w-md mx-auto">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
