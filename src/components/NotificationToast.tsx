import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, Info } from 'lucide-react';
import type { Notification } from '../types';

interface NotificationToastProps {
  notification: Notification | null;
  onDismiss: () => void;
}

export default function NotificationToast({ notification, onDismiss }: NotificationToastProps) {
  return (
    <AnimatePresence>
      {notification && (
        <motion.div
          initial={{ opacity: 0, y: -20, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: -20, x: '-50%' }}
          onClick={onDismiss}
          className="fixed top-24 left-1/2 z-[100] px-6 py-3 bg-accent text-white rounded-full shadow-2xl flex items-center gap-3 border border-white/20 backdrop-blur-md cursor-pointer"
          role="status"
          aria-live="polite"
        >
          {notification.type === 'success' ? <ShieldCheck className="w-4 h-4" aria-hidden="true" /> : <Info className="w-4 h-4" aria-hidden="true" />}
          <span className="text-sm font-bold tracking-wide">{notification.message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
