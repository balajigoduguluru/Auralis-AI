import { motion } from 'motion/react';
import { Globe } from 'lucide-react';
import type { LoginStep } from '../types';
import Modal from './ui/Modal';

interface AuthModalProps {
  open: boolean;
  step: LoginStep;
  onAbort: () => void;
}

const titles = [
  'Initiating Link',
  'Secure Handshake',
  'Satellite Sync',
  'Authenticating',
  'Access Granted',
];
const descriptions = [
  'Locating nearest sentinel orbital node...',
  'Establishing encrypted quantum tunnel...',
  'Calibrating telemetry stream for your locale...',
  'Verifying nature-first agent credentials...',
  'Session validated. Welcome, Agent Node-Alpha7.',
];

export default function AuthModal({ open, step, onAbort }: AuthModalProps) {
  return (
    <Modal open={open} onClose={onAbort} ariaLabel="Satellite authentication">
      <div className="p-12 text-center space-y-12 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-white/10 overflow-hidden" aria-hidden="true">
          <motion.div
            animate={{ x: ['-100%', '100%'] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
            className="h-full bg-accent w-1/3"
          />
        </div>

        <div className="flex justify-center">
          <div className="w-20 h-20 bg-accent/5 rounded-[2rem] flex items-center justify-center text-accent relative">
            <Globe className={`w-10 h-10 ${step > 0 && step < 4 ? 'animate-pulse scale-110' : ''}`} aria-hidden="true" />
            {step > 1 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.5, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute inset-0 border border-accent rounded-[2rem]"
                aria-hidden="true"
              />
            )}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-3xl font-serif text-accent uppercase tracking-tight">
            {titles[step]}
          </h2>
          <p className="text-xs font-bold text-text-muted/80 uppercase tracking-[0.2em] px-8">
            {descriptions[step]}
          </p>
        </div>

        <div className="space-y-6">
          <div className="h-2 w-full bg-bg border border-border/50 rounded-full overflow-hidden" role="progressbar" aria-valuenow={(step + 1) * 20} aria-valuemin={0} aria-valuemax={100}>
            <motion.div
              initial={{ width: '0%' }}
              animate={{ width: `${(step + 1) * 20}%` }}
              transition={{ duration: step === 0 ? 0 : 2 }}
              className="h-full bg-accent"
            />
          </div>
          <div className="flex justify-between text-[10px] font-mono text-accent/50 uppercase tracking-widest">
            <span>Ping: {step * 4 + 12}ms</span>
            <span>Strength: {60 + step * 10}%</span>
          </div>
        </div>

        <button
          onClick={onAbort}
          className="text-[10px] uppercase font-bold text-text-muted hover:text-error transition-colors cursor-pointer"
          aria-label="Abort connection"
        >
          Abort Connection
        </button>
      </div>
    </Modal>
  );
}
