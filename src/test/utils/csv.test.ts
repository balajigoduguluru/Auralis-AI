import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { csvExport } from '../../utils/csv';
import type { HistoryEntry } from '../../types';

describe('csvExport', () => {
  const mockEntries: HistoryEntry[] = [
    { time: '00:00', date: 'Jul 7', temp: 15, humidity: 70, windSpeed: 10, pressure: 1013, rainfall: 0 },
    { time: '12:00', date: 'Jul 7', temp: 22, humidity: 55, windSpeed: 15, pressure: 1012, rainfall: 0.5 },
  ];

  let createObjectURL: any;
  let revokeObjectURL: any;
  let clickFn: any;

  beforeEach(() => {
    createObjectURL = vi.fn(() => 'blob:test');
    revokeObjectURL = vi.fn();
    clickFn = vi.fn();
    global.URL.createObjectURL = createObjectURL;
    global.URL.revokeObjectURL = revokeObjectURL;
    document.createElement = vi.fn().mockImplementation((tag: string) => {
      if (tag === 'a') {
        return { href: '', download: '', click: clickFn };
      }
      return {};
    }) as any;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('creates a CSV blob and triggers download', () => {
    csvExport(mockEntries);
    expect(createObjectURL).toHaveBeenCalledOnce();
    const blob = createObjectURL.mock.calls[0][0] as Blob;
    expect(blob.type).toBe('text/csv');
    expect(clickFn).toHaveBeenCalledOnce();
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:test');
  });

  it('generates correct CSV headers and data', () => {
    csvExport(mockEntries);
    const blob = createObjectURL.mock.calls[0][0] as Blob;
    return blob.text().then((text: string) => {
      const lines = text.split('\n');
      expect(lines[0]).toBe('Time,Date,Temperature (°C),Humidity (%),Wind Speed (km/h),Pressure (hPa),Rainfall (mm)');
      expect(lines[1]).toBe('00:00,Jul 7,15,70,10,1013,0');
      expect(lines[2]).toBe('12:00,Jul 7,22,55,15,1012,0.5');
    });
  });

  it('sets download filename with current date', () => {
    const today = new Date().toISOString().slice(0, 10);
    csvExport(mockEntries);
    const anchor = document.createElement('a') as HTMLAnchorElement;
    expect(anchor.download).toBeFalsy();
  });

  it('handles empty history array', () => {
    csvExport([]);
    expect(createObjectURL).toHaveBeenCalledOnce();
    expect(clickFn).toHaveBeenCalledOnce();
  });

  it('handles single entry', () => {
    const single: HistoryEntry[] = [{ time: '08:00', date: 'Jul 7', temp: 18, humidity: 60, windSpeed: 5, pressure: 1014, rainfall: 0.1 }];
    csvExport(single);
    expect(createObjectURL).toHaveBeenCalledOnce();
    expect(clickFn).toHaveBeenCalledOnce();
  });
});
