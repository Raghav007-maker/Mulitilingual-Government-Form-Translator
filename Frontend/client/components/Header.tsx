import { Languages, Shield, User, LogOut } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function Header({ className }: { className?: string }) {
  const [user, setUser] = useState<{ email: string; name?: string } | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const userSession = localStorage.getItem('user');
    if (userSession) {
      try {
        setUser(JSON.parse(userSession));
      } catch (e) {
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, [location]);

  const handleSignOut = () => {
    localStorage.removeItem('user');
    setUser(null);
    toast.success("Successfully signed out of secure session.");
    navigate("/");
  };

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
    const userSession = localStorage.getItem('user');
    if (!userSession) {
      toast.error('Authentication Required. Please log in or sign up first to use FormSetu.');
      navigate('/login');
    } else {
      navigate('/');
      setTimeout(() => {
        window.dispatchEvent(new Event('trigger-translate-flow'));
      }, 100);
    }
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
          {user ? (
            <>
              {/* Authenticated Badges */}
              <div className="flex items-center space-x-2 bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 font-body text-xs text-gray-300">
                <User size={12} className="text-[#00f2ff]" />
                <span className="font-semibold">{user.name || user.email.split('@')[0]}</span>
              </div>
              <Button 
                onClick={handleSignOut}
                variant="ghost" 
                className="text-white hover:text-red-400 hover:bg-white/5 font-body flex items-center space-x-1.5"
              >
                <LogOut size={14} />
                <span>Sign Out</span>
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" className="text-white hover:text-[#00f2ff] hover:bg-white/5 font-body">
                <Link to="/login">Sign In</Link>
              </Button>
              <Button asChild className="glow-primary font-body">
                <Link to="/signup">Get Started</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
