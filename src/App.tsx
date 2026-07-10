import { useState, useEffect, type FormEvent, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search, Activity, FileCode, ShieldCheck, ArrowRight, Thermometer, Droplets,
  Wind, Navigation, Gauge, Eye, Sun, CloudRain, Zap, ArrowUpRight, AlertTriangle,
  Info, Clock, ChevronRight, TrendingUp, MapPin, Globe, Leaf, Plus, Minus,
  Share2, MessageSquare, Github,
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, Legend,
} from 'recharts';
import { fetchWeather, fetchWeatherByCoords } from './services/weatherService';
import { generateEnvironmentalReport, hasApiKey } from './services/geminiService';
import MapVisualization from './components/MapVisualization';
import NetworkStatusBanner from './components/NetworkStatus';
import LiveImages from './components/LiveImages';
import Schematic from './components/Schematic';
import WeatherWatcher from './components/WeatherWatcher';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import DiagnosticModal from './components/DiagnosticModal';
import NotificationToast from './components/NotificationToast';
import RiskBanner from './components/RiskBanner';

import { useNotifications } from './hooks/useNotifications';
import { useAuth } from './hooks/useAuth';
import type { HistoryEntry, Prediction, LogEntry, MetricFilter, FeedbackEntry } from './types';
import { sendAdminNotification, sendAutoReply, canSendEmail } from './services/emailService';
import AdminModal from './components/AdminModal';

function calculateRisk(temp: number, windSpeed: number, precipitation: number): 'HIGH' | 'MODERATE' | 'LOW' {
  if (temp > 38 || windSpeed > 60 || precipitation > 50) return 'HIGH';
  if (temp > 30 || windSpeed > 40) return 'MODERATE';
  return 'LOW';
}

function generatePredictions(risk: 'HIGH' | 'MODERATE' | 'LOW'): Prediction[] {
  const risks: ('HIGH' | 'MODERATE' | 'LOW')[] = ['LOW', 'MODERATE', 'HIGH'];
  return [
    { time: '+4h', risk: risk === 'HIGH' ? risks[Math.floor(Math.random() * 3)] : risks[Math.floor(Math.random() * 2)], label: risk === 'HIGH' ? 'Monitoring' : 'Normalizing' },
    { time: '+8h', risk: risks[Math.floor(Math.random() * 2)], label: 'Stabilizing' },
    { time: '+12h', risk: risks[Math.floor(Math.random() * 3)], label: 'Projected' },
    { time: '+24h', risk: risks[0], label: 'Clearance' },
  ];
}

