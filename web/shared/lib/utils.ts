import type { ClassValue } from 'clsx';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface StatusThreshold {
  min?: number;
  max?: number;
  className: string;
}

/**
 * Returns a CSS class name based on a numeric value and threshold configuration.
 * Thresholds are evaluated in order - first match wins.
 */
export function getStatusColor(value: number, thresholds: StatusThreshold[]): string | undefined {
  for (const threshold of thresholds) {
    const meetsMin = threshold.min === undefined || value >= threshold.min;
    const meetsMax = threshold.max === undefined || value < threshold.max;
    if (meetsMin && meetsMax) {
      return threshold.className;
    }
  }
  return undefined;
}
