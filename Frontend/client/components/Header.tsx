import { Languages } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Header({ className }: { className?: string }) {
  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border/40",
        className,
      )}
    >
      <div className="container mx-auto flex h-16 items-center justify-between">
        <Link to="/" className="group inline-flex items-center gap-3">
          <div className="relative h-9 w-9 rounded-md bg-gradient-to-br from-heroFrom to-heroTo shadow-[0_0_0_1px_hsl(var(--ring)/0.5)] grid place-items-center">
            <Languages className="h-5 w-5 text-primary drop-shadow-[0_0_12px_hsl(var(--ring)/0.6)]" />
          </div>
          <span className="text-lg font-bold tracking-tight bg-clip-text text-transparent bg-[linear-gradient(90deg,hsl(var(--primary)),hsl(var(--foreground)))]">
            IndiGov Translate
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" className="hidden sm:inline-flex">
            <a href="#features">Features</a>
          </Button>
          <Button asChild variant="ghost" className="hidden sm:inline-flex">
            <a href="#translator">Translator</a>
          </Button>
          <Button asChild className="bg-gradient-to-r from-primary to-heroFrom hover:from-primary/90 hover:to-heroFrom/90">
            <a href="#translator">Start</a>
          </Button>
        </div>
      </div>
    </header>
  );
}
