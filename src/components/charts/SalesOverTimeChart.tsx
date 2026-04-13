import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import type { ChartDataPoint, DashboardFilters } from '../../data/types';
import type { SeriesConfig } from '../../utils/dataTransform';
import { ChartTooltip } from './ChartTooltip';
import { formatCurrency, formatNumber } from '../../utils/formatters';

interface Props {
  data: ChartDataPoint[];
  seriesConfigs: SeriesConfig[];
  filters: DashboardFilters;
}

export function SalesOverTimeChart({ data, seriesConfigs, filters }: Props) {
  const { metric, selectedPassTypes, selectedYears } = filters;
  const isStacked = selectedYears.length === 1 && selectedPassTypes.length > 1;

  if (data.length === 0 || seriesConfigs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-slate-400">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="mb-3 opacity-40">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
        </svg>
        <p className="text-sm font-medium">No data to display</p>
        <p className="text-xs mt-1">Select at least one pass type and year</p>
      </div>
    );
  }

  const yFormatter = metric === 'revenue'
    ? (v: number) => formatCurrency(v)
    : (v: number) => formatNumber(v);

  const legendFormatter = (value: string) => {
    const config = seriesConfigs.find(c => c.key === value);
    return config?.label ?? value;
  };

  return (
    <ResponsiveContainer width="100%" height={320}>
      <ComposedChart data={data} margin={{ top: 4, right: 16, left: 8, bottom: 4 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
        <XAxis
          dataKey="displayDate"
          tick={{ fontSize: 11, fill: '#94a3b8' }}
          tickLine={false}
          axisLine={false}
          interval="preserveStartEnd"
          minTickGap={40}
        />
        <YAxis
          tickFormatter={yFormatter}
          tick={{ fontSize: 11, fill: '#94a3b8' }}
          tickLine={false}
          axisLine={false}
          width={56}
        />
        <Tooltip
          content={<ChartTooltip metric={metric} seriesConfigs={seriesConfigs} />}
          cursor={{ stroke: '#e2e8f0', strokeWidth: 1 }}
        />
        <Legend
          formatter={legendFormatter}
          iconType="plainline"
          wrapperStyle={{ fontSize: '12px', paddingTop: '12px' }}
        />

        {seriesConfigs.map((config) =>
          isStacked ? (
            <Area
              key={config.key}
              type="monotone"
              dataKey={config.key}
              name={config.key}
              stackId={config.stack}
              stroke={config.color}
              fill={config.color}
              fillOpacity={0.25}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0 }}
            />
          ) : (
            <Line
              key={config.key}
              type="monotone"
              dataKey={config.key}
              name={config.key}
              stroke={config.color}
              strokeWidth={2}
              strokeDasharray={config.strokeDash === '0' ? undefined : config.strokeDash}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0, fill: config.color }}
            />
          )
        )}
      </ComposedChart>
    </ResponsiveContainer>
  );
}
