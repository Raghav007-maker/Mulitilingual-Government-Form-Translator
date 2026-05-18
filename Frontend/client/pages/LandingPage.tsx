import React from 'react';
import { Shield, Sparkles, Zap, ArrowRight, Languages, LayoutGrid, FileDown, Lock } from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
}

export default function LandingPage({ onStart }: LandingPageProps) {
  return (
    <div className="relative min-h-[90vh] flex flex-col px-6 py-12 md:py-24 overflow-hidden bg-[#030712]">
      {/* Mesh Gradient Backgrounds */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-[#7000ff]/10 to-[#00f2ff]/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-[#00f2ff]/5 to-[#7000ff]/5 blur-[150px] pointer-events-none" />

      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      {/* HERO SECTION */}
      <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8 flex-1 flex flex-col justify-center min-h-[60vh] pb-12">
        {/* Glow badge */}
        <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-xl mx-auto">
          <Sparkles size={14} className="text-[#00f2ff] animate-pulse" />
          <span className="text-xs font-semibold text-gray-300 uppercase tracking-widest">Next-Gen Multimodal Translation</span>
        </div>

        {/* Hero Heading */}
        <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight leading-none uppercase font-heading select-none">
          Form<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f2ff] to-[#7000ff]">Setu</span>
        </h1>
        
        <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-400 font-sans font-medium">
          Modernize document verification. Instantly extract and translate complex government documents, applications, and regional scans into structured English side-by-side using state-of-the-art AI.
        </p>

        {/* Call to action */}
        <div>
          <button
            onClick={onStart}
            className="group inline-flex items-center space-x-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-[#7000ff] to-[#00f2ff] text-white font-bold text-base shadow-[0_0_40px_rgba(0,242,255,0.25)] hover:shadow-[0_0_50px_rgba(0,242,255,0.4)] active:scale-95 transition-all duration-300"
          >
            <span>Start Translating</span>
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* FEATURES SECTION */}
      <section id="features" className="relative z-10 max-w-5xl mx-auto w-full py-20 border-t border-white/10 space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white uppercase tracking-tight">
            Protocol <span className="text-[#00f2ff]">Features</span>
          </h2>
          <p className="text-sm text-gray-400 max-w-lg mx-auto font-medium">
            FormSetu is optimized from the ground up for government document translation, legal file parsing, and portal operations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: <Zap className="text-[#00f2ff]" size={20} />,
              title: 'Gemini 2.5 Flash OCR',
              desc: 'High-fidelity multimodal recognition parsing structured scanned forms, handwriting, and tables.'
            },
            {
              icon: <Languages className="text-[#7000ff]" size={20} />,
              title: '12+ Indic Languages',
              desc: 'Translate Hindi, Bengali, Tamil, Telugu, Marathi, Malayalam, and more into structured text instantly.'
            },
            {
              icon: <Shield className="text-[#00f2ff]" size={20} />,
              title: 'Zero-Storage Privacy',
              desc: 'Your uploaded document stays in local buffers and is scrubbed immediately on success or failure.'
            },
            {
              icon: <LayoutGrid className="text-[#7000ff]" size={20} />,
              title: 'Side-by-Side Studio',
              desc: 'Examine original regional scans alongside translated English strings in a unified cybernetic layout.'
            },
            {
              icon: <FileDown className="text-[#00f2ff]" size={20} />,
              title: 'Unicode PDF Exports',
              desc: 'Instantly download translations as fully compliant PDFs embedded with fallback Indic characters.'
            },
            {
              icon: <Lock className="text-[#7000ff]" size={20} />,
              title: 'Local Credentials Shield',
              desc: 'Manage agent access securely using browser storage and zero permanent server footprint.'
            }
          ].map((feat, idx) => (
            <div
              key={idx}
              className="group p-6 rounded-2xl bg-white/[0.01] backdrop-blur-xl border border-white/5 hover:border-white/10 transition-all hover:scale-[1.02] text-left space-y-4 hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
            >
              <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/[0.03] border border-white/10 group-hover:border-white/20 transition-all">
                {feat.icon}
              </div>
              <h3 className="text-base font-bold text-white tracking-tight">{feat.title}</h3>
              <p className="text-xs text-gray-400 leading-relaxed font-medium">{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section id="about" className="relative z-10 max-w-5xl mx-auto w-full py-20 border-t border-white/10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6 text-left">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white uppercase tracking-tight">
            About <span className="text-[#7000ff]">FormSetu</span>
          </h2>
          <p className="text-sm text-gray-400 leading-relaxed font-medium">
            In Sanskrit, **Setu** (सेतु) translates directly to **"Bridge"**. 
          </p>
          <p className="text-sm text-gray-400 leading-relaxed font-medium">
            FormSetu is a high-performance web interface built to bridge the gap between regional diversity and centralized official documentation. By combining state-of-the-art vision LLMs with local encryption protocols, FormSetu lets citizens, administrators, and legal verification desks instantly extract details from Indic scans without sacrificing formatting layout or privacy boundaries.
          </p>
          <div className="flex gap-4 pt-2">
            <button
              onClick={onStart}
              className="inline-flex items-center space-x-2 text-xs font-bold text-[#00f2ff] hover:underline"
            >
              <span>Initialize Gateway Session</span>
              <ArrowRight size={12} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {[
            { metric: '2.5s', label: 'Processing Latency' },
            { metric: '100%', label: 'Stateless Buffer scrubbing' },
            { metric: '12+', label: 'Indic Dialects' },
            { metric: '0%', label: 'Permanent Log Footprint' }
          ].map((stat, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-white/[0.01] border border-white/5 text-center space-y-2 hover:border-white/10 transition-colors"
            >
              <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#00f2ff] to-[#7000ff] select-none">
                {stat.metric}
              </div>
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
