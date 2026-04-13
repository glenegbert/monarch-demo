import type { TooltipProps } from 'recharts';
import type { Metric } from '../../data/types';
import type { SeriesConfig } from '../../utils/dataTransform';
import { formatCurrencyFull, formatNumber } from '../../utils/formatters';

interface Props extends TooltipProps<number, string> {
  metric: Metric;
  seriesConfigs: SeriesConfig[];
}

export function ChartTooltip({ active, payload, label, metric, seriesConfigs }: Props) {
  if (!active || !payload || payload.length === 0) return null;

  const configMap = new Map(seriesConfigs.map(c => [c.key, c]));

  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-lg p-3 min-w-[160px]">
      <p className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">{label}</p>
      {payload.map((entry) => {
        const config = configMap.get(entry.dataKey as string);
        const val = entry.value as number;
        const formatted = metric === 'revenue' ? formatCurrencyFull(val) : formatNumber(val) + (val === 1 ? ' pass' : ' passes');
        return (
          <div key={entry.dataKey} className="flex items-center gap-2 py-0.5">
            <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: config?.color ?? entry.color }} />
            <span className="text-xs text-slate-600 flex-1">{config?.label ?? entry.name}</span>
            <span className="text-xs font-semibold text-slate-900">{formatted}</span>
          </div>
        );
      })}
    </div>
  );
}
