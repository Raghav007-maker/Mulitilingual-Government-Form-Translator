import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sparkles, Shield, User, Lock, Mail } from "lucide-react";
import { toast } from "sonner";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields.");
      return;
    }
    
    // Fetch registered agents registry
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    
    // Find matching user profile
    const matchingUser = registeredUsers.find((u: any) => u.email === email);
    
    if (!matchingUser) {
      toast.error("No registered agent found with this secure ID (email).");
      return;
    }
    
    if (matchingUser.password !== password) {
      toast.error("Incorrect passphrase. Authentication failed.");
      return;
    }
    
    // Initialize logged-in session state
    localStorage.setItem('user', JSON.stringify({ name: matchingUser.name, email: matchingUser.email }));
    
    toast.success("Welcome back to FormSetu!");
    navigate("/");
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center relative px-4 overflow-hidden py-12">
      <div className="mesh-glow" />
      
      <div className="w-full max-w-md glass-panel p-8 rounded-2xl tilt-card relative scan-line z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-[#00f2ff]/10 rounded-xl mb-4 border border-[#00f2ff]/20">
            <Shield className="h-8 w-8 text-[#00f2ff]" />
          </div>
          <h2 className="text-3xl font-heading text-white">Access FormSetu</h2>
          <p className="text-sm font-body text-muted-foreground mt-2">
            Secure, encrypted access to dynamic form translations
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5 font-body">
          <div className="space-y-1.5">
            <label className="text-xs text-[#00f2ff] uppercase tracking-widest font-bold">Secure ID (Email)</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="email"
                placeholder="agent@formsetu.gov"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 bg-black/40 border-white/10 text-white focus:border-[#00f2ff] focus:ring-0 focus-visible:ring-0"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs text-[#00f2ff] uppercase tracking-widest font-bold">Passphrase</label>
              <Link to="#" className="text-xs text-muted-foreground hover:text-[#00f2ff]">Forgot passphrase?</Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 bg-black/40 border-white/10 text-white focus:border-[#00f2ff] focus:ring-0 focus-visible:ring-0"
              />
            </div>
          </div>

          <Button type="submit" className="w-full glow-primary mt-6">
            Authenticate Session
          </Button>
        </form>

        <div className="text-center mt-6 font-body text-xs text-muted-foreground">
          New interface agent?{" "}
          <Link to="/signup" className="text-[#00f2ff] font-bold hover:underline">
            Register Credentials
          </Link>
        </div>
      </div>
    </div>
  );
}
