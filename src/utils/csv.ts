import type { HistoryEntry } from '../types';

/**
 * Exports telemetry history as a CSV file and triggers browser download.
 * Creates a Blob with proper CSV headers and initiates download via a temporary anchor element.
 */
export function csvExport(history: HistoryEntry[]) {
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
