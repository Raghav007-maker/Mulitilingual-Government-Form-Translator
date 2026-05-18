import React from 'react';
import { Language } from '../types/index.js';

const LANGUAGES: Language[] = [
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ' },
  { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو' },
];

interface LanguageSelectorProps {
  selectedLanguage: string;
  onChange: (code: string) => void;
  disabled?: boolean;
}

export default function LanguageSelector({ selectedLanguage, onChange, disabled }: LanguageSelectorProps) {
  return (
    <div className="flex flex-col space-y-1.5 w-full max-w-xs">
      <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">
        Translate Target Language
      </label>
      <select
        value={selectedLanguage}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white font-medium focus:border-[#00f2ff] focus:ring-1 focus:ring-[#00f2ff] outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <option value="" disabled className="bg-[#030712] text-gray-500">Select language...</option>
        {LANGUAGES.map((lang) => (
          <option key={lang.code} value={lang.code} className="bg-[#030712] text-white">
            {lang.name} ({lang.nativeName})
          </option>
        ))}
      </select>
    </div>
  );
}
