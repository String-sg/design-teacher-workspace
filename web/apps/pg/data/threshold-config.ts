import type { StatusThreshold } from '~/shared/lib/utils';

// Threshold configurations for student table status colors
// Used with getStatusColor() utility to apply conditional styling

export const overallPercentageThresholds: StatusThreshold[] = [
  { max: 40, className: 'text-red-600' },
  { min: 40, max: 60, className: 'text-amber-600' },
  { min: 60, className: 'text-foreground' },
];

export const offencesThresholds: StatusThreshold[] = [
  { min: 4, className: 'text-red-600' },
  { min: 1, max: 4, className: 'text-amber-600' },
];

export const absencesThresholds: StatusThreshold[] = [
  { min: 15, className: 'text-red-600' },
  { min: 5, max: 15, className: 'text-amber-600' },
];

export const lateComingThresholds: StatusThreshold[] = [
  { min: 10, className: 'text-red-600' },
  { min: 5, max: 10, className: 'text-amber-600' },
];

export const ccaMissedThresholds: StatusThreshold[] = [
  { min: 8, className: 'text-red-600' },
  { min: 3, max: 8, className: 'text-amber-600' },
];

export const riskIndicatorsThresholds: StatusThreshold[] = [
  { min: 4, className: 'text-red-600' },
  { min: 2, max: 4, className: 'text-amber-600' },
];
