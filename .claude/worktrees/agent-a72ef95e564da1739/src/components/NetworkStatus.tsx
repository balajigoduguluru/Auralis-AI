import { useState, useEffect } from 'react';
import { WifiOff } from 'lucide-react';

export default function NetworkStatusBanner() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const onOnline = () => setIsOnline(true);
    const onOffline = () => setIsOnline(false);
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
    return () => {
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className="bg-red-600/90 text-white text-xs text-center py-1.5 px-4 flex items-center justify-center gap-2">
      <WifiOff className="w-3 h-3" />
      Network connection lost. Some features may be unavailable.
    </div>
  );
}
