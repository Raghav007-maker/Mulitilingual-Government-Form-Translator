export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-[#030712]/40 backdrop-blur-md px-4 mt-20">
      <div className="container mx-auto py-8 text-sm font-body text-muted-foreground flex flex-col md:flex-row items-center justify-between gap-4">
        <p>© {new Date().getFullYear()} FormSetu · Secure, Decentralized Multilingual Form Gateway</p>
        <p className="opacity-80 flex items-center gap-2">Built for Digital India 🇮🇳</p>
      </div>
    </footer>
  );
}
