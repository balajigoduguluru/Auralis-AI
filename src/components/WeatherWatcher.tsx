import { useState, useMemo, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, X, Mail, ShieldAlert, Send, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface WeatherData {
  temp: number;
  windSpeed: number;
  locationName: string;
}

interface WeatherWatcherProps {
  weather: WeatherData;
  onNotify?: (message: string, type: 'success' | 'info') => void;
}

export default function WeatherWatcher({ weather, onNotify }: WeatherWatcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [sensitivity, setSensitivity] = useState<'LOW' | 'MEDIUM' | 'HIGH'>('MEDIUM');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const isAlertThresholdMet = useMemo(() => {
    return weather.temp > 35 || weather.windSpeed > 50;
  }, [weather.temp, weather.windSpeed]);

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    if (!email) return;

    // Simulate save
    setIsSubscribed(true);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#52B788', '#2D6A4F', '#ffffff']
    });

    if (onNotify) {
      onNotify('Sentinel Alert Profile Synchronized.', 'success');
    }

    setTimeout(() => {
      setIsOpen(false);
    }, 2000);
  };

  const triggerTestAlert = () => {
    if (onNotify) {
      onNotify(`Emergency Transmission: ${weather.temp > 35 ? 'Heatwave' : 'Storm'} Warning for ${weather.locationName}`, 'info');
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        id="weather-watcher-fab"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 z-[100] w-14 h-14 bg-accent text-white rounded-full shadow-[0_0_20px_rgba(82,183,136,0.3)] flex items-center justify-center border border-white/20 hover:shadow-[0_0_30px_rgba(82,183,136,0.5)] transition-all"
      >
        <Bell className="w-6 h-6" />
        {isSubscribed && (
          <span className="absolute top-0 right-0 w-4 h-4 bg-error rounded-full border-2 border-bg animate-pulse" />
        )}
      </motion.button>

      {/* Sidebar Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[110]"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-bg/80 backdrop-blur-2xl z-[120] border-l border-white/10 shadow-[-20px_0_50px_rgba(0,0,0,0.5)] p-8 flex flex-col"
            >
              <div className="flex items-center justify-between mb-12">
                <div className="space-y-1">
                  <h2 className="text-3xl font-serif text-accent tracking-tighter uppercase">Weather <span className="text-text-muted/30 italic">Watch</span></h2>
                  <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.3em]">Neural Alert Protocol</p>
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 transition-colors"
                >
                  <X className="w-5 h-5 text-text-muted" />
                </button>
              </div>

              <form onSubmit={handleSave} className="flex-1 space-y-8">
                <div className="space-y-4">
                  <label className="block">
                    <span className="text-[10px] font-black text-accent uppercase tracking-widest block mb-4">Target Destination</span>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-accent transition-colors" />
                      <input
                        type="email"
                        required
                        placeholder="satellite.comm@auralis.io"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-sm text-white outline-none focus:ring-1 focus:ring-accent/40 transition-all placeholder:text-white/10"
                      />
                    </div>
                  </label>

                  <label className="block">
                    <span className="text-[10px] font-black text-accent uppercase tracking-widest block mb-4">Sensitivity Calibration</span>
                    <div className="relative group">
                      <ShieldAlert className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-accent transition-colors" />
                      <select
                        value={sensitivity}
                        onChange={(e) => setSensitivity(e.target.value as any)}
                        className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-sm text-white outline-none focus:ring-1 focus:ring-accent/40 transition-all appearance-none cursor-pointer"
                      >
                        <option value="LOW" className="bg-bg">LOW (EXTREME THREATS ONLY)</option>
                        <option value="MEDIUM" className="bg-bg">MEDIUM (RECOMMENDED)</option>
                        <option value="HIGH" className="bg-bg">HIGH (MAXIMUM VIGILANCE)</option>
                      </select>
                    </div>
                  </label>
                </div>

                <div className="pt-8 border-t border-white/5 space-y-6">
                  <div className="bg-accent/5 rounded-2xl p-6 border border-accent/10">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[9px] font-black text-accent uppercase tracking-widest">Logic Engine Status</span>
                      <span className={`text-[8px] font-bold px-2 py-0.5 rounded-full ${isAlertThresholdMet ? 'bg-error/20 text-error' : 'bg-success/20 text-success'}`}>
                        {isAlertThresholdMet ? 'CRITICAL TRIGGER DETECTED' : 'SYSTEM NOMINAL'}
                      </span>
                    </div>
                    <p className="text-[11px] text-text-muted/60 leading-relaxed mb-6 font-medium">
                      Current telemetry shows {weather.temp}°C and {weather.windSpeed}km/h. 
                      {isAlertThresholdMet 
                        ? ' Threshold parameters exceeded for emergency relay.' 
                        : ' Parameters remain within safety bounds.'}
                    </p>
                    
                    <button
                      type="button"
                      disabled={!isAlertThresholdMet}
                      onClick={triggerTestAlert}
                      className={`w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all ${
                        isAlertThresholdMet 
                        ? 'bg-error text-white hover:bg-error/80 shadow-lg shadow-error/20' 
                        : 'bg-white/5 text-white/20 cursor-not-allowed border border-white/5'
                      }`}
                    >
                      <Send className="w-4 h-4" />
                      Dispatch Emergency Test
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className={`w-full py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3 transition-all relative overflow-hidden group ${
                    isSubscribed 
                    ? 'bg-success text-white' 
                    : 'bg-accent text-white hover:shadow-[0_0_30px_rgba(82,183,136,0.3)]'
                  }`}
                >
                  {isSubscribed ? (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      Sentinel Linked
                    </>
                  ) : (
                    <>
                      Synchronize Profile
                    </>
                  )}
                  <motion.div 
                    className="absolute inset-0 bg-white/20 -translate-x-full"
                    animate={isSubscribed ? { x: '100%' } : {}}
                    transition={{ duration: 0.8 }}
                  />
                </button>
              </form>

              <div className="mt-8 text-center">
                 <p className="text-[8px] text-white/20 uppercase font-bold tracking-[0.2em]">End-to-End Neural Encryption Applied</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
