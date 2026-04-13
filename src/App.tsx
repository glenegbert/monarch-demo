import { useDashboardState } from './hooks/useDashboardState';
import { useFilteredData } from './hooks/useFilteredData';
import { Header } from './components/layout/Header';
import { DateRangePicker } from './components/controls/DateRangePicker';
import { PassTypeSelector } from './components/controls/PassTypeSelector';
import { YearOverlaySelector } from './components/controls/YearOverlaySelector';
import { VolumeRevenueToggle } from './components/controls/VolumeRevenueToggle';
import { KpiRow } from './components/cards/KpiRow';
import { SalesOverTimeChart } from './components/charts/SalesOverTimeChart';
import { PassTypePieChart } from './components/charts/PassTypePieChart';

export default function App() {
  const {
    filters,
    setDateRange,
    togglePassType,
    toggleYear,
    setMetric,
    selectAllPassTypes,
    clearPassTypes,
  } = useDashboardState();

  const { chartData, seriesConfigs, pieData, kpis } = useFilteredData(filters);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />

      <main className="flex-1 p-6 flex gap-6 max-w-screen-2xl mx-auto w-full">
        {/* Sidebar: filters */}
        <aside className="w-72 flex-shrink-0">
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 flex flex-col gap-6 sticky top-6">
            <VolumeRevenueToggle metric={filters.metric} onChange={setMetric} />

            <div className="h-px bg-slate-100" />

            <DateRangePicker dateRange={filters.dateRange} onChange={setDateRange} />

            <div className="h-px bg-slate-100" />

            <PassTypeSelector
              selected={filters.selectedPassTypes}
              onToggle={togglePassType}
              onSelectAll={selectAllPassTypes}
              onClear={clearPassTypes}
            />

            <div className="h-px bg-slate-100" />

            <YearOverlaySelector
              selectedYears={filters.selectedYears}
              onToggle={toggleYear}
            />
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 min-w-0 flex flex-col gap-5">
          {/* KPI Row */}
          <KpiRow kpis={kpis} metric={filters.metric} />

          {/* Main chart */}
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-semibold text-slate-900">
                  {filters.metric === 'volume' ? 'Passes Sold Over Time' : 'Revenue Over Time'}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  {filters.selectedYears.length > 1
                    ? `Comparing ${filters.selectedYears.join(', ')}`
                    : `${filters.selectedYears[0] ?? '—'} season`}
                </p>
              </div>
              {filters.selectedYears.length > 1 && (
                <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-50 border border-slate-100 rounded-lg px-3 py-1.5">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M12 8v4l3 3"/>
                  </svg>
                  Year overlay active
                </div>
              )}
            </div>
            <SalesOverTimeChart data={chartData} seriesConfigs={seriesConfigs} filters={filters} />
          </div>

          {/* Bottom row: pie chart + info card */}
          <div className="grid grid-cols-2 gap-5">
            <PassTypePieChart data={pieData} metric={filters.metric} />

            {/* Season info card */}
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
                  Season Overview
                </h3>
                <div className="space-y-3">
                  <InfoRow label="Season opens" value="Mid-November 2025" />
                  <InfoRow label="Off-season window" value="Apr 1 – Oct 31" />
                  <InfoRow label="Pass options" value="4 types available" />
                  <InfoRow label="Pricing range" value="$299 – $999" />
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-50">
                <p className="text-xs text-slate-400 leading-relaxed">
                  Early-season pass sales are a key revenue predictor. Off-season pricing incentivizes advance purchases before the November season opener.
                </p>
              </div>

              {/* Mountain decoration */}
              <div className="mt-4 flex justify-end opacity-10">
                <svg width="80" height="50" viewBox="0 0 100 62" fill="none">
                  <polygon points="50,4 96,58 4,58" fill="#0f172a"/>
                  <polygon points="30,30 60,58 0,58" fill="#0f172a"/>
                  <polygon points="80,38 100,58 60,58" fill="#0f172a"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-slate-500">{label}</span>
      <span className="text-xs font-semibold text-slate-700">{value}</span>
    </div>
  );
}
