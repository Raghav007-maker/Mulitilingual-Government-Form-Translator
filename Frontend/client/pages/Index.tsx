import React, { useState } from 'react';
import LandingPage from './LandingPage.js';
import UploadPage from './UploadPage.js';
import TranslationPage from './TranslationPage.js';
import ErrorPage from './ErrorPage.js';
import { useTranslation } from '../hooks/useTranslation.js';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export default function Index() {
  const [step, setStep] = useState<'landing' | 'upload' | 'studio' | 'error'>('landing');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { job, loading, error, startTranslationFlow, triggerTranslation, reset } = useTranslation();
  const navigate = useNavigate();

  React.useEffect(() => {
    const handleTriggerFlow = () => {
      setStep('upload');
    };

    window.addEventListener('trigger-translate-flow', handleTriggerFlow);
    return () => window.removeEventListener('trigger-translate-flow', handleTriggerFlow);
  }, []);

  const handleStart = () => {
    setStep('upload');
  };

  const handleFileSelect = async (file: File) => {
    setSelectedFile(file);
    try {
      await startTranslationFlow(file);
      setStep('studio');
    } catch (err) {
      setStep('error');
    }
  };

  const handleTranslate = async (text: string, targetLang: string) => {
    try {
      await triggerTranslation(text, targetLang, job?.id);
    } catch (err) {
      // Stay on studio page, show warning, errors are handled gracefully
    }
  };

  const handleBackToHome = () => {
    reset();
    setSelectedFile(null);
    setStep('landing');
  };

  const handleRetry = () => {
    reset();
    setSelectedFile(null);
    setStep('upload');
  };

  return (
    <div className="min-h-screen bg-[#030712] text-white">
      {step === 'landing' && <LandingPage onStart={handleStart} />}
      
      {step === 'upload' && (
        <UploadPage
          onBack={handleBackToHome}
          onFileSelect={handleFileSelect}
          loading={loading}
        />
      )}

      {step === 'studio' && (
        <TranslationPage
          file={selectedFile}
          job={job}
          loading={loading}
          onBack={handleBackToHome}
          onTranslate={handleTranslate}
        />
      )}

      {step === 'error' && (
        <ErrorPage
          message={error || 'An unexpected error occurred.'}
          onRetry={handleRetry}
        />
      )}
    </div>
  );
}
