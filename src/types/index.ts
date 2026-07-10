export interface WeatherData {
  temp: number;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  pressure: number;
  visibility: number;
  uvIndex: number;
  precipitation: number;
  coordinates: string;
  locationName: string;
  lat: number;
  lon: number;
}

export interface HistoryEntry {
  time: string;
  date: string;
  temp: number;
  humidity: number;
  windSpeed: number;
  pressure: number;
  rainfall: number;
}

export interface Prediction {
  time: string;
  risk: 'LOW' | 'MODERATE' | 'HIGH';
  label: string;
}

export interface LogEntry {
  time: string;
  title: string;
  desc: string;
}

export type RiskLevel = 'LOW' | 'MODERATE' | 'HIGH';

export type MetricFilter = 'all' | 'temp' | 'humidity' | 'rainfall';

export type NotificationType = 'success' | 'info';

export interface Notification {
  message: string;
  type: NotificationType;
}

export interface AppData {
  temp: number;
  humidity: number;
  rainfall: number;
  windSpeed: number;
  windDirection: number;
  pressure: number;
  visibility: number;
  uvIndex: number;
  risk: RiskLevel | 'PENDING';
  recommendation: string;
  lastUpdate: string;
  coordinates: string;
  lat: number;
  lon: number;
  locationName: string;
}

export interface WeatherState {
  data: AppData;
  history: HistoryEntry[];
  isLoading: boolean;
  error: string | null;
}

export type LoginStep = 0 | 1 | 2 | 3 | 4;

export interface FeedbackEntry {
  id: string;
  message: string;
  userEmail: string;
  location: string;
  timestamp: string;
  notified: boolean;
  autoReplied: boolean;
}
