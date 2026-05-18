import { Shield } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Header({ className }: { className?: string }) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleScroll = (id: string) => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleTranslateClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate('/');
    setTimeout(() => {
      window.dispatchEvent(new Event('trigger-translate-flow'));
    }, 100);
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full backdrop-blur-md bg-[#030712]/60 border-b border-white/10 px-4",
        className,
      )}
    >
      <div className="container mx-auto flex h-16 items-center justify-between">
        <Link to="/" className="group inline-flex items-center gap-3">
          <div className="relative h-9 w-9 rounded-xl bg-gradient-to-br from-[#00f2ff] to-[#7000ff] grid place-items-center shadow-[0_0_15px_rgba(0,242,255,0.3)]">
            <Shield className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-heading text-white">
            Form<span className="text-[#00f2ff]">Setu</span>
          </span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-6 font-body text-sm font-medium text-muted-foreground">
          <button 
            onClick={() => handleScroll('features')} 
            className="hover:text-white transition-colors cursor-pointer"
          >
            Features
          </button>
          <button 
            onClick={handleTranslateClick} 
            className="hover:text-white transition-colors cursor-pointer"
          >
            Translate
          </button>
          <button 
            onClick={() => handleScroll('about')} 
            className="hover:text-white transition-colors cursor-pointer"
          >
            About
          </button>
        </nav>

        <div className="flex items-center gap-3">
          <Button onClick={handleTranslateClick} className="glow-primary font-body">
            Start Translating
          </Button>
        </div>
      </div>
    </header>
  );
}
