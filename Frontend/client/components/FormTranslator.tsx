import { useMemo, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Check, Copy, RefreshCcw, Loader2 } from "lucide-react";
import { FIELD_ORDER, EN_LABELS, LANGUAGES, LanguageCode, translateLabel, explainField, FieldKey } from "@/lib/translator";
import { cn } from "@/lib/utils";
import { API_ENDPOINTS } from "@/lib/config";

type Values = Partial<Record<FieldKey, string>>;

export default function FormTranslator() {
  const [target, setTarget] = useState<LanguageCode>("hi");
  const [showHelp, setShowHelp] = useState(true);
  const [copied, setCopied] = useState(false);
  const [values, setValues] = useState<Values>({});
  const [translatedValues, setTranslatedValues] = useState<Values>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const translateValues = useCallback(async () => {
    const valuesToTranslate = Object.entries(values).filter(([_, value]) => value && value.trim());
    
    console.log("Values to translate:", valuesToTranslate);
    console.log("Current values:", values);
    
    if (valuesToTranslate.length === 0) {
      setError("Please fill in some fields to translate");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const translated: Values = {};
      
      for (const [key, value] of valuesToTranslate) {
        if (!value || !value.trim()) continue;
        
        console.log(`Translating ${key}:`, value, "to language:", target);
        
        const response = await fetch(API_ENDPOINTS.TRANSLATE, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            q: value, 
            target, 
            source: "auto", 
            format: "text" 
          }),
        });

        console.log(`Response for ${key}:`, response.status);

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`Translation failed for ${key}:`, errorText);
          throw new Error(`Translation failed for ${key}: ${errorText}`);
        }

        const data = await response.json();
        console.log(`Translation result for ${key}:`, data);
        translated[key as FieldKey] = data.translatedText || value;
      }

      setTranslatedValues(translated);
      console.log("Translation completed:", translated);
    } catch (e: any) {
      console.error("Translation error:", e);
      setError(`Translation failed: ${e?.message || "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  }, [values, target]);

  const translated = useMemo(() => {
    return FIELD_ORDER.map((key) => ({
      key,
      en: EN_LABELS[key],
      tr: translateLabel(key, target),
      help: showHelp ? explainField(key, target) : undefined,
      value: values[key] ?? "",
      translatedValue: translatedValues[key] ?? "",
    }));
  }, [target, values, showHelp, translatedValues]);

  const copyPreview = async () => {
    const lines = translated
      .map((f) => {
        let line = `${f.tr}: ${f.value}`;
        if (f.translatedValue) {
          line += `\n  (Translated: ${f.translatedValue})`;
        }
        if (f.help) {
          line += `\n  (${f.help})`;
        }
        return line;
      })
      .join("\n");
    await navigator.clipboard.writeText(lines);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const reset = () => {
    setValues({});
    setTranslatedValues({});
    setError(null);
  };

  return (
    <section id="translator" className="container mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-b from-black/30 to-black/10 border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="text-base sm:text-lg">Enter Form Details (English)</span>
              <div className="flex items-center gap-3">
                <Button 
                  variant="default" 
                  size="sm" 
                  onClick={translateValues}
                  disabled={loading || Object.values(values).every(v => !v || !v.trim())}
                >
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  {loading ? "Translating..." : "Translate Values"}
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setShowHelp((v) => !v)}>
                  {showHelp ? "Hide help" : "Show help"}
                </Button>
                <Button variant="secondary" size="sm" onClick={reset}>
                  <RefreshCcw className="mr-2 h-4 w-4" /> Reset
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-muted-foreground">Target Language</label>
                <Select value={target} onValueChange={(v) => setTarget(v as LanguageCode)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LANGUAGES.map((l) => (
                      <SelectItem key={l.code} value={l.code}>
                        {l.name} · {l.native}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Form Purpose (optional)</label>
                <Input placeholder="e.g., Ration card application, Income certificate" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field id="fullName" label={EN_LABELS.fullName} value={values.fullName} onChange={(v) => setValues((s) => ({ ...s, fullName: v }))} />
              <Field id="dob" label={EN_LABELS.dob} type="date" value={values.dob} onChange={(v) => setValues((s) => ({ ...s, dob: v }))} />
              <Field id="gender" label={EN_LABELS.gender} value={values.gender} placeholder="Male / Female / Other" onChange={(v) => setValues((s) => ({ ...s, gender: v }))} />
              <Field id="maritalStatus" label={EN_LABELS.maritalStatus} value={values.maritalStatus} placeholder="Single / Married / Other" onChange={(v) => setValues((s) => ({ ...s, maritalStatus: v }))} />
              <Field id="phone" label={EN_LABELS.phone} type="tel" value={values.phone} onChange={(v) => setValues((s) => ({ ...s, phone: v }))} />
              <Field id="email" label={EN_LABELS.email} type="email" value={values.email} onChange={(v) => setValues((s) => ({ ...s, email: v }))} />
              <Field id="aadhaar" label={EN_LABELS.aadhaar} value={values.aadhaar} onChange={(v) => setValues((s) => ({ ...s, aadhaar: v }))} />
              <Field id="pan" label={EN_LABELS.pan} value={values.pan} onChange={(v) => setValues((s) => ({ ...s, pan: v }))} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field id="address1" label={EN_LABELS.address1} value={values.address1} onChange={(v) => setValues((s) => ({ ...s, address1: v }))} />
              <Field id="address2" label={EN_LABELS.address2} value={values.address2} onChange={(v) => setValues((s) => ({ ...s, address2: v }))} />
              <Field id="district" label={EN_LABELS.district} value={values.district} onChange={(v) => setValues((s) => ({ ...s, district: v }))} />
              <Field id="state" label={EN_LABELS.state} value={values.state} onChange={(v) => setValues((s) => ({ ...s, state: v }))} />
              <Field id="pincode" label={EN_LABELS.pincode} value={values.pincode} onChange={(v) => setValues((s) => ({ ...s, pincode: v }))} />
              <FieldArea id="declaration" label={EN_LABELS.declaration} placeholder="I hereby declare that the information provided above is true and correct to the best of my knowledge." value={values.declaration} onChange={(v) => setValues((s) => ({ ...s, declaration: v }))} />
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-border/50">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(1200px_500px_at_80%_-20%,hsl(var(--ring)/0.15),transparent)]" />
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="text-base sm:text-lg">Translated Preview</span>
              <div className="flex items-center gap-3">
                {loading && (
                  <span className="text-sm text-muted-foreground">
                    <Loader2 className="inline h-4 w-4 animate-spin mr-2" />
                    Translating...
                  </span>
                )}
                <Button size="sm" onClick={copyPreview} className="gap-2" disabled={loading}>
                  {copied ? (
                    <>
                      <Check className="h-4 w-4" /> Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" /> Copy
                    </>
                  )}
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid grid-cols-1 gap-4">
              {translated.map((f) => (
                <div key={f.key} className="rounded-lg border border-border/50 bg-black/20 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">{f.en}</p>
                      <h4 className="text-base sm:text-lg font-semibold tracking-tight mt-0.5">{f.tr}</h4>
                    </div>
                    {f.value ? (
                      <span className="rounded-md bg-primary/10 text-primary px-2.5 py-1 text-xs border border-primary/20">value present</span>
                    ) : (
                      <span className="rounded-md bg-muted/20 text-muted-foreground px-2.5 py-1 text-xs border border-border/50">empty</span>
                    )}
                  </div>
                  {f.help && (
                    <p className="mt-2 text-sm text-muted-foreground/90 leading-relaxed">{f.help}</p>
                  )}
                  {f.value && (
                    <div className="mt-2 text-sm">
                      <div className="flex items-start gap-2">
                        <span className="text-muted-foreground mr-2">→</span>
                        <div>
                          <div className="font-medium">{f.value}</div>
                          {f.translatedValue && (
                            <div className="text-primary font-medium mt-1">
                              Translated: {f.translatedValue}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            {error && (
              <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
                {error}
              </div>
            )}
            {process.env.NODE_ENV === 'development' && (
              <div className="rounded-lg border border-muted/30 bg-muted/10 p-3 text-xs text-muted-foreground">
                <div>Debug: Values count: {Object.keys(values).length}</div>
                <div>Values: {JSON.stringify(values, null, 2)}</div>
                <div>Translated: {JSON.stringify(translatedValues, null, 2)}</div>
              </div>
            )}
            <div className="rounded-lg border border-primary/30 bg-gradient-to-r from-primary/10 to-heroFrom/10 p-3 text-xs text-muted-foreground">
              Note: Click "Translate Values" to translate your entered values. Field labels and guidance are automatically translated for inclusive assistance.
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

function Field({ id, label, value, onChange, type = "text", placeholder }: { id: string; label: string; value?: string; onChange: (v: string) => void; type?: string; placeholder?: string }) {
  return (
    <div>
      <label htmlFor={id} className="text-sm text-muted-foreground">
        {label}
      </label>
      <Input
        id={id}
        type={type}
        value={value ?? ""}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 bg-black/20 border-border/50"
      />
    </div>
  );
}

function FieldArea({ id, label, value, onChange, placeholder }: { id: string; label: string; value?: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div className="sm:col-span-2">
      <label htmlFor={id} className="text-sm text-muted-foreground">
        {label}
      </label>
      <Textarea
        id={id}
        value={value ?? ""}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 bg-black/20 border-border/50 min-h-24"
      />
    </div>
  );
}
