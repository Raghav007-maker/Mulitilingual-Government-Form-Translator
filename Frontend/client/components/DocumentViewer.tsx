import React from 'react';
import { FileText, Eye } from 'lucide-react';

interface DocumentViewerProps {
  file: File | null;
  extractedText: string;
}

export default function DocumentViewer({ file, extractedText }: DocumentViewerProps) {
  const fileUrl = file ? URL.createObjectURL(file) : null;
  const isImage = file?.type.startsWith('image/');
  const isPdf = file?.type === 'application/pdf';

  return (
    <div className="flex flex-col h-[600px] rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/10 overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/[0.01]">
        <div className="flex items-center space-x-2 text-white">
          <Eye size={18} className="text-[#00f2ff]" />
          <h3 className="font-semibold text-sm uppercase tracking-wider">Original Source File</h3>
        </div>
        {file && (
          <span className="text-xs px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-gray-400 max-w-[200px] truncate">
            {file.name}
          </span>
        )}
      </div>

      <div className="flex-1 p-6 overflow-auto">
        {fileUrl ? (
          isImage ? (
            <div className="flex items-center justify-center min-h-full">
              <img
                src={fileUrl}
                alt="Original Uploaded Image"
                className="max-h-[500px] object-contain rounded-lg border border-white/5 shadow-2xl"
              />
            </div>
          ) : isPdf ? (
            <iframe
              src={fileUrl}
              title="Original PDF Document"
              className="w-full h-full rounded-lg border border-white/5 bg-white/5"
            />
          ) : (
            <div className="h-full flex flex-col">
              <div className="flex items-center space-x-2 text-gray-400 mb-2">
                <FileText size={16} />
                <span className="text-xs">Plain Text Content</span>
              </div>
              <textarea
                readOnly
                value={extractedText}
                className="flex-1 w-full p-4 rounded-xl bg-black/20 border border-white/5 text-gray-300 font-mono text-sm focus:outline-none resize-none"
              />
            </div>
          )
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 space-y-2">
            <FileText size={48} className="opacity-20 text-[#00f2ff]" />
            <p className="text-sm">No document loaded</p>
          </div>
        )}
      </div>
    </div>
  );
}
