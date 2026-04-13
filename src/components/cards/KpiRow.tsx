import { KpiCard } from './KpiCard';
import type { KpiSummary } from '../../data/types';
import type { Metric } from '../../data/types';
import { PASS_TYPE_LABELS } from '../../data/constants';
import { formatCurrency, formatDate, formatNumber } from '../../utils/formatters';

interface Props {
  kpis: KpiSummary;
  metric: Metric;
}

export function KpiRow({ kpis, metric }: Props) {
  const totalValue = metric === 'volume'
    ? formatNumber(kpis.totalUnits) + ' passes'
    : formatCurrency(kpis.totalRevenue);

  const bestDayValue = metric === 'volume'
    ? formatNumber(kpis.bestDay.value)
    : formatCurrency(kpis.bestDay.value);

  return (
    <div className="grid grid-cols-4 gap-4">
      <KpiCard
        label={metric === 'volume' ? 'Total Passes Sold' : 'Total Revenue'}
        value={totalValue}
        subtext="Across selected filters"
        trend={kpis.yoyChange}
        icon={
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="2" y="7" width="20" height="14" rx="2"/>
            <path d="M16 7V5a2 2 0 0 0-4 0v2"/>
            <path d="M8 7V5a2 2 0 0 0-4 0v2"/>
          </svg>
        }
      />
      <KpiCard
        label="Best Single Day"
        value={bestDayValue}
        subtext={kpis.bestDay.date ? formatDate(kpis.bestDay.date) : '—'}
        icon={
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        }
      />
      <KpiCard
        label="Top Pass Type"
        value={PASS_TYPE_LABELS[kpis.topPassType]}
        subtext="Most units in period"
        icon={
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
        }
      />
      <KpiCard
        label="YoY Change"
        value={kpis.yoyChange !== null ? `${kpis.yoyChange >= 0 ? '+' : ''}${kpis.yoyChange.toFixed(1)}%` : '—'}
        subtext={kpis.yoyChange !== null ? 'vs. prior selected year' : 'Select 2+ years to compare'}
        trend={kpis.yoyChange}
        icon={
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/>
            <polyline points="16 7 22 7 22 13"/>
          </svg>
        }
      />
    </div>
  );
}
