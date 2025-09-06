export default function Footer() {
  return (
    <footer className="border-t border-border/40 mt-16">
      <div className="container mx-auto py-8 text-sm text-muted-foreground flex flex-col md:flex-row items-center justify-between gap-4">
        <p>© {new Date().getFullYear()} IndiGov Translate · Inclusive public services</p>
        <p className="opacity-80">Made for multilingual India 🇮🇳</p>
      </div>
    </footer>
  );
}
