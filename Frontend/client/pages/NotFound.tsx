import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(1000px_400px_at_20%_0%,hsl(var(--heroFrom)),transparent),radial-gradient(900px_400px_at_80%_100%,hsl(var(--heroTo)),transparent)]" />
      <div className="text-center rounded-xl border border-border/50 bg-black/30 px-8 py-10">
        <h1 className="text-5xl font-extrabold mb-3">404</h1>
        <p className="text-lg text-muted-foreground mb-6">Oops! Page not found</p>
        <a href="/" className="inline-flex rounded-md px-5 py-2.5 text-sm font-medium bg-gradient-to-r from-primary to-heroFrom text-primary-foreground shadow-[0_0_0_1px_hsl(var(--ring)/0.5)] hover:opacity-90">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
