import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorPageProps {
  message: string;
  onRetry: () => void;
}

export default function ErrorPage({ message, onRetry }: ErrorPageProps) {
  return (
    <div className="relative min-h-[80vh] flex flex-col items-center justify-center px-6 text-center bg-[#030712] overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-red-500/10 blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-md w-full space-y-6 bg-white/[0.02] border border-red-500/10 p-8 rounded-3xl backdrop-blur-xl">
        <div className="w-16 h-16 mx-auto flex items-center justify-center rounded-2xl bg-red-950/20 border border-red-500/20 text-red-500 animate-bounce">
          <AlertTriangle size={32} />
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-black text-white uppercase tracking-tight">Processing Error</h3>
          <p className="text-sm text-gray-400 leading-relaxed font-medium">
            {message || 'An unexpected server error occurred during document parsing.'}
          </p>
        </div>

        <button
          onClick={onRetry}
          className="w-full flex items-center justify-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 text-white font-bold text-sm shadow-[0_0_20px_rgba(239,68,68,0.2)] hover:opacity-90 active:scale-95 transition-all"
        >
          <RefreshCw size={16} />
          <span>Upload Another File</span>
        </button>
      </div>
    </div>
  );
}
