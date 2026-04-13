export type PassType = 'kids' | 'seniors' | 'adults' | 'wings';
export type Metric = 'volume' | 'revenue';

export interface DailySalesRecord {
  date: string;       // ISO "2025-04-01"
  year: number;       // 2023 | 2024 | 2025
  passType: PassType;
  unitsSold: number;
  revenue: number;    // pre-computed: unitsSold * price
}

export interface ChartDataPoint {
  // date as "MM-DD" for cross-year overlay alignment
  dateKey: string;
  displayDate: string;
  [seriesKey: string]: number | string;
}

export interface PieDataPoint {
  name: string;
  passType: PassType;
  value: number;
  color: string;
}

export interface KpiSummary {
  totalUnits: number;
  totalRevenue: number;
  bestDay: { date: string; value: number };
  topPassType: PassType;
  yoyChange: number | null;
}

export interface DashboardFilters {
  dateRange: [Date, Date];
  selectedPassTypes: PassType[];
  selectedYears: number[];
  metric: Metric;
}
