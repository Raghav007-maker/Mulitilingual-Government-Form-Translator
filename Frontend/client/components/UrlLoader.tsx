import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function UrlLoader({ onLoad }: { onLoad: (blob: Blob) => Promise<void> | void }) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchUrl = async () => {
    if (!url) return;
    setLoading(true);
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      await onLoad(blob);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-2">
      <div>
        <label className="text-sm text-muted-foreground">Or load from URL</label>
        <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://example.com/file.pdf or .txt" className="mt-1 bg-black/20 border-border/50" />
      </div>
      <div className="self-end">
        <Button onClick={fetchUrl} disabled={!url || loading}>{loading ? "Loading…" : "Load"}</Button>
      </div>
    </div>
  );
}
