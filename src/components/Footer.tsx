import { Zap, ChevronRight, ArrowRight, Github, MapPin, Mail, Globe } from 'lucide-react';
import Schematic from './Schematic';

interface FooterProps {
  showNotification: (message: string, type: 'success' | 'info') => void;
}

const navLinks = [
  { href: '#risk', label: 'Risk Indices' },
  { href: '#monitoring', label: 'Telemetry Feed' },
  { href: '#protocol', label: 'Neural API' },
  { href: '#map', label: 'Global Sync' },
];

export default function Footer({ showNotification }: FooterProps) {
  return (
    <footer className="bg-accent py-20 md:py-28 px-6 md:px-12 text-white overflow-hidden relative">
      <div className="absolute inset-0 opacity-5 pointer-events-none" aria-hidden="true">
        <Schematic />
      </div>

      <div className="max-w-7xl mx-auto relative">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-6">
            {/* Left content */}
            <div
              className="flex items-center gap-4 cursor-pointer hover:opacity-80 transition-opacity group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && window.scrollTo({ top: 0, behavior: 'smooth' })}
              aria-label="Scroll to top"
            >
              <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20 shadow-2xl group-hover:bg-white/20 transition-colors">
                <Zap className="w-7 h-7" aria-hidden="true" />
              </div>
              <span className="text-3xl font-bold tracking-tighter text-white/90">AURALIS AI</span>
            </div>

            <h2 className="text-xl md:text-2xl font-serif leading-relaxed text-white/90 max-w-sm">
              Designing the <span className="italic text-white/90">intelligence</span> of tomorrow.
            </h2>

            <div className="flex flex-wrap items-center gap-6 pt-2">
              <button
                onClick={() => showNotification('Loading privacy terms...', 'info')}
                className="text-xs uppercase font-bold tracking-[0.2em] text-white/60 hover:text-white/90 transition-colors underline underline-offset-4 decoration-white/20 hover:decoration-white/60 cursor-pointer"
                aria-label="View neural privacy terms"
              >
                Neural Privacy
              </button>
              <span className="w-1.5 h-1.5 rounded-full bg-white/30" aria-hidden="true" />
              <button
                onClick={() => showNotification('Accessing ethical disclosure...', 'info')}
                className="text-xs uppercase font-bold tracking-[0.2em] text-white/60 hover:text-white/90 transition-colors underline underline-offset-4 decoration-white/20 hover:decoration-white/60 cursor-pointer"
                aria-label="View agent ethics"
              >
                Agent Ethics
              </button>
            </div>
          </div>

          <div className="space-y-6">
            {/* Middle content */}
            <h4 className="text-xs font-bold uppercase tracking-[0.3em] text-white/60">Network</h4>
            <nav className="flex flex-col gap-5" aria-label="Footer navigation">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm font-bold uppercase tracking-widest text-white/60 hover:text-white transition-all flex items-center justify-between group/link"
                >
                  <span>{link.label}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-white/30 group-hover/link:text-white/70 group-hover/link:translate-x-0.5 transition-all" aria-hidden="true" />
                </a>
              ))}
            </nav>
          </div>

          <div className="space-y-6">
            {/* Right content */}
            <h4 className="text-xs font-bold uppercase tracking-[0.3em] text-white/60">Signal Feed</h4>
            <form
              onSubmit={(e) => { e.preventDefault(); showNotification('Subscribed to Auralis Feed!', 'success'); (e.target as HTMLFormElement).reset(); }}
              className="relative group"
              aria-label="Subscribe to updates"
            >
              <input
                type="email"
                required
                placeholder="Enter your intelligence stream"
                className="w-full bg-white/5 border border-white/20 rounded-xl py-4 px-5 pr-14 outline-none focus:border-white/50 focus:bg-white/10 transition-all text-sm font-medium tracking-wider placeholder:text-white/40"
                aria-label="Email address"
              />
              <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-all cursor-pointer" aria-label="Subscribe">
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </form>
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 bg-success rounded-full shadow-[0_0_8px_#52B788] animate-pulse motion-reduce:animate-none" aria-hidden="true" />
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-white/60">Decentralized Node Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom copyright bar: now only the copyright text */}
      <div className="mt-20 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-[0.2em] text-white/40">
          <span>&copy; 2026 Developed by <span className="text-white/70">Balaji Goduguluru</span></span>
        </div>
      </div>
    </footer>
  );
}