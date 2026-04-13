import { isWithinInterval, parseISO, format } from 'date-fns';
import { PASS_TYPE_COLORS, PASS_TYPE_LABELS, YEAR_COLORS, YEAR_STROKE_DASH } from '../data/constants';
import type { ChartDataPoint, DailySalesRecord, DashboardFilters, KpiSummary, PassType, PieDataPoint } from '../data/types';

export function filterRecords(
  records: DailySalesRecord[],
  filters: DashboardFilters
): DailySalesRecord[] {
  const { dateRange, selectedPassTypes, selectedYears } = filters;
  const [start, end] = dateRange;

  return records.filter((r) => {
    if (!selectedPassTypes.includes(r.passType)) return false;
    if (!selectedYears.includes(r.year)) return false;
    // Compare month-day only (for cross-year overlay, filter by month+day range)
    const rDate = parseISO(r.date);
    const rMD = new Date(2000, rDate.getMonth(), rDate.getDate());
    const startMD = new Date(2000, start.getMonth(), start.getDate());
    const endMD = new Date(2000, end.getMonth(), end.getDate());
    return isWithinInterval(rMD, { start: startMD, end: endMD });
  });
}

/**
 * Builds chart data array where each entry is one day (month-day key),
 * with dynamic series keys like "2025_adults", "2024_total", etc.
 *
 * If multiple pass types: one series per year (sum across types).
 * If single pass type + multiple years: one series per year.
 */
export function buildChartSeries(
  filtered: DailySalesRecord[],
  filters: DashboardFilters
): ChartDataPoint[] {
  const { selectedYears, selectedPassTypes, metric } = filters;

  // Group by dateKey (MM-dd) then by series key
  const dayMap = new Map<string, ChartDataPoint>();

  for (const r of filtered) {
    const rDate = parseISO(r.date);
    const dateKey = format(rDate, 'MM-dd');
    const displayDate = format(rDate, 'MMM d');

    if (!dayMap.has(dateKey)) {
      dayMap.set(dateKey, { dateKey, displayDate });
    }

    const point = dayMap.get(dateKey)!;

    // When single pass type selected, show one line per year with pass type color
    // When multiple pass types, show stacked areas per pass type (for single year)
    // or one aggregated line per year (for multiple years)

    if (selectedYears.length === 1 && selectedPassTypes.length > 1) {
      // Stacked by pass type
      const key = `${r.year}_${r.passType}`;
      const val = metric === 'volume' ? r.unitsSold : r.revenue;
      point[key] = ((point[key] as number) || 0) + val;
    } else {
      // One series per year (aggregate across selected pass types)
      const key = `year_${r.year}`;
      const val = metric === 'volume' ? r.unitsSold : r.revenue;
      point[key] = ((point[key] as number) || 0) + val;
    }
  }

  // Sort by dateKey
  return Array.from(dayMap.values()).sort((a, b) => a.dateKey.localeCompare(b.dateKey));
}

export interface SeriesConfig {
  key: string;
  label: string;
  color: string;
  strokeDash: string;
  stack?: string;
}

export function buildSeriesConfigs(filters: DashboardFilters): SeriesConfig[] {
  const { selectedYears, selectedPassTypes } = filters;
  const configs: SeriesConfig[] = [];

  if (selectedYears.length === 1 && selectedPassTypes.length > 1) {
    const year = selectedYears[0];
    for (const pt of selectedPassTypes) {
      configs.push({
        key: `${year}_${pt}`,
        label: PASS_TYPE_LABELS[pt as PassType],
        color: PASS_TYPE_COLORS[pt as PassType],
        strokeDash: '0',
        stack: 'stack',
      });
    }
  } else {
    for (const year of selectedYears) {
      configs.push({
        key: `year_${year}`,
        label: `${year}`,
        color: YEAR_COLORS[year],
        strokeDash: YEAR_STROKE_DASH[year] ?? '0',
      });
    }
  }

  return configs;
}

export function buildPieData(
  filtered: DailySalesRecord[],
  metric: DashboardFilters['metric']
): PieDataPoint[] {
  const totals = new Map<PassType, number>();

  for (const r of filtered) {
    const val = metric === 'volume' ? r.unitsSold : r.revenue;
    totals.set(r.passType, (totals.get(r.passType) ?? 0) + val);
  }

  return Array.from(totals.entries()).map(([pt, value]) => ({
    name: PASS_TYPE_LABELS[pt],
    passType: pt,
    value,
    color: PASS_TYPE_COLORS[pt],
  }));
}

export function computeKpis(
  filtered: DailySalesRecord[],
  allFiltered: DailySalesRecord[],
  filters: DashboardFilters
): KpiSummary {
  let totalUnits = 0;
  let totalRevenue = 0;
  const dayUnits = new Map<string, number>();
  const dayRevenue = new Map<string, number>();
  const typeUnits = new Map<PassType, number>();

  // Only use primary year (latest selected) for best-day / top-type
  const primaryYear = Math.max(...filters.selectedYears);

  for (const r of filtered) {
    totalUnits += r.unitsSold;
    totalRevenue += r.revenue;

    if (r.year === primaryYear) {
      dayUnits.set(r.date, (dayUnits.get(r.date) ?? 0) + r.unitsSold);
      dayRevenue.set(r.date, (dayRevenue.get(r.date) ?? 0) + r.revenue);
      typeUnits.set(r.passType, (typeUnits.get(r.passType) ?? 0) + r.unitsSold);
    }
  }

  // Best single day
  const dayMap = filters.metric === 'volume' ? dayUnits : dayRevenue;
  let bestDate = '';
  let bestVal = 0;
  for (const [date, val] of dayMap) {
    if (val > bestVal) { bestVal = val; bestDate = date; }
  }

  // Top pass type
  let topPassType: PassType = 'adults';
  let topTypeUnits = 0;
  for (const [pt, units] of typeUnits) {
    if (units > topTypeUnits) { topTypeUnits = units; topPassType = pt; }
  }

  // YoY change: compare two most recent selected years
  let yoyChange: number | null = null;
  const sortedYears = [...filters.selectedYears].sort((a, b) => b - a);
  if (sortedYears.length === 2) {
    const curYear = sortedYears[0];
    const prevYear = sortedYears[1];
    const curVal = allFiltered
      .filter(r => r.year === curYear)
      .reduce((s, r) => s + (filters.metric === 'volume' ? r.unitsSold : r.revenue), 0);
    const prevVal = allFiltered
      .filter(r => r.year === prevYear)
      .reduce((s, r) => s + (filters.metric === 'volume' ? r.unitsSold : r.revenue), 0);
    if (prevVal > 0) yoyChange = ((curVal - prevVal) / prevVal) * 100;
  }

  return { totalUnits, totalRevenue, bestDay: { date: bestDate, value: bestVal }, topPassType, yoyChange };
}
