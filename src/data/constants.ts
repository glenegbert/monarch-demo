import type { PassType } from './types';

export const PASS_TYPES: PassType[] = ['adults', 'kids', 'seniors', 'wings'];

export const PASS_TYPE_LABELS: Record<PassType, string> = {
  adults: 'Adult',
  kids: 'Kids',
  seniors: 'Senior',
  wings: 'Wings Pass',
};

export const PRICE_MAP: Record<PassType, number> = {
  kids: 299,
  seniors: 499,
  adults: 699,
  wings: 999,
};

export const YEARS = [2023, 2024, 2025, 2026];

export const YEAR_COLORS: Record<number, string> = {
  2026: '#a855f7',
  2025: '#3b82f6',
  2024: '#f59e0b',
  2023: '#10b981',
};

export const YEAR_STROKE_DASH: Record<number, string> = {
  2026: '0',
  2025: '5 3',
  2024: '2 3',
  2023: '8 3',
};

export const PASS_TYPE_COLORS: Record<PassType, string> = {
  adults: '#6366f1',
  kids: '#ec4899',
  seniors: '#14b8a6',
  wings: '#f97316',
};
