import { useMemo } from 'react';
import { ALL_RECORDS } from '../data/mockData';
import type { DashboardFilters } from '../data/types';
import {
  buildChartSeries,
  buildPieData,
  buildSeriesConfigs,
  computeKpis,
  filterRecords,
} from '../utils/dataTransform';

export function useFilteredData(filters: DashboardFilters) {
  return useMemo(() => {
    const filtered = filterRecords(ALL_RECORDS, filters);
    const chartData = buildChartSeries(filtered, filters);
    const seriesConfigs = buildSeriesConfigs(filters);
    const pieData = buildPieData(filtered, filters.metric);
    const kpis = computeKpis(filtered, filtered, filters);

    return { filtered, chartData, seriesConfigs, pieData, kpis };
  }, [filters]);
}
