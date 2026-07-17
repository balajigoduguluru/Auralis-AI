import type { HistoryEntry, LogEntry } from '../types';

export const RISK_THRESHOLDS = {
  HIGH: { temp: 38, windSpeed: 60, precipitation: 50 },
  MODERATE: { temp: 30, windSpeed: 40 },
} as const;

export const NOTIFICATION_DURATION = 4000;

export const INITIAL_HISTORY: HistoryEntry[] = [
  { time: '00:00', date: 'Jul 7', temp: 15, humidity: 70, windSpeed: 0, pressure: 1013, rainfall: 0 },
  { time: '04:00', date: 'Jul 7', temp: 14, humidity: 75, windSpeed: 0, pressure: 1013, rainfall: 0.5 },
  { time: '08:00', date: 'Jul 7', temp: 17, humidity: 65, windSpeed: 0, pressure: 1013, rainfall: 0.2 },
  { time: '12:00', date: 'Jul 7', temp: 22, humidity: 55, windSpeed: 0, pressure: 1013, rainfall: 0 },
  { time: '16:00', date: 'Jul 7', temp: 20, humidity: 60, windSpeed: 0, pressure: 1013, rainfall: 0 },
  { time: '20:00', date: 'Jul 7', temp: 16, humidity: 68, windSpeed: 0, pressure: 1013, rainfall: 0.1 },
];

export const INITIAL_LOGS: LogEntry[] = [
  { time: '12:45', title: 'Atmospheric Signature Sync', desc: 'Complete pulse analysis confirmed with ground sensors.' },
  { time: '11:20', title: 'Satellite-8 Connection', desc: 'Secure connection established. Telemetry stream stable.' },
  { time: '09:00', title: 'System Boot Sequence', desc: 'Integrity check passed. 12,480 nodes reporting.' },
];

export const INITIAL_PREDICTIONS = [
  { time: '+4h', risk: 'LOW' as const, label: 'Stable' },
  { time: '+8h', risk: 'LOW' as const, label: 'Nominal' },
  { time: '+12h', risk: 'MODERATE' as const, label: 'Variance' },
  { time: '+24h', risk: 'LOW' as const, label: 'Recovery' },
];

export const INITIAL_DATA = {
  temp: 0, humidity: 0, rainfall: 0, windSpeed: 0, windDirection: 0,
  pressure: 0, visibility: 0, uvIndex: 0, risk: 'PENDING' as string,
  recommendation: 'Awaiting sentinel link for real-time telemetry.',
  lastUpdate: 'System Cold-Start', coordinates: 'Calculating...',
  lat: 48.8566, lon: 2.3522, locationName: '',
};
