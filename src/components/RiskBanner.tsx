import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle } from 'lucide-react';

interface RiskBannerProps {
  risk: string;
  locationName: string;
}

export default function RiskBanner({ risk, locationName }: RiskBannerProps) {
  return (
    <AnimatePresence>
      {risk === 'HIGH' && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="bg-error text-white font-bold text-xs p-3 flex items-center justify-center gap-3 relative z-[60] overflow-hidden"
          role="alert"
          aria-live="assertive"
        >
          <AlertTriangle className="w-4 h-4 animate-bounce" aria-hidden="true" />
          <span className="uppercase tracking-[0.2em]">High Alert Protocol: Anomalous Climate Signature Detected in {locationName}</span>
          <span className="px-3 py-1 bg-white/20 rounded-full text-[10px]">
            Emergency Protocol
          </span>
          <motion.div
            animate={{ x: ['-100%', '200%'] }}
            transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
            className="absolute inset-0 bg-white/10 skew-x-[-20deg] w-1/4 pointer-events-none"
            aria-hidden="true"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
