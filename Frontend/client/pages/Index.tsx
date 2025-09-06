import FormTranslator from "@/components/FormTranslator";
import { Sparkles } from "lucide-react";

export default function Index() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(1200px_600px_at_0%_-10%,hsl(var(--heroFrom)),transparent),radial-gradient(1000px_500px_at_100%_10%,hsl(var(--heroTo)),transparent)]" />

      <main className="container mx-auto pt-10 md:pt-16">
        <section className="relative rounded-2xl border border-border/50 bg-black/30 p-6 md:p-10 overflow-hidden">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.03)_30%,transparent_60%)]" />
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight bg-clip-text text-transparent bg-[conic-gradient(from_180deg_at_50%_50%,hsl(var(--foreground)),hsl(var(--primary)),hsl(var(--foreground)))]">
              Multilingual PDF/Text Translator
            </h1>
            <p className="mt-4 text-base md:text-lg text-muted-foreground">
              Upload a PDF or paste text in any language and convert it into Indian regional languages with a beautiful, inclusive UI.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a href="#doc-translator" className="inline-flex items-center gap-2 rounded-md px-5 py-2.5 text-sm font-medium bg-gradient-to-r from-primary to-heroFrom text-primary-foreground shadow-[0_0_0_1px_hsl(var(--ring)/0.5)] hover:opacity-90">
                <Sparkles className="h-4 w-4" /> Start Translating
              </a>
              <a href="#features" className="inline-flex items-center gap-2 rounded-md px-5 py-2.5 text-sm font-medium border border-border/60 bg-black/20 hover:bg-black/30">
                Learn more
              </a>
            </div>
          </div>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
            <Feature title="12+ Indian Languages" desc="Hindi, Bengali, Tamil, Telugu, Marathi, Gujarati, Kannada, Malayalam, Punjabi, Odia, Assamese, Urdu." />
            <Feature title="Field-wise Guidance" desc="Simplified hints for each field so anyone can fill forms confidently." />
            <Feature title="Privacy-first" desc="All processing happens in your browser. Your data stays with you." />
          </div>
        </section>

        <div className="mt-12">
          <FormTranslator />
        </div>

        <div className="mt-12">
          {/* New: PDF/Text translator */}
          <LazyDocumentTranslator />
        </div>

        <section id="features" className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Stat kpi="12+" label="Languages" />
          <Stat kpi="PDF" label="Upload & translate" />
          <Stat kpi="0" label="Server data stored" />
        </section>
      </main>
    </div>
  );
}

import { lazy, Suspense } from "react";
const DocumentTranslator = lazy(() => import("@/components/DocumentTranslator"));
function LazyDocumentTranslator() {
  return (
    <Suspense fallback={<div className="text-center text-sm text-muted-foreground">Loading translator…</div>}>
      <DocumentTranslator />
    </Suspense>
  );
}

function Feature({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-xl border border-border/50 bg-black/20 p-4">
      <h3 className="font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{desc}</p>
    </div>
  );
}

function Stat({ kpi, label }: { kpi: string; label: string }) {
  return (
    <div className="rounded-xl border border-border/50 bg-black/20 p-6 text-center">
      <div className="text-4xl font-extrabold bg-clip-text text-transparent bg-[linear-gradient(90deg,hsl(var(--primary)),hsl(var(--foreground)))]">
        {kpi}
      </div>
      <div className="mt-1 text-sm text-muted-foreground">{label}</div>
    </div>
  );
}
