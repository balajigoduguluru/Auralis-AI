import { Activity, X } from 'lucide-react';
import Modal from './ui/Modal';

interface DiagnosticModalProps {
  open: boolean;
  locationName: string;
  onClose: () => void;
}

export default function DiagnosticModal({ open, locationName, onClose }: DiagnosticModalProps) {
  return (
    <Modal open={open} onClose={onClose} ariaLabel="AI Diagnostic Feed">
      <div className="p-12 space-y-8 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center text-accent">
              <Activity className="w-6 h-6 animate-pulse" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-2xl font-serif text-accent uppercase tracking-tight">Diagnostic Feed</h2>
              <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Neural Link: Active</p>
            </div>
          </div>
          <button onClick={onClose} className="text-text-muted hover:text-error transition-colors cursor-pointer" aria-label="Close diagnostic">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-6">
          <div className="p-8 bg-surface rounded-3xl border border-border/50 space-y-4">
            <p className="text-sm font-medium text-text-muted italic leading-relaxed">
              &ldquo;Agent Analysis: Local atmospheric pressure is showing signs of localized variance within the {locationName} sector. Nature-based sensory arrays indicate stability, but background thermal signatures require continuous node-alpha monitoring.&rdquo;
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-6 bg-accent/5 rounded-2xl border border-accent/10">
              <span className="text-[9px] font-bold text-accent uppercase tracking-widest block mb-2">Confidence Score</span>
              <span className="text-2xl font-serif text-accent tracking-tighter">98.4%</span>
            </div>
            <div className="p-6 bg-accent/5 rounded-2xl border border-accent/10">
              <span className="text-[9px] font-bold text-accent uppercase tracking-widest block mb-2">Node Latency</span>
              <span className="text-2xl font-serif text-accent tracking-tighter">14ms</span>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-4 bg-accent text-white rounded-xl text-[10px] uppercase font-bold tracking-widest hover:bg-accent-light transition-all cursor-pointer"
        >
          Close Diagnostic
        </button>
      </div>
    </Modal>
  );
}
