import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sparkles, Shield, User, Lock, Mail, Terminal } from "lucide-react";
import { toast } from "sonner";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast.error("Please fill in all fields.");
      return;
    }
    
    // Get existing agents registry
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    
    // Validate for duplicates
    if (registeredUsers.some((u: any) => u.email === email)) {
      toast.error("This secure ID (email) is already registered!");
      return;
    }
    
    // Register new user credentials
    registeredUsers.push({ name, email, password });
    localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
    
    // Automatically initialize logged-in session
    localStorage.setItem('user', JSON.stringify({ name, email }));
    
    toast.success("Registration complete! Welcome to FormSetu!");
    navigate("/");
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center relative px-4 overflow-hidden py-12">
      <div className="mesh-glow" />
      
      <div className="w-full max-w-md glass-panel p-8 rounded-2xl tilt-card relative scan-line z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-[#7000ff]/10 rounded-xl mb-4 border border-[#7000ff]/20">
            <Terminal className="h-8 w-8 text-[#7000ff]" />
          </div>
          <h2 className="text-3xl font-heading text-white">Register FormSetu</h2>
          <p className="text-sm font-body text-muted-foreground mt-2">
            Initialize your profile to translate files securely
          </p>
        </div>

        <form onSubmit={handleSignup} className="space-y-5 font-body">
          <div className="space-y-1.5">
            <label className="text-xs text-[#00f2ff] uppercase tracking-widest font-bold">Agent Identifier (Name)</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Agent Jack"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="pl-10 bg-black/40 border-white/10 text-white focus:border-[#00f2ff] focus:ring-0 focus-visible:ring-0"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-[#00f2ff] uppercase tracking-widest font-bold">Secure Email</label>
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
            <label className="text-xs text-[#00f2ff] uppercase tracking-widest font-bold">Secure Passphrase</label>
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

          <Button type="submit" className="w-full glow-purple mt-6">
            Register Agent Session
          </Button>
        </form>

        <div className="text-center mt-6 font-body text-xs text-muted-foreground">
          Already registered?{" "}
          <Link to="/login" className="text-[#00f2ff] font-bold hover:underline">
            Authenticate Credentials
          </Link>
        </div>
      </div>
    </div>
  );
}
