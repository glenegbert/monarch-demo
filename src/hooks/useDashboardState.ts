import { useState } from 'react';
import type { DashboardFilters, Metric, PassType } from '../data/types';
import { PASS_TYPES } from '../data/constants';

function defaultDateRange(): [Date, Date] {
  return [new Date(2026, 0, 1), new Date(2026, 11, 31)]; // Jan 1 – Dec 31
}

export function useDashboardState() {
  const [dateRange, setDateRange] = useState<[Date, Date]>(defaultDateRange);
  const [selectedPassTypes, setSelectedPassTypes] = useState<PassType[]>([...PASS_TYPES]);
  const [selectedYears, setSelectedYears] = useState<number[]>([2026]);
  const [metric, setMetric] = useState<Metric>('volume');

  const filters: DashboardFilters = { dateRange, selectedPassTypes, selectedYears, metric };

  function togglePassType(pt: PassType) {
    setSelectedPassTypes(prev =>
      prev.includes(pt) ? prev.filter(p => p !== pt) : [...prev, pt]
    );
  }

  function toggleYear(year: number) {
    setSelectedYears(prev =>
      prev.includes(year) ? prev.filter(y => y !== year) : [...prev, year].sort((a, b) => b - a)
    );
  }

  function selectAllPassTypes() {
    setSelectedPassTypes([...PASS_TYPES]);
  }

  function clearPassTypes() {
    setSelectedPassTypes([]);
  }

  return {
    filters,
    setDateRange,
    togglePassType,
    toggleYear,
    setMetric,
    selectAllPassTypes,
    clearPassTypes,
  };
}
