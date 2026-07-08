import { Zap, Github, ChevronRight, ArrowRight } from 'lucide-react';
import Schematic from './Schematic';
import NetworkStatusBanner from './NetworkStatus';

interface FooterProps {
  showNotification: (message: string, type: 'success' | 'info') => void;
}

export default function Footer({ showNotification }: FooterProps) {
  return (
    <footer className="bg-accent py-20 md:py-32 px-6 md:px-12 text-white overflow-hidden relative">
      <div className="absolute inset-0 opacity-5 pointer-events-none" aria-hidden="true">
        <Schematic />
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-24 relative">
        <div className="md:col-span-2 space-y-10">
          <div
            className="flex items-center gap-4 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label="Scroll to top"
          >
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20 shadow-2xl">
              <Zap className="w-6 h-6" aria-hidden="true" />
            </div>
            <span className="text-2xl font-bold tracking-tighter">AURALIS AI</span>
          </div>

          <h2 className="text-3xl md:text-5xl font-serif leading-tight opacity-90 max-w-sm tracking-tight">
            Designing the <span className="italic text-white/60">intelligence</span> of tomorrow.
          </h2>

          <div className="flex flex-wrap gap-6 text-[10px] uppercase font-black tracking-[0.25em] opacity-80">
            <button
              onClick={() => showNotification('Loading privacy terms...', 'info')}
              className="hover:opacity-100 transition-opacity underline underline-offset-8 cursor-pointer"
              aria-label="View neural privacy terms"
            >
              Neural Privacy
            </button>
            <button
              onClick={() => showNotification('Accessing ethical disclosure...', 'info')}
              className="hover:opacity-100 transition-opacity underline underline-offset-8 cursor-pointer"
              aria-label="View agent ethics"
            >
              Agent Ethics
            </button>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-100 transition-opacity underline underline-offset-8 flex items-center gap-2"
            >
              <Github className="w-3 h-3" aria-hidden="true" />
              Repository
            </a>
          </div>
        </div>

        <div className="space-y-6">
          <h4 className="text-[11px] uppercase font-black tracking-[0.25em] opacity-70">Network Architecture</h4>
          <nav className="flex flex-col gap-4 text-sm font-bold uppercase tracking-widest text-white/80" aria-label="Footer navigation">
            {[
              { href: '#risk', label: 'Risk Indices' },
              { href: '#monitoring', label: 'Telemetry Feed' },
              { href: '#protocol', label: 'Neural API' },
              { href: '#map', label: 'Global Sync' },
            ].map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="hover:text-white transition-colors flex items-center justify-between"
              >
                {link.label} <ChevronRight className="w-3 h-3" aria-hidden="true" />
              </a>
            ))}
          </nav>
        </div>

        <div className="space-y-8 flex flex-col justify-between items-end text-right">
          <div className="space-y-6">
            <h4 className="text-[11px] uppercase font-black tracking-[0.25em] opacity-70">Auralis Updates</h4>
            <form
              onSubmit={(e) => { e.preventDefault(); showNotification('Subscribed to Auralis Feed!', 'success'); (e.target as HTMLFormElement).reset(); }}
              className="relative group"
              aria-label="Subscribe to updates"
            >
              <input
                type="email"
                required
                placeholder="Intelligence Stream"
                className="bg-transparent border-b border-white/30 py-4 w-full md:w-60 outline-none focus:border-white transition-colors text-xs font-black uppercase tracking-widest placeholder:text-white/40"
                aria-label="Email address"
              />
              <button type="submit" className="absolute right-0 bottom-4 hover:translate-x-1 transition-transform cursor-pointer" aria-label="Subscribe">
                <ArrowRight className="w-5 h-5" aria-hidden="true" />
              </button>
            </form>
          </div>

          <div className="text-[11px] font-black uppercase tracking-[0.25em] opacity-70 flex flex-col items-end gap-2 text-right">
            <span>&copy; 2026 AURALIS INTELLIGENCE GROUP</span>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-success rounded-full" aria-hidden="true" />
              <span className="opacity-80">DECENTRALIZED NODE ACTIVE</span>
            </div>
            <div className="w-full border-t border-white/20 my-1.5" aria-hidden="true" />
            <span className="text-[10px] tracking-[0.2em] opacity-80">
              Developed by <span className="text-white font-bold">Balaji Goduguluru</span>
            </span>
          </div>
        </div>
      </div>
      <NetworkStatusBanner />
    </footer>
  );
}
