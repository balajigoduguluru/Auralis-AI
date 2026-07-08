import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Zap, Github, ShieldCheck, ArrowRight, Menu, X } from 'lucide-react';

interface NavbarProps {
  isLoggedIn: boolean;
  onLogin: () => void;
  onLogout: () => void;
}

export default function Navbar({ isLoggedIn, onLogin, onLogout }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { href: '#risk', label: 'Neural Risk' },
    { href: '#map', label: 'Geospatial' },
    { href: '#satellite', label: 'Satellite' },
    { href: '#monitoring', label: 'Telemetry' },
    { href: '#protocol', label: 'Core API' },
  ];

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    if (href.startsWith('#')) {
      const el = document.querySelector(href);
      el?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-bg/80 backdrop-blur-lg border-b border-border/20" role="navigation" aria-label="Main navigation">
      <div className="max-w-7xl mx-auto px-6 md:px-12 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center text-white hover:rotate-12 transition-transform cursor-pointer"
            aria-label="Scroll to top"
          >
            <Zap className="w-6 h-6" />
          </button>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="text-xl font-bold tracking-tighter text-accent cursor-pointer"
          >
            AURALIS <span className="text-text-muted font-medium italic">AI</span>
          </button>
        </div>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-12 text-[10px] font-black text-text-muted/80 tracking-[0.2em] uppercase">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => { e.preventDefault(); handleNavClick(link.href); }}
              className="hover:text-accent transition-colors"
            >
              {link.label}
            </a>
          ))}
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-accent transition-colors"
          >
            <Github className="w-4 h-4" aria-hidden="true" />
            Source
          </a>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={isLoggedIn ? onLogout : onLogin}
            className="hidden md:flex items-center gap-2 group text-[10px] font-black uppercase tracking-widest text-accent border border-accent/20 px-4 py-2 rounded-lg hover:bg-accent hover:text-white transition-all cursor-pointer"
            aria-label={isLoggedIn ? 'Logout' : 'Authenticate'}
          >
            <span>{isLoggedIn ? 'Agent-Alpha7' : 'Auth Auralis'}</span>
            {isLoggedIn ? <ShieldCheck className="w-3 h-3" aria-hidden="true" /> : <ArrowRight className="w-3 h-3" aria-hidden="true" />}
          </button>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 text-accent hover:bg-accent/5 rounded-lg transition-colors cursor-pointer"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile nav dropdown */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden bg-bg border-b border-border/20 overflow-hidden"
          >
            <div className="px-6 py-6 flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => { e.preventDefault(); handleNavClick(link.href); }}
                  className="text-sm font-black uppercase tracking-[0.2em] text-text-muted/80 hover:text-accent transition-colors py-2"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.2em] text-text-muted/80 hover:text-accent transition-colors py-2"
              >
                <Github className="w-4 h-4" aria-hidden="true" />
                Source
              </a>
              <hr className="border-border/20 my-2" />
              <button
                onClick={() => { setMobileOpen(false); isLoggedIn ? onLogout() : onLogin(); }}
                className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-accent py-2 cursor-pointer"
              >
                <span>{isLoggedIn ? 'Logout' : 'Auth Auralis'}</span>
                {isLoggedIn ? <ShieldCheck className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
