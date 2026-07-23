import { lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Activity, FileCode, Search } from 'lucide-react';
import type { AppData } from '../types';
import type { FormEvent } from 'react';

const ClimateNewsFeed = lazy(() => import('../components/ClimateNewsFeed'));
const LiveImages = lazy(() => import('../components/LiveImages'));

interface HeroSectionProps {
  city: string;
  onCityChange: (city: string) => void;
  data: AppData;
  isAnalyzing: boolean;
  onSearch: (e: FormEvent) => void;
}

export default function HeroSection({ city, onCityChange, data, isAnalyzing, onSearch }: HeroSectionProps) {
  return (
    <section className="pt-40 pb-24 px-6 md:px-12 relative" id="monitoring">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} className="space-y-8 relative">
          <motion.div
            animate={{ top: ['0%', '100%'] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
            className="absolute left-[-2rem] w-[1px] h-full bg-gradient-to-b from-transparent via-accent/30 to-transparent opacity-40 pointer-events-none motion-reduce:animate-none"
            aria-hidden="true"
          />
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/5 rounded-full border border-accent/10 text-[10px] font-black text-accent tracking-[0.25em] uppercase">
            <Activity className="w-4 h-4 animate-pulse motion-reduce:animate-none" aria-hidden="true" />
            Auralis Engine v2.0 Online
          </div>
          <h1 className="text-6xl md:text-9xl font-serif leading-[0.9] tracking-tighter text-accent">
            Intelligence <br /> <span className="text-text-muted/50 italic">Unbound.</span>
          </h1>
          <p className="text-xl md:text-2xl font-medium text-text-muted leading-relaxed max-w-xl">
            Advanced climate diagnostics and environmental risk modeling. Powered by the Auralis Agentic Framework.
          </p>

          <form onSubmit={onSearch} className="pt-8 max-w-md relative group" role="search" aria-label="Location search">
            <input
              type="text"
              placeholder="Scan localized coordinates..."
              value={city}
              onChange={(e) => onCityChange(e.target.value)}
              className="input-earth shadow-2xl shadow-accent/5 focus:ring-accent/20"
              aria-label="City or coordinates"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-12 h-12 bg-accent text-white rounded-lg flex items-center justify-center hover:bg-accent-light transition-colors shadow-lg active:scale-95 disabled:opacity-50 cursor-pointer"
              disabled={isAnalyzing}
              aria-label={isAnalyzing ? 'Analyzing...' : 'Search'}
            >
              {isAnalyzing ? <Activity className="w-5 h-5 animate-spin motion-reduce:animate-none" /> : <Search className="w-5 h-5" />}
            </button>
          </form>

          <div className="flex items-center gap-8 pt-4 text-[10px] font-black text-text-muted/60 uppercase tracking-widest">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse motion-reduce:animate-none" aria-hidden="true" />
              Neural Connection: Stable
            </div>
            <div className="flex items-center gap-2">
              <FileCode className="w-4 h-4" aria-hidden="true" />
              API: REST/WebSocket Ready
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative hidden lg:flex flex-col gap-6"
        >
          <div className="aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-[0_50px_100px_rgba(27,67,50,0.15)] relative group border border-border/20 bg-surface/50">
            <Suspense fallback={<div className="w-full h-48 rounded-2xl bg-surface/50 animate-pulse" />}>
              <ClimateNewsFeed />
            </Suspense>
            {data.locationName && (
              <div className="absolute bottom-0 left-0 right-0 z-10">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={data.locationName}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="h-48 rounded-b-[2.5rem] overflow-hidden"
                  >
                    <Suspense fallback={<div className="w-full h-48 bg-surface/50 animate-pulse" />}>
                      <LiveImages locationName={data.locationName} />
                    </Suspense>
                  </motion.div>
                </AnimatePresence>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
