import type { Metric } from '../../data/types';

interface Props {
  metric: Metric;
  onChange: (m: Metric) => void;
}

export function VolumeRevenueToggle({ metric, onChange }: Props) {
  return (
    <div>
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">View</p>
      <div className="flex bg-slate-100 rounded-lg p-1 gap-1">
        <button
          className={`flex-1 py-1.5 px-3 rounded-md text-sm font-medium transition-all ${
            metric === 'volume'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-500 hover:text-slate-700'
          }`}
          onClick={() => onChange('volume')}
        >
          Volume
        </button>
        <button
          className={`flex-1 py-1.5 px-3 rounded-md text-sm font-medium transition-all ${
            metric === 'revenue'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-500 hover:text-slate-700'
          }`}
          onClick={() => onChange('revenue')}
        >
          Revenue
        </button>
      </div>
    </div>
  );
}
