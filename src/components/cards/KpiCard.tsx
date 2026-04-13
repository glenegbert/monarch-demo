interface Props {
  label: string;
  value: string;
  subtext?: string;
  trend?: number | null; // positive = up, negative = down, null = no trend
  icon: React.ReactNode;
}

export function KpiCard({ label, value, subtext, trend, icon }: Props) {
  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{label}</span>
        <span className="text-slate-300">{icon}</span>
      </div>
      <div className="flex items-end gap-2">
        <span className="text-2xl font-bold text-slate-900 leading-none">{value}</span>
        {trend !== null && trend !== undefined && (
          <span className={`text-sm font-semibold mb-0.5 flex items-center gap-0.5 ${trend >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
            {trend >= 0 ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="18 15 12 9 6 15"/>
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            )}
            {Math.abs(trend).toFixed(1)}%
          </span>
        )}
      </div>
      {subtext && <p className="text-xs text-slate-400">{subtext}</p>}
    </div>
  );
}
