import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, X, Trash2, MessageSquare, MapPin, Clock, Mail } from 'lucide-react';
import type { FeedbackEntry } from '../types';

interface AdminModalProps {
  open: boolean;
  observations: FeedbackEntry[];
  onClose: () => void;
  onClear: () => void;
}

export default function AdminModal({ open, observations, onClose, onClear }: AdminModalProps) {
  const [confirmClear, setConfirmClear] = useState(false);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-accent/95 backdrop-blur-3xl"
          role="dialog"
          aria-modal="true"
          aria-label="Admin Observation Panel"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            className="max-w-3xl w-full bg-bg border border-white/20 rounded-[3rem] p-8 md:p-12 space-y-8 shadow-[0_40px_80px_rgba(0,0,0,0.6)] relative overflow-hidden max-h-[90vh] flex flex-col"
          >
            <div className="flex items-center justify-between shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center text-accent">
                  <Lock className="w-6 h-6" aria-hidden="true" />
                </div>
                <div>
                  <h2 className="text-2xl font-serif text-accent uppercase tracking-tight">Admin Panel</h2>
                  <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Observation Archive</p>
                </div>
              </div>
              <button onClick={onClose} className="text-text-muted hover:text-error transition-colors cursor-pointer" aria-label="Close admin panel">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-text-muted shrink-0">
              <span>{observations.length} Recorded Signal{observations.length !== 1 ? 's' : ''}</span>
              {observations.length > 0 && (
                <button
                  onClick={() => {
                    if (confirmClear) {
                      onClear();
                      setConfirmClear(false);
                    } else {
                      setConfirmClear(true);
                      setTimeout(() => setConfirmClear(false), 3000);
                    }
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all cursor-pointer ${
                    confirmClear
                      ? 'bg-error/20 text-error'
                      : 'text-text-muted hover:text-error hover:bg-error/5'
                  }`}
                >
                  <Trash2 className="w-3 h-3" />
                  {confirmClear ? 'Confirm Purge?' : 'Purge All'}
                </button>
              )}
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 min-h-0 pr-2">
              {observations.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-text-muted/40">
                  <MessageSquare className="w-16 h-16 mb-6 opacity-30" aria-hidden="true" />
                  <p className="text-[10px] font-black uppercase tracking-widest">No observations recorded yet</p>
                  <p className="text-[9px] font-bold mt-2 opacity-60">Community submissions will appear here</p>
                </div>
              ) : (
                [...observations].reverse().map((entry) => (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 bg-surface rounded-2xl border border-border/40 space-y-4"
                  >
                    <p className="text-sm font-medium text-text leading-relaxed">
                      &ldquo;{entry.message}&rdquo;
                    </p>
                    <div className="flex flex-wrap items-center gap-6 text-[9px] font-black uppercase tracking-widest text-text-muted/70">
                      <span className="flex items-center gap-2">
                        <Clock className="w-3 h-3" aria-hidden="true" />
                        {entry.timestamp}
                      </span>
                      <span className="flex items-center gap-2">
                        <MapPin className="w-3 h-3" aria-hidden="true" />
                        {entry.location}
                      </span>
                      <span className="flex items-center gap-2 text-text-muted/70">
                        <Mail className="w-3 h-3" aria-hidden="true" />
                        {entry.userEmail}
                      </span>
                      <span className={`flex items-center gap-2 ${entry.notified && entry.autoReplied ? 'text-success' : 'text-warning'}`}>
                        <Mail className="w-3 h-3" aria-hidden="true" />
                        {entry.notified ? 'Notified' : 'Pending'}
                        {' / '}
                        {entry.autoReplied ? 'Replied' : 'Pending'}
                      </span>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            <button
              onClick={onClose}
              className="w-full py-4 bg-accent text-white rounded-xl text-[10px] uppercase font-bold tracking-widest hover:bg-accent-light transition-all shrink-0 cursor-pointer"
            >
              Close Terminal
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
