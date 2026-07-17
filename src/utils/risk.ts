import { RISK_THRESHOLDS } from '../config/constants';
import type { Prediction } from '../types';

/**
 * Calculates environmental risk level based on temperature, wind speed, and precipitation.
 * Uses thresholds from RISK_THRESHOLDS in config/constants.
 */
export function calculateRisk(temp: number, windSpeed: number, precipitation: number): 'HIGH' | 'MODERATE' | 'LOW' {
  if (temp > RISK_THRESHOLDS.HIGH.temp || windSpeed > RISK_THRESHOLDS.HIGH.windSpeed || precipitation > RISK_THRESHOLDS.HIGH.precipitation) return 'HIGH';
  if (temp > RISK_THRESHOLDS.MODERATE.temp || windSpeed > RISK_THRESHOLDS.MODERATE.windSpeed) return 'MODERATE';
  return 'LOW';
}

/**
 * Generates 4-step timeline predictions based on current risk level.
 * Each prediction has a time offset, risk level, and descriptive label.
 */
export function generatePredictions(risk: 'HIGH' | 'MODERATE' | 'LOW'): Prediction[] {
  const risks: ('HIGH' | 'MODERATE' | 'LOW')[] = ['LOW', 'MODERATE', 'HIGH'];
  return [
    { time: '+4h', risk: risk === 'HIGH' ? risks[Math.floor(Math.random() * 3)] : risks[Math.floor(Math.random() * 2)], label: risk === 'HIGH' ? 'Monitoring' : 'Normalizing' },
    { time: '+8h', risk: risks[Math.floor(Math.random() * 2)], label: 'Stabilizing' },
    { time: '+12h', risk: risks[Math.floor(Math.random() * 3)], label: 'Projected' },
    { time: '+24h', risk: risks[0], label: 'Clearance' },
  ];
}
