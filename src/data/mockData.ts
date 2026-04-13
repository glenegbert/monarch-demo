import { addDays, format, getDayOfYear } from 'date-fns';
import { PRICE_MAP, YEARS } from './constants';
import type { DailySalesRecord, PassType } from './types';

const PASS_TYPES: PassType[] = ['adults', 'kids', 'seniors', 'wings'];

// Base peak daily units per pass type (2023 baseline — peak = early April rush)
const BASE_PEAK: Record<PassType, number> = {
  adults: 22,
  kids: 12,
  seniors: 10,
  wings: 4,
};

// Year-over-year multipliers
const YEAR_MULTIPLIER: Record<number, number> = {
  2023: 1.0,
  2024: 1.08,
  2025: 1.21,
  2026: 0.36, // abysmal low-snow year — rumor spread fast, advance sales cratered
};

// Wings Pass buyers are enthusiasts — they bail hardest on bad snow years
const WINGS_EXTRA: Record<number, number> = {
  2023: 1.0,
  2024: 1.15,
  2025: 1.40,
  2026: 0.45, // Wings buyers spooked by poor conditions
};

// 2026 only has data through today (April 13)
const YEAR_END_OVERRIDE: Record<number, Date | null> = {
  2023: null,
  2024: null,
  2025: null,
  2026: new Date(2026, 3, 13),
};

/**
 * Full year-round seasonal curve for a ski resort season pass.
 * Returns 0–1 where 1 = peak daily sales volume.
 *
 * Approximate day-of-year landmarks:
 *   Jan=1, Feb=32, Mar=60, Apr=91, May=121, Jun=152,
 *   Jul=182, Aug=213, Sep=244, Oct=274, Nov=305, Dec=335
 */
function seasonalCurve(doy: number): number {
  // Piecewise linear interpolation between anchor points
  const anchors: [number, number][] = [
    [1,   0.05],  // Jan 1  — deep season, almost no new sales
    [31,  0.04],  // Jan 31
    [59,  0.04],  // Feb 28
    [90,  0.07],  // Mar 31 — late-season renewal nudge
    [96,  0.85],  // Apr 6  — season just ended: early-bird rush PEAK
    [105, 0.55],  // Apr 15 — rush fading
    [120, 0.30],  // Apr 30
    [151, 0.20],  // May 31
    [181, 0.13],  // Jun 30 — summer doldrums begin
    [212, 0.10],  // Jul 31 — trough
    [243, 0.16],  // Aug 31 — awareness picks up
    [273, 0.38],  // Sep 30 — pre-season ramp
    [304, 0.62],  // Oct 31 — surge
    [319, 0.80],  // Nov 15 — season opens, deadline buyers flood in
    [334, 0.55],  // Nov 30 — season open, last-minute stragglers
    [350, 0.12],  // Dec 16 — season well underway, sales taper off
    [365, 0.06],  // Dec 31
  ];

  // Clamp
  if (doy <= anchors[0][0]) return anchors[0][1];
  if (doy >= anchors[anchors.length - 1][0]) return anchors[anchors.length - 1][1];

  // Find surrounding segment and lerp
  for (let i = 0; i < anchors.length - 1; i++) {
    const [d0, v0] = anchors[i];
    const [d1, v1] = anchors[i + 1];
    if (doy >= d0 && doy <= d1) {
      const t = (doy - d0) / (d1 - d0);
      return v0 + t * (v1 - v0);
    }
  }

  return 0;
}

// Seeded pseudo-random for reproducible noise
function seededRandom(seed: number): number {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

export function generateMockData(): DailySalesRecord[] {
  const records: DailySalesRecord[] = [];

  for (const year of YEARS) {
    const yearStart = new Date(year, 0, 1);  // Jan 1
    const yearEnd = YEAR_END_OVERRIDE[year] ?? new Date(year, 11, 31); // Dec 31
    let current = yearStart;

    while (current <= yearEnd) {
      const doy = getDayOfYear(current);
      const dateStr = format(current, 'yyyy-MM-dd');
      const curve = seasonalCurve(doy);

      for (const passType of PASS_TYPES) {
        const basePeak = BASE_PEAK[passType];
        const yearMult = YEAR_MULTIPLIER[year];
        const wingsMult = passType === 'wings' ? WINGS_EXTRA[year] : 1;
        const noise = 0.80 + seededRandom(doy * 7 + year * 3 + PASS_TYPES.indexOf(passType) * 17) * 0.40;

        const rawUnits = basePeak * yearMult * wingsMult * curve * noise;
        const unitsSold = Math.max(0, Math.round(rawUnits));
        const revenue = unitsSold * PRICE_MAP[passType];

        records.push({ date: dateStr, year, passType, unitsSold, revenue });
      }

      current = addDays(current, 1);
    }
  }

  return records;
}

// Generate once at module load
export const ALL_RECORDS: DailySalesRecord[] = generateMockData();
