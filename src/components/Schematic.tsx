import { motion } from 'motion/react';

export default function Schematic() {
  return (
    <div className="w-full h-full min-h-[300px] bg-bg/50 rounded-3xl border border-border/20 p-8 flex items-center justify-center relative overflow-hidden group">
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#1B4332_1px,transparent_1px)] bg-[size:20px_20px]" />
      
      <svg width="400" height="240" viewBox="0 0 400 240" fill="none" xmlns="http://www.w3.org/2000/svg" className="relative z-10">
        {/* Central Node */}
        <motion.circle 
          cx="200" cy="120" r="30" 
          stroke="#1B4332" strokeWidth="2" fill="#1B4332" fillOpacity="0.05"
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        <circle cx="200" cy="120" r="10" fill="#1B4332" className="animate-pulse" />
        
        {/* Connecting Lines */}
        <motion.path 
          d="M200 90V40M200 150V200M170 120H120M230 120H280" 
          stroke="#1B4332" strokeWidth="1" strokeDasharray="4 4"
          initial={{ strokeDashoffset: 0 }}
          animate={{ strokeDashoffset: -20 }}
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
        />
        
        {/* Satellite Nodes */}
        <g opacity="0.6">
          <circle cx="200" cy="40" r="8" stroke="#1B4332" strokeWidth="1" />
          <circle cx="200" cy="200" r="8" stroke="#1B4332" strokeWidth="1" />
          <circle cx="120" cy="120" r="8" stroke="#1B4332" strokeWidth="1" />
          <circle cx="280" cy="120" r="8" stroke="#1B4332" strokeWidth="1" />
        </g>
        
        {/* Tags */}
        <text x="200" y="25" textAnchor="middle" fill="#1B4332" fontSize="8" fontWeight="bold" className="uppercase tracking-widest opacity-60">Orbital-Alpha</text>
        <text x="200" y="215" textAnchor="middle" fill="#1B4332" fontSize="8" fontWeight="bold" className="uppercase tracking-widest opacity-60">Ground-Sentinel</text>
        <text x="100" y="123" textAnchor="end" fill="#1B4332" fontSize="8" fontWeight="bold" className="uppercase tracking-widest opacity-60">Atmospheric</text>
        <text x="300" y="123" textAnchor="start" fill="#1B4332" fontSize="8" fontWeight="bold" className="uppercase tracking-widest opacity-60">Telemetry</text>
        
        {/* Core Label */}
        <text x="200" y="165" textAnchor="middle" fill="#1B4332" fontSize="10" fontWeight="black" className="uppercase tracking-[0.3em]">Auralis AI</text>
      </svg>
      
      {/* Decorative corners */}
      <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-accent/20" />
      <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-accent/20" />
      <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-accent/20" />
      <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-accent/20" />
    </div>
  );
}
