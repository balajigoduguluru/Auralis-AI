import { describe, it, expect } from 'vitest';

function calculateRisk(temp: number, windSpeed: number, precipitation: number): 'HIGH' | 'MODERATE' | 'LOW' {
  if (temp > 38 || windSpeed > 60 || precipitation > 50) return 'HIGH';
  if (temp > 30 || windSpeed > 40) return 'MODERATE';
  return 'LOW';
}

describe('calculateRisk', () => {
  it('returns HIGH when temp exceeds 38', () => {
    expect(calculateRisk(39, 10, 0)).toBe('HIGH');
  });

  it('returns HIGH when windSpeed exceeds 60', () => {
    expect(calculateRisk(20, 70, 0)).toBe('HIGH');
  });

  it('returns HIGH when precipitation exceeds 50', () => {
    expect(calculateRisk(20, 10, 60)).toBe('HIGH');
  });

  it('returns MODERATE when temp exceeds 30', () => {
    expect(calculateRisk(32, 20, 0)).toBe('MODERATE');
  });

  it('returns MODERATE when windSpeed exceeds 40', () => {
    expect(calculateRisk(25, 50, 0)).toBe('MODERATE');
  });

  it('returns LOW for normal conditions', () => {
    expect(calculateRisk(20, 10, 5)).toBe('LOW');
  });
});
