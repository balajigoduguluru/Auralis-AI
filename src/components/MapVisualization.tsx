import { motion } from 'motion/react';
import { Activity, Globe, Plus, Minus, Share2, Search } from 'lucide-react';
import { useState } from 'react';

interface MapProps {
  center: [number, number];
  locationName: string;
  risk?: string;
  zoom: number;
  onZoomChange: (z: number) => void;
  onLocationSelect?: (lat: number, lon: number) => void;
  onSearch?: (query: string) => void;
  onShare?: () => void;
}

export default function MapVisualization({ center, locationName, risk, zoom, onZoomChange, onLocationSelect, onSearch, onShare }: MapProps) {
  const [lat, lon] = center;
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8 }}
      className="w-full h-full rounded-[2.5rem] overflow-hidden border border-border/50 shadow-2xl relative z-10 bg-[#0a0a0a] group"
    >
      {/* Primary Google Maps Interface */}
      <div className="absolute inset-0 z-0">
        <iframe
          width="100%"
          height="100%"
          style={{ border: 0, filter: 'grayscale(0.6) contrast(1.1) brightness(0.9)' }}
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          src={`https://www.google.com/maps?q=${lat},${lon}&z=${zoom}&output=embed&t=k`}
        />
      </div>

      {/* Map Search Bar */}
      <div className="absolute top-8 left-8 z-30 w-full max-w-xs pointer-events-auto">
        <div className="relative group/search">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60 group-focus-within/search:text-accent transition-colors" />
          <input 
            type="text"
            placeholder="Search city or coords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && searchQuery) {
                if (onSearch) {
                  onSearch(searchQuery);
                } else if (onLocationSelect) {
                  onLocationSelect(lat, lon);
                }
              }
            }}
            className="w-full bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-[10px] font-black uppercase tracking-widest text-white outline-none focus:ring-1 focus:ring-accent/40 transition-all"
          />
        </div>
      </div>

      {/* Zoom and Share Controls */}
      <div className="absolute top-8 right-8 z-30 flex flex-col gap-3 pointer-events-auto">
        <button 
          onClick={() => onZoomChange(Math.min(zoom + 1, 21))}
          className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 flex items-center justify-center text-white hover:bg-accent transition-all shadow-2xl"
        >
          <Plus className="w-4 h-4" />
        </button>
        <button 
          onClick={() => onZoomChange(Math.max(zoom - 1, 1))}
          className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 flex items-center justify-center text-white hover:bg-accent transition-all shadow-2xl"
        >
          <Minus className="w-4 h-4" />
        </button>
        <button 
          onClick={onShare}
          className="w-10 h-10 bg-accent text-white rounded-xl border border-white/20 flex items-center justify-center hover:scale-110 transition-all shadow-2xl"
        >
          <Share2 className="w-4 h-4" />
        </button>
      </div>

      {/* Interactive Telemetry Overlays */}
      <div className="absolute inset-x-0 bottom-0 p-8 z-20 pointer-events-none flex flex-col md:flex-row justify-between items-end gap-6 bg-gradient-to-t from-bg via-transparent to-transparent">
        <div className="bg-black/60 backdrop-blur-2xl p-6 rounded-[2rem] border border-white/10 shadow-2xl space-y-4 max-w-sm pointer-events-auto">
          <div className="flex items-center gap-4">
            <div className={`w-3 h-3 rounded-full animate-pulse ${
              risk === 'HIGH' ? 'bg-error shadow-[0_0_15px_rgba(217,4,41,0.5)]' : risk === 'MODERATE' ? 'bg-warning' : 'bg-success'
            }`} />
            <div>
              <div className="text-[10px] font-black text-white/90 uppercase tracking-[0.2em]">{locationName}</div>
              <div className="text-[8px] text-white/60 font-bold uppercase tracking-widest">Orbital Intercept: Locked</div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-4">
             <div className="space-y-1">
                <span className="text-[8px] font-black text-white/50 uppercase tracking-widest block">Geospatial Key</span>
                <span className="text-[10px] font-mono text-accent">GS-{lat.toFixed(2).replace('.', '')}</span>
             </div>
             <div className="space-y-1">
                <span className="text-[8px] font-black text-white/50 uppercase tracking-widest block">Neural Risk</span>
                <span className={`text-[10px] font-black ${
                  risk === 'HIGH' ? 'text-error' : 'text-accent'
                }`}>{risk || 'STABLE'}</span>
             </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-3 pointer-events-auto">
           <div className="bg-accent text-white px-6 py-2 rounded-xl border border-white/20 text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl flex items-center gap-3">
              <Globe className="w-4 h-4" />
              Standard Feed
           </div>
           <div className="bg-black/40 backdrop-blur-md px-4 py-2 rounded-lg border border-white/5 text-[9px] font-mono text-white/60 tracking-tighter uppercase">
              {lat.toFixed(4)}°N / {lon.toFixed(4)}°W
           </div>
        </div>
      </div>

      {/* Visual Augmentation UI */}
      <div className="absolute top-8 right-8 z-20">
         <div className="w-12 h-12 bg-white/5 backdrop-blur-md rounded-full border border-white/10 flex items-center justify-center text-white/60 hover:text-accent transition-colors cursor-pointer pointer-events-auto" onClick={() => onLocationSelect && onLocationSelect(lat, lon)}>
            <Activity className="w-5 h-5 animate-pulse" />
         </div>
      </div>

      <div className="absolute inset-0 pointer-events-none z-10">
         <div className="absolute top-0 left-0 w-full h-full border-[20px] border-black/5" />
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[1px] bg-white/5" />
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1px] h-full bg-white/5" />
      </div>
    </motion.div>
  );
}