function csvExport(history: HistoryEntry[]) {
  const headers = ['Time', 'Date', 'Temperature (°C)', 'Humidity (%)', 'Wind Speed (km/h)', 'Pressure (hPa)', 'Rainfall (mm)'];
  const rows = history.map(e => [e.time, e.date, e.temp, e.humidity, e.windSpeed, e.pressure, e.rainfall].join(','));
  const csv = [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `auralis-telemetry-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

const initialHistory: HistoryEntry[] = [
  { time: '00:00', date: 'Jul 7', temp: 15, humidity: 70, windSpeed: 0, pressure: 1013, rainfall: 0 },
  { time: '04:00', date: 'Jul 7', temp: 14, humidity: 75, windSpeed: 0, pressure: 1013, rainfall: 0.5 },
  { time: '08:00', date: 'Jul 7', temp: 17, humidity: 65, windSpeed: 0, pressure: 1013, rainfall: 0.2 },
  { time: '12:00', date: 'Jul 7', temp: 22, humidity: 55, windSpeed: 0, pressure: 1013, rainfall: 0 },
  { time: '16:00', date: 'Jul 7', temp: 20, humidity: 60, windSpeed: 0, pressure: 1013, rainfall: 0 },
  { time: '20:00', date: 'Jul 7', temp: 16, humidity: 68, windSpeed: 0, pressure: 1013, rainfall: 0.1 },
];

const initialLogs: LogEntry[] = [
  { time: '12:45', title: 'Atmospheric Signature Sync', desc: 'Complete pulse analysis confirmed with ground sensors.' },
  { time: '11:20', title: 'Satellite-8 Connection', desc: 'Secure connection established. Telemetry stream stable.' },
  { time: '09:00', title: 'System Boot Sequence', desc: 'Integrity check passed. 12,480 nodes reporting.' },
];

export default function App() {
  const { notification, showNotification, clearNotification } = useNotifications();
  const {
    isLoggedIn, showLoginModal, loginStep, startLoginSequence, handleLogout, abortLogin,
  } = useAuth(showNotification);

  const [city, setCity] = useState('Nellore');
  const [feedback, setFeedback] = useState('');
  const [feedbackEmail, setFeedbackEmail] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [timeRange, setTimeRange] = useState(1);
  const [showDiagnostic, setShowDiagnostic] = useState(false);
  const [activeMetric, setActiveMetric] = useState<MetricFilter>('all');
  const [logFilter, setLogFilter] = useState('');
  const [showAdmin, setShowAdmin] = useState(false);
  const [isAdmin, setIsAdmin] = useState(() => sessionStorage.getItem('auralis-admin') === 'true');
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const ADMIN_SECRET = import.meta.env.VITE_ADMIN_SECRET;
  const [observations, setObservations] = useState<FeedbackEntry[]>(() => {
    try {
      const saved = localStorage.getItem('auralis-observations');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });
  const [mapZoom, setMapZoom] = useState(14);

  const [data, setData] = useState({
    temp: 0, humidity: 0, rainfall: 0, windSpeed: 0, windDirection: 0,
    pressure: 0, visibility: 0, uvIndex: 0, risk: 'PENDING' as string,
    recommendation: 'Awaiting sentinel link for real-time telemetry.',
    lastUpdate: 'System Cold-Start', coordinates: 'Calculating...',
    lat: 48.8566, lon: 2.3522, locationName: 'Initialize Node',
  });
  const [history, setHistory] = useState<HistoryEntry[]>(initialHistory);
  const [prediction, setPrediction] = useState<Prediction[]>([
    { time: '+4h', risk: 'LOW', label: 'Stable' },
    { time: '+8h', risk: 'LOW', label: 'Nominal' },
    { time: '+12h', risk: 'MODERATE', label: 'Variance' },
    { time: '+24h', risk: 'LOW', label: 'Recovery' },
  ]);
  const [logs, setLogs] = useState<LogEntry[]>(initialLogs);

  const filteredLogs = logs.filter(log =>
    log.title.toLowerCase().includes(logFilter.toLowerCase()) ||
    log.desc.toLowerCase().includes(logFilter.toLowerCase())
  );

  useEffect(() => { runAnalysis(undefined, 1, 'Nellore'); }, []);

  useEffect(() => {
    if (!hasApiKey()) {
      showNotification(
        'VITE_GEMINI_API_KEY not set. AI reports use fallback mode.',
        'info'
      );
    }
  }, []);

  const runAnalysis = async (e?: FormEvent, daysOverride?: number, cityOverride?: string) => {
    if (e) e.preventDefault();
    const target = cityOverride || city;
    if (!target.trim()) { showNotification('Please enter a location coordinate.', 'info'); return; }
    setIsAnalyzing(true);
    const days = daysOverride ?? timeRange;
    try {
      const weather = await fetchWeather(target, days);
      const risk = calculateRisk(weather.temp, weather.windSpeed, weather.precipitation);
      const report = await generateEnvironmentalReport(target, {
        temp: weather.temp, humidity: weather.humidity, windSpeed: weather.windSpeed, risk,
      });
      setData({
        temp: weather.temp, humidity: weather.humidity, rainfall: weather.precipitation,
        windSpeed: weather.windSpeed, windDirection: weather.windDirection, pressure: weather.pressure,
        visibility: weather.visibility, uvIndex: weather.uvIndex, risk,
        recommendation: report, lastUpdate: 'Just now',
        coordinates: weather.coordinates, lat: weather.lat, lon: weather.lon,
        locationName: weather.locationName,
      });
      setHistory(weather.history);
      const now = new Date();
      const ts = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
      setLogs(prev => [{ time: ts, title: `Scanned: ${weather.locationName}`, desc: `Automated re-calibration for ${weather.locationName}. Risk: ${risk}.` }, ...prev.slice(0, 4)]);
      setPrediction(generatePredictions(risk));
      showNotification(`Analysis complete: ${weather.locationName} signal secure.`);
    } catch {
      showNotification('Telemetry sync failed. Node offline.', 'info');
    } finally { setIsAnalyzing(false); }
  };

  const handleMapClick = async (lat: number, lon: number) => {
    setIsAnalyzing(true);
    try {
      const weather = await fetchWeatherByCoords(lat, lon, timeRange);
      const risk = calculateRisk(weather.temp, weather.windSpeed, weather.precipitation);
      const report = await generateEnvironmentalReport(weather.locationName, {
        temp: weather.temp, humidity: weather.humidity, windSpeed: weather.windSpeed, risk,
      });
      setData({
        temp: weather.temp, humidity: weather.humidity, rainfall: weather.precipitation,
        windSpeed: weather.windSpeed, windDirection: weather.windDirection, pressure: weather.pressure,
        visibility: weather.visibility, uvIndex: weather.uvIndex, risk,
        recommendation: report, lastUpdate: 'Just now',
        coordinates: weather.coordinates, lat: weather.lat, lon: weather.lon,
        locationName: weather.locationName,
      });
      setHistory(weather.history);
      const now = new Date();
      const ts = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
      setLogs(prev => [{ time: ts, title: `Intercept: ${weather.locationName}`, desc: `Coordinate intercept successful. Risk: ${risk}.` }, ...prev.slice(0, 4)]);
      setPrediction(generatePredictions(risk));
      showNotification(`Telemetry linked: ${weather.locationName}`);
    } catch {
      showNotification('Signal intercept failed.', 'info');
    } finally { setIsAnalyzing(false); }
  };

  const handleMapSearch = (query: string) => { setCity(query); runAnalysis(undefined, timeRange, query); };

  const shareAnalysis = () => {
    navigator.clipboard.writeText(window.location.href)
      .then(() => showNotification('Telemetry link copied to clipboard.'))
      .catch(() => showNotification('Copy failed. Manual link sharing required.', 'info'));
  };

  const submitObservation = async () => {
    if (!feedback.trim()) { showNotification('Please provide observation details.', 'info'); return; }
    if (!feedbackEmail.trim()) { showNotification('Please provide your email for confirmation.', 'info'); return; }

    const entry: FeedbackEntry = {
      id: crypto.randomUUID(),
      message: feedback.trim(),
      userEmail: feedbackEmail.trim(),
      location: data.locationName,
      timestamp: new Date().toLocaleString(),
      notified: false,
      autoReplied: false,
    };

    if (canSendEmail()) {
      const [notified, autoReplied] = await Promise.all([
        sendAdminNotification({
          message: entry.message,
          userEmail: entry.userEmail,
          location: entry.location,
          timestamp: entry.timestamp,
        }),
        sendAutoReply({
          to_email: entry.userEmail,
          message: entry.message,
          location: entry.location,
        }),
      ]);
      entry.notified = notified;
      entry.autoReplied = autoReplied;
    }

    const updated = [...observations, entry];
    setObservations(updated);
    localStorage.setItem('auralis-observations', JSON.stringify(updated));
    setFeedback('');
    setFeedbackEmail('');

    if (entry.notified && entry.autoReplied) {
      showNotification('Thank you for your observation! A confirmation has been sent to your email.', 'success');
    } else {
      showNotification('Thank you for your observation!', 'success');
    }
  };

  const handleAdminOpen = () => {
    if (isAdmin) {
      setShowAdmin(true);
    } else {
      setShowAdminLogin(true);
      setAdminPasswordInput('');
    }
  };

  const handleAdminLogin = () => {
    if (adminPasswordInput === ADMIN_SECRET) {
      setIsAdmin(true);
      sessionStorage.setItem('auralis-admin', 'true');
      setShowAdminLogin(false);
      setShowAdmin(true);
      showNotification('Admin access granted.', 'success');
    } else {
      showNotification('Invalid admin credentials.', 'info');
    }
  };

  return (
    <div className="min-h-screen bg-bg text-text relative overflow-x-hidden selection:bg-accent/10 motion-reduce:*:transition-none motion-reduce:*:animate-none">
      <AuthModal open={showLoginModal} step={loginStep} onAbort={abortLogin} />
      <RiskBanner risk={data.risk} locationName={data.locationName} />
      <DiagnosticModal open={showDiagnostic} locationName={data.locationName} onClose={() => setShowDiagnostic(false)} />
      <AdminModal open={showAdmin} observations={observations} onClose={() => setShowAdmin(false)} onClear={() => { setObservations([]); localStorage.removeItem('auralis-observations'); showNotification('Observation archive purged.', 'info'); }} />
      <AnimatePresence>
        {showAdminLogin && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[130] flex items-center justify-center p-6 bg-accent/95 backdrop-blur-3xl"
            role="dialog"
            aria-modal="true"
            aria-label="Admin Login"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="max-w-md w-full bg-bg border border-white/20 rounded-[3rem] p-8 md:p-12 space-y-8 shadow-[0_40px_80px_rgba(0,0,0,0.6)]"
            >
              <div className="space-y-2">
                <h2 className="text-2xl font-serif text-accent uppercase tracking-tight">Admin Access</h2>
                <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Enter passcode to continue</p>
              </div>
              <input
                type="password"
                value={adminPasswordInput}
                onChange={(e) => setAdminPasswordInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleAdminLogin(); }}
                placeholder="Passcode"
                className="w-full bg-surface border border-border/40 rounded-2xl p-5 outline-none focus:ring-4 focus:ring-accent/5 focus:border-accent/30 transition-all font-medium text-text placeholder:text-text-muted/50"
                autoFocus
              />
              <div className="flex gap-4">
                <button
                  onClick={() => setShowAdminLogin(false)}
                  className="flex-1 py-4 border border-border/40 text-text-muted rounded-xl text-[10px] uppercase font-bold tracking-widest hover:bg-surface transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAdminLogin}
                  className="flex-1 py-4 bg-accent text-white rounded-xl text-[10px] uppercase font-bold tracking-widest hover:bg-accent-light transition-all cursor-pointer"
                >
                  Authenticate
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <NotificationToast notification={notification} onDismiss={clearNotification} />
      <div className="fixed inset-0 bg-texture pointer-events-none opacity-[0.03]" aria-hidden="true" />

      <Navbar isLoggedIn={isLoggedIn} isAdmin={isAdmin} onLogin={startLoginSequence} onLogout={handleLogout} onAdminOpen={handleAdminOpen} />
      <NetworkStatusBanner />

      {/* Hero */}
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

            <form onSubmit={runAnalysis} className="pt-8 max-w-md relative group" role="search" aria-label="Location search">
              <input
                type="text"
                placeholder="Scan localized coordinates..."
                value={city}
                onChange={(e) => setCity(e.target.value)}
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

          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="relative hidden lg:block">
            <div className="aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-[0_50px_100px_rgba(27,67,50,0.15)] relative group border border-border/20">
              <AnimatePresence mode="wait">
                <motion.img
                  key={data.locationName}
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.5 }}
                  src={`https://loremflickr.com/1200/1600/${data.locationName.split(',')[0]},landscape,nature`}
                  alt={`Satellite view of ${data.locationName}`}
                  className="w-full h-full object-cover grayscale-[0.2] transition-transform duration-[4000ms] group-hover:scale-110"
                />
              </AnimatePresence>
              <div className="absolute inset-0 bg-gradient-to-t from-accent/60 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" aria-hidden="true" />
              <div className="absolute top-8 right-8 bg-black/40 backdrop-blur-md px-4 py-2 rounded-lg border border-white/10 text-[10px] font-mono text-white/80 tracking-widest uppercase">
                Satellite Feed: Live
              </div>
              <div className="absolute bottom-8 left-8 right-8 p-8 bg-white/10 backdrop-blur-2xl rounded-[2rem] border border-white/20 text-white space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-black tracking-[0.3em] opacity-60">Visual Confirmation</span>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-success rounded-full shadow-[0_0_10px_#52B788]" aria-hidden="true" />
                    <span className="text-[8px] font-black uppercase tracking-widest text-success">Verified</span>
                  </div>
                </div>
                <div className="text-3xl font-serif italic tracking-tight">&ldquo;{data.locationName}&rdquo;</div>
                <div className="text-[10px] font-bold text-white/70 leading-relaxed">
                  Deep-learning image verification successful. Regional topography matches expected climate signature profiles for this sector.
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Map */}
      <section className="py-24 bg-surface/50 border-y border-border/20 relative" id="map">
        <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-16">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12">
            <div className="space-y-4">
              <h2 className="text-xs uppercase font-black text-text-muted tracking-[0.25em]">Geospatial Intelligence</h2>
              <h3 className="text-5xl font-serif text-accent tracking-tighter">Live Sentinel <span className="text-text-muted/50 italic">Map</span></h3>
            </div>
            <div className="bg-bg/50 backdrop-blur-md px-6 py-3 rounded-2xl border border-border/50 flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse motion-reduce:animate-none" aria-hidden="true" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Node: Alpha-7 Online</span>
              </div>
              <div className="w-px h-4 bg-border" aria-hidden="true" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-accent italic">{data.locationName}</span>
            </div>
          </div>
          <div className="h-[500px] md:h-[600px] w-full">
            <MapVisualization
              center={[data.lat, data.lon]}
              locationName={data.locationName}
              risk={data.risk}
              zoom={mapZoom}
              onZoomChange={setMapZoom}
              onLocationSelect={handleMapClick}
              onSearch={handleMapSearch}
              onShare={shareAnalysis}
            />
          </div>
        </div>
      </section>

      {/* Satellite Imagery */}
      <section className="py-24 bg-bg relative overflow-hidden" id="satellite">
        <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-16">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12">
            <div className="space-y-4">
              <h2 className="text-xs uppercase font-black text-text-muted tracking-[0.25em]">Visual Intelligence Profile</h2>
              <h3 className="text-5xl font-serif text-accent tracking-tighter">Multi-Spectral <span className="text-text-muted/50 italic">Confirmation</span></h3>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-end">
                <span className="text-[9px] font-black text-text-muted uppercase tracking-widest opacity-70">Source Node</span>
                <span className="text-xs font-serif text-accent">{data.locationName}</span>
              </div>
              <div className="w-px h-8 bg-border/40 mx-4" aria-hidden="true" />
              <div className="flex items-center gap-4 text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">
                <div className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse motion-reduce:animate-none" aria-hidden="true" />
                Live Handshake: Active
              </div>
            </div>
          </div>

          <div className="h-[500px] md:h-[600px] w-full">
            <LiveImages locationName={data.locationName} />
          </div>
        </div>
      </section>

      {/* Analytics Chart */}
      <section className="py-24 max-w-7xl mx-auto px-6 md:px-12 space-y-16">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12 border-b border-border/50 pb-12">
          <div className="space-y-4">
            <h2 className="text-xs uppercase font-black text-text-muted tracking-[0.25em]">Climate Signatures</h2>
            <h3 className="text-5xl font-serif text-accent tracking-tighter">Variance <span className="text-text-muted/50 italic">Analytics</span></h3>
          </div>
          <div className="flex flex-wrap items-center gap-4 bg-bg p-1 rounded-xl border border-border/50 shadow-inner">
            {(['all', 'temp', 'humidity', 'rainfall'] as const).map((m) => (
              <button
                key={m}
                onClick={() => setActiveMetric(m)}
                className={`px-4 py-2 rounded-lg text-[10px] font-black transition-all uppercase tracking-[0.2em] cursor-pointer ${
                  activeMetric === m ? 'bg-accent text-white shadow-lg' : 'text-text-muted hover:text-accent'
                }`}
                aria-pressed={activeMetric === m}
              >
                {m}
              </button>
            ))}
            <div className="w-px h-6 bg-border mx-2" aria-hidden="true" />
            {([1, 7] as const).map((days) => (
              <button
                key={days}
                onClick={() => { setTimeRange(days); runAnalysis(undefined, days); }}
                className={`px-6 py-2 rounded-lg text-[10px] font-black transition-all uppercase tracking-[0.2em] cursor-pointer ${
                  timeRange === days ? 'bg-accent/10 text-accent border border-accent/20' : 'text-text-muted hover:text-accent'
                }`}
                aria-pressed={timeRange === days}
              >
                {days === 1 ? '24H' : '7D'}
              </button>
            ))}
          </div>
        </div>

        <div className="card-impact p-6 md:p-12 bg-surface/30 border-accent/5 h-[400px] md:h-[500px] relative">
          <div className="absolute top-6 md:top-12 left-6 md:left-12 z-10 space-y-1">
            <div className="text-[10px] font-black text-accent uppercase tracking-widest flex items-center gap-2">
              <Activity className="w-3 h-3 animate-pulse motion-reduce:animate-none" aria-hidden="true" />
              Signal Overlay: {activeMetric === 'all' ? 'Unified Stream' : activeMetric.toUpperCase()}
            </div>
            <div className="text-[9px] text-text-muted/60 uppercase font-black tracking-widest">
              Source: Satellite-Gamma Link &bull; Verified
            </div>
          </div>
          {history.length === 0 ? (
            <div className="flex items-center justify-center h-full text-text-muted/40 text-sm font-medium" role="status">
              <Activity className="w-5 h-5 animate-spin mr-3 motion-reduce:animate-none" aria-hidden="true" />
              Loading telemetry stream...
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={history}>
                <defs>
                  <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1B4332" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#1B4332" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorHum" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#40916C" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#40916C" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E9ECEF" opacity={0.3} />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 900, fill: '#1B4332', opacity: 0.5 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 900, fill: '#1B4332', opacity: 0.5 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0a0a0a', border: '1px solid rgba(82, 183, 136, 0.2)',
                    borderRadius: '16px', fontSize: '10px', color: '#fff', padding: '16px',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.4)', backdropFilter: 'blur(10px)',
                  }}
                  itemStyle={{ color: '#52B788', textTransform: 'uppercase', fontWeight: '900' }}
                />
                <Legend verticalAlign="top" align="right" wrapperStyle={{ paddingBottom: '40px', fontSize: '9px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.2em' }} />
                {(activeMetric === 'all' || activeMetric === 'temp') && (
                  <Area type="monotone" dataKey="temp" name="Temperature" stroke="#1B4332" strokeWidth={4} fillOpacity={1} fill="url(#colorTemp)" animationDuration={2000} activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2 }} />
                )}
                {(activeMetric === 'all' || activeMetric === 'humidity') && (
                  <Area type="monotone" dataKey="humidity" name="Humidity" stroke="#40916C" strokeWidth={2} strokeDasharray="8 4" fillOpacity={1} fill="url(#colorHum)" animationDuration={2500} />
                )}
                {(activeMetric === 'all' || activeMetric === 'rainfall') && (
                  <Area type="stepAfter" dataKey="rainfall" name="Precipitation" stroke="#D90429" strokeWidth={2} fill="transparent" animationDuration={3000} />
                )}
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </section>

      {/* Archive Table */}
      <section className="py-24 max-w-7xl mx-auto px-6 md:px-12 space-y-12">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h4 className="text-3xl font-serif text-accent tracking-tighter uppercase">Signal <span className="text-text-muted/50 italic">Archive</span></h4>
            <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.3em]">Historical Telemetry Registry &bull; 24H Window</p>
          </div>
          <button
            onClick={() => { csvExport(history); showNotification('CSV export initiated.'); }}
            className="px-6 py-2 border border-accent/20 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-accent hover:text-white transition-all cursor-pointer"
            aria-label="Export telemetry data as CSV"
          >
            Export CSV
          </button>
        </div>

        <div className="card-impact overflow-hidden border-border/30 bg-surface/5 p-0 border-t-4 border-t-accent">
          {history.length === 0 ? (
            <div className="p-12 text-center text-text-muted/40 text-sm font-medium" role="status">No telemetry data available.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[640px]">
                <thead>
                  <tr className="border-b border-border/20 bg-accent/5">
                    <th className="px-6 md:px-8 py-6 text-[9px] font-black text-accent uppercase tracking-widest">Time Marker</th>
                    <th className="px-6 md:px-8 py-6 text-[9px] font-black text-accent uppercase tracking-widest">Temperature</th>
                    <th className="px-6 md:px-8 py-6 text-[9px] font-black text-accent uppercase tracking-widest">Humidity</th>
                    <th className="px-6 md:px-8 py-6 text-[9px] font-black text-accent uppercase tracking-widest">Wind Speed</th>
                    <th className="px-6 md:px-8 py-6 text-[9px] font-black text-accent uppercase tracking-widest">Pressure</th>
                    <th className="px-6 md:px-8 py-6 text-[9px] font-black text-accent uppercase tracking-widest">Precipitation</th>
                    <th className="px-6 md:px-8 py-6 text-[9px] font-black text-accent uppercase tracking-widest">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/10">
                  {history.slice(0, 10).map((entry, idx) => (
                    <tr key={idx} className="hover:bg-accent/5 transition-colors group">
                      <td className="px-6 md:px-8 py-6">
                        <div className="text-[11px] font-black text-accent uppercase tracking-wider">{entry.time}</div>
                        <div className="text-[9px] text-text-muted/70 font-bold uppercase tracking-widest">{entry.date}</div>
                      </td>
                      <td className="px-6 md:px-8 py-6 text-[11px] font-mono font-black text-accent">{entry.temp}&deg;C</td>
                      <td className="px-6 md:px-8 py-6 text-[11px] font-mono font-black text-accent">{entry.humidity}%</td>
                      <td className="px-6 md:px-8 py-6 text-[11px] font-mono font-black text-accent">{entry.windSpeed}km/h</td>
                      <td className="px-6 md:px-8 py-6 text-[11px] font-mono font-black text-accent">{entry.pressure}hPa</td>
                      <td className="px-6 md:px-8 py-6 text-[11px] font-mono font-black text-accent">{entry.rainfall}mm</td>
                      <td className="px-6 md:px-8 py-6">
                        <span className={`px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${entry.temp > 30 ? 'bg-error/10 text-error' : 'bg-success/10 text-success'}`}>
                          {entry.temp > 30 ? 'High Variance' : 'Nominal'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      {/* Main Dashboard */}
      <section className="py-24 bg-surface relative z-10" id="risk">
        <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 border-b border-border/50 pb-12">
            <div className="space-y-4">
              <h2 className="text-xs uppercase font-black text-text-muted tracking-[0.25em]">Live Intelligence Protocol</h2>
              <h3 className="text-5xl font-serif text-accent">Pulse Analysis <span className="text-text-muted/50 italic">Report</span></h3>
            </div>
            <div className="flex items-center gap-8 text-[11px] font-bold text-text-muted tracking-widest uppercase">
              <div className="flex flex-col items-end">
                <span>Update detected</span>
                <span className="text-accent">{data.lastUpdate}</span>
              </div>
              <div className="w-px h-8 bg-border" aria-hidden="true" />
              <div className="flex flex-col items-end">
                <span>Coordinates</span>
                <span className="text-accent">{data.coordinates}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <MetricModule icon={<Thermometer className="w-6 h-6" />} label="Atmosphere Temp" value={data.temp} unit="°C" trend={data.temp > 30 ? '+1.2%' : '-0.5%'} trendUp={data.temp > 30} color={data.temp > 30 ? 'text-error' : 'text-success'} />
            <MetricModule icon={<Droplets className="w-6 h-6" />} label="Relative Humidity" value={data.humidity} unit="%" trend={data.humidity > 60 ? '+2.4%' : '-1.1%'} trendUp={data.humidity > 60} color={data.humidity > 60 ? 'text-success' : 'text-warning'} />
            <MetricModule icon={<Wind className="w-6 h-6" />} label="Wind Speed" value={data.windSpeed} unit="km/h" trend="Nominal" color="text-accent" />
            <MetricModule icon={<Navigation className="w-6 h-6" />} label="Wind Direction" value={data.windDirection} unit="°" trend="Steady" color="text-text-muted" />
            <MetricModule icon={<Gauge className="w-6 h-6" />} label="Barometric Pulse" value={data.pressure} unit="hPa" trend="Calibrated" color="text-accent" />
            <MetricModule icon={<Eye className="w-6 h-6" />} label="Optical Visibility" value={data.visibility} unit="km" trend="Clear" color="text-success" />
            <MetricModule icon={<Sun className="w-6 h-6" />} label="UV Intensity" value={data.uvIndex} unit="index" trend={data.uvIndex > 7 ? 'High' : 'Low'} trendUp={data.uvIndex > 7} color={data.uvIndex > 7 ? 'text-warning' : 'text-success'} />
            <MetricModule icon={<CloudRain className="w-6 h-6" />} label="Precipitation" value={data.rainfall} unit="mm" trend="Observed" color="text-accent" />

            <motion.div
              whileHover={{ scale: 1.02 }}
              onClick={() => showNotification('Opening severity protocol details...', 'info')}
              className="md:col-span-2 lg:col-span-4 card-impact bg-accent text-white border-transparent flex flex-col md:flex-row justify-between items-center overflow-hidden relative group cursor-pointer p-8 md:p-12"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && showNotification('Opening severity protocol details...', 'info')}
              aria-label="View severity details"
            >
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform pointer-events-none" aria-hidden="true">
                <ShieldCheck className="w-48 md:w-64 h-48 md:h-64" />
              </div>
              <div className="z-10 space-y-4">
                <div className="flex items-center gap-4 flex-wrap">
                  <span className="text-[10px] uppercase font-black tracking-[0.3em] opacity-80">Neural Risk Engine</span>
                  <span className="px-4 py-1 bg-white/20 rounded-full text-[10px] font-black tracking-widest">ACTIVE MONITORING</span>
                </div>
                <div>
                  <div className="text-6xl md:text-8xl font-serif leading-none tracking-tighter mb-2">{data.risk}</div>
                  <div className="text-[10px] uppercase font-black tracking-[0.2em] opacity-80">System Severity Index &bull; Sentinel Linked</div>
                </div>
              </div>
              <div className="z-10 mt-8 md:mt-0 flex flex-col items-end gap-6">
                <div className="text-right max-w-xs">
                  <div className="text-[10px] uppercase font-black tracking-widest opacity-60 mb-2 underline underline-offset-4">Current Protocol</div>
                  <div className="text-sm font-medium leading-relaxed opacity-80">
                    Auralis AI logic determines {data.risk.toLowerCase()} variance for this sector. All orbital sensors are aligned with ground telemetry.
                  </div>
                </div>
                <div className="flex items-center gap-3 text-[10px] font-black group-hover:gap-6 transition-all uppercase tracking-[0.3em] bg-white/10 px-8 py-4 rounded-2xl border border-white/20">
                  Detailed Diagnostic <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Agent + Signal panels */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12" id="protocol">
            <div className="lg:col-span-2 card-impact flex flex-col justify-between border-accent/10 relative overflow-hidden bg-white/[0.02]">
              <div className="flex flex-col md:flex-row justify-between items-start gap-8 z-10">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-accent rounded-[1.5rem] flex items-center justify-center text-white shadow-2xl shadow-accent/20">
                    <Zap className="w-8 h-8" aria-hidden="true" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-2xl font-serif text-accent uppercase tracking-tight">Agent Analysis <span className="text-text-muted/60 italic">Output</span></h4>
                    <p className="text-[10px] uppercase font-black text-text-muted tracking-[0.25em]">Auralis v2.0 Architecture</p>
                  </div>
                </div>
                <div className="w-full md:w-64 h-40 hidden md:block pointer-events-none" aria-hidden="true">
                  <Schematic />
                </div>
              </div>

              <div className="space-y-6 pt-12 z-10">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={data.recommendation}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-2xl md:text-3xl font-serif text-accent italic leading-relaxed"
                  >
                    &ldquo;{data.recommendation}&rdquo;
                  </motion.p>
                </AnimatePresence>
                <div className="flex flex-wrap gap-3">
                  {['Neural Diagnostic', 'Climate Modelling', 'Recursive Logic'].map(tag => (
                    <span key={tag} className="px-4 py-2 bg-accent text-white rounded-lg text-[9px] font-black uppercase tracking-[0.2em] shadow-lg shadow-accent/10">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-center gap-8 justify-between border-t border-border/50 pt-8 mt-12 z-10">
                <div className="space-y-2 w-full">
                  <div className="flex justify-between items-end text-[9px] font-black uppercase tracking-[0.2em] text-text-muted opacity-80">
                    <span>Model Stability Profile</span>
                    <span className="text-accent">{data.risk === 'HIGH' ? '78.2%' : '94.6%'} Confidence</span>
                  </div>
                  <div className="h-2 w-full bg-border/20 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: data.risk === 'HIGH' ? '78.2%' : '94.6%' }}
                      transition={{ duration: 1.5, ease: 'circOut' }}
                      className={`h-full ${data.risk === 'HIGH' ? 'bg-error' : 'bg-accent'} shadow-[0_0_10px_rgba(27,67,50,0.5)]`}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <button onClick={() => setShowDiagnostic(true)} className="px-8 py-3 bg-accent/5 border border-accent/20 text-accent rounded-xl text-[10px] uppercase font-black tracking-widest hover:bg-accent hover:text-white transition-all flex items-center gap-3 group cursor-pointer">
                    Logic Feed <Activity className="w-3 h-3 group-hover:scale-125 transition-transform" aria-hidden="true" />
                  </button>
                  <button onClick={() => runAnalysis()} disabled={isAnalyzing} className="btn-impact whitespace-nowrap !py-3 !px-8 text-[10px] font-black uppercase tracking-widest disabled:opacity-50 cursor-pointer">
                    {isAnalyzing ? 'Syncing...' : 'Re-sync API'}
                  </button>
                </div>
              </div>
            </div>

            <div className="card-impact flex flex-col justify-between border-accent/5 overflow-hidden">
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <h4 className="text-[10px] uppercase font-bold text-accent tracking-[0.2em]">Signal Search &amp; Intelligence</h4>
                  <div className="w-2 h-2 bg-accent rounded-full animate-pulse shadow-[0_0_10px_rgba(27,67,50,0.5)] motion-reduce:animate-none" aria-hidden="true" />
                </div>
                <div className="relative group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted/60 group-focus-within:text-accent transition-colors pointer-events-none" aria-hidden="true" />
                  <input
                    type="text"
                    placeholder="Filter Signal ID..."
                    value={logFilter}
                    onChange={(e) => setLogFilter(e.target.value)}
                    className="w-full bg-surface border border-accent/10 rounded-xl py-3 pl-12 pr-4 text-[10px] font-black uppercase tracking-widest focus:ring-1 focus:ring-accent/20 outline-none transition-all"
                    aria-label="Filter signal logs"
                  />
                </div>
                <div className="space-y-8 relative overflow-hidden h-[400px] overflow-y-auto pr-2">
                  <AnimatePresence mode="popLayout">
                    {filteredLogs.length === 0 ? (
                      <div className="text-center text-text-muted/40 text-[10px] font-bold uppercase tracking-widest pt-8" role="status">No matching signals found.</div>
                    ) : (
                      filteredLogs.map((log, i) => (
                        <motion.div
                          key={`${log.title}-${i}`}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="space-y-2 group cursor-default"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] font-mono text-text-muted/70">{log.time}</span>
                            <h5 className="text-sm font-bold text-accent group-hover:translate-x-1 transition-transform">{log.title}</h5>
                          </div>
                          <p className="text-xs text-text-muted leading-relaxed pl-12 border-l border-border/30">
                            {log.desc}
                          </p>
                        </motion.div>
                      ))
                    )}
                  </AnimatePresence>
                </div>
              </div>
              <button
                onClick={() => showNotification('Viewing archived signal history...', 'info')}
                className="w-full mt-12 py-4 border border-accent/10 rounded-xl text-[10px] uppercase font-bold text-accent tracking-widest hover:bg-accent hover:text-white transition-all duration-500 cursor-pointer"
              >
                View Full Logs
              </button>
            </div>
          </div>

          {/* Predictive Timeline */}
          <div className="pt-24 border-t border-border/20">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12 mb-16">
              <div className="space-y-4">
                <h2 className="text-xs uppercase font-black text-text-muted tracking-[0.25em]">Future State Projections</h2>
                <h3 className="text-5xl font-serif text-accent tracking-tighter italic">Predictive <span className="text-text-muted/50">Timeline</span></h3>
              </div>
              <div className="flex items-center gap-3 bg-surface/50 px-4 py-2 rounded-2xl border border-border/30">
                <Activity className="w-4 h-4 text-accent animate-pulse motion-reduce:animate-none" aria-hidden="true" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted">AI Forecast Logic Active</span>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {prediction.map((p, i) => (
                <motion.div
                  key={i}
                  whileHover={{ y: -5 }}
                  className="card-impact bg-white/40 backdrop-blur-md p-8 border-accent/10 relative overflow-hidden group"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none" aria-hidden="true">
                    <Clock className="w-12 h-12" />
                  </div>
                  <div className="space-y-4">
                    <span className="text-2xl font-serif text-accent">{p.time}</span>
                    <div className="space-y-1">
                      <div className={`text-[10px] font-black uppercase tracking-widest ${p.risk === 'HIGH' ? 'text-error' : p.risk === 'MODERATE' ? 'text-warning' : 'text-success'}`}>
                        {p.risk} RISK
                      </div>
                      <div className="text-xs font-medium text-text-muted italic opacity-80">{p.label}</div>
                    </div>
                  </div>
                  <div className="mt-6 pt-4 border-t border-border/20">
                    <div className="h-1 w-full bg-border/20 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: p.risk === 'HIGH' ? '90%' : p.risk === 'MODERATE' ? '50%' : '15%' }}
                        className={`h-full ${p.risk === 'HIGH' ? 'bg-error' : p.risk === 'MODERATE' ? 'bg-warning' : 'bg-success'}`}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Feedback */}
          <div className="bg-bg rounded-[3rem] p-12 md:p-20 relative overflow-hidden" id="community">
            <div className="absolute top-0 right-0 p-20 opacity-5 pointer-events-none" aria-hidden="true">
              <Globe className="w-96 h-96" />
            </div>
            <div className="max-w-3xl space-y-12 relative z-10">
              <div className="space-y-4">
                <h2 className="text-4xl md:text-6xl font-serif text-accent leading-tight">
                  Help us refine <br /> the intelligence.
                </h2>
                <p className="text-xl text-text-muted font-medium">
                  Localized human verification is the heartbeat of our risk assessment. Your observations calibrate the sentinel network for a safer tomorrow.
                </p>
              </div>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="feedback-input" className="text-[10px] uppercase font-bold text-text-muted tracking-widest ml-4">Verification Input</label>
                      <textarea
                        id="feedback-input"
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        placeholder="Is this prediction accurate for your locale?"
                        className="w-full bg-surface border border-border/40 rounded-2xl p-6 h-28 outline-none focus:ring-4 focus:ring-accent/5 focus:border-accent/30 transition-all font-medium text-text placeholder:text-text-muted/50 resize-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="feedback-email" className="text-[10px] uppercase font-bold text-text-muted tracking-widest ml-4">Your Email</label>
                      <input
                        id="feedback-email"
                        type="email"
                        value={feedbackEmail}
                        onChange={(e) => setFeedbackEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full bg-surface border border-border/40 rounded-2xl p-5 outline-none focus:ring-4 focus:ring-accent/5 focus:border-accent/30 transition-all font-medium text-text placeholder:text-text-muted/50"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col justify-end space-y-6">
                    <div className="p-8 bg-surface rounded-2xl border border-border/40 space-y-4">
                      <div className="text-[10px] uppercase font-bold text-text-muted tracking-widest">Protocol Trust</div>
                      <div className="text-5xl font-serif text-accent">99.82% <span className="text-xl text-text-muted italic">Score</span></div>
                    </div>
                    <button onClick={submitObservation} className="btn-impact w-full flex items-center justify-center gap-3 group cursor-pointer">
                      Submit Observation <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer showNotification={showNotification} />
      <WeatherWatcher
        weather={{ temp: data.temp, windSpeed: data.windSpeed, locationName: data.locationName }}
        onNotify={showNotification}
      />
    </div>
  );
}

function MetricModule({ icon, label, value, unit, trend, trendUp, color }: {
  icon: ReactNode; label: string; value: number; unit: string;
  trend: string; trendUp?: boolean; color: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="card-impact space-y-8 group border-accent/5"
    >
      <div className="flex items-center justify-between">
        <div className="w-12 h-12 bg-bg rounded-xl flex items-center justify-center text-accent group-hover:scale-110 transition-transform duration-500">
          {icon}
        </div>
        <div className={`text-[10px] font-bold uppercase tracking-widest ${color}`}>
          {trendUp !== undefined ? (trendUp ? '\u2191' : '\u2193') : '\u2022'} {trend}
        </div>
      </div>
      <div className="space-y-1">
        <div className="text-[10px] uppercase font-bold text-text-muted/60 tracking-widest">{label}</div>
        <div className="flex items-baseline gap-2">
          <span className="text-5xl font-serif text-accent leading-none">{value}</span>
          <span className="text-xl font-serif text-text-muted italic">{unit}</span>
        </div>
      </div>
      <div className="pt-2">
        <div className="h-1 w-full bg-bg rounded-full overflow-hidden relative">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: '60%' }}
            className="h-full bg-accent/20"
          />
          <motion.div
            animate={{ x: ['-100%', '200%'] }}
            transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
            className="absolute inset-0 bg-accent/5 skew-x-[-20deg] w-1/4 motion-reduce:animate-none"
            aria-hidden="true"
          />
        </div>
      </div>
    </motion.div>
  );
}
