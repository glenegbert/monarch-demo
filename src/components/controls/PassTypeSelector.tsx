import { PASS_TYPE_COLORS, PASS_TYPE_LABELS, PASS_TYPES } from '../../data/constants';
import type { PassType } from '../../data/types';

interface Props {
  selected: PassType[];
  onToggle: (pt: PassType) => void;
  onSelectAll: () => void;
  onClear: () => void;
}

export function PassTypeSelector({ selected, onToggle, onSelectAll, onClear }: Props) {
  const allSelected = selected.length === PASS_TYPES.length;

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Pass Type</p>
        <button
          className="text-xs text-sky-500 hover:text-sky-700 font-medium"
          onClick={allSelected ? onClear : onSelectAll}
        >
          {allSelected ? 'Clear all' : 'Select all'}
        </button>
      </div>
      <div className="flex flex-col gap-2">
        {PASS_TYPES.map((pt) => {
          const active = selected.includes(pt);
          const color = PASS_TYPE_COLORS[pt];
          return (
            <button
              key={pt}
              onClick={() => onToggle(pt)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-all ${
                active
                  ? 'border-transparent text-white shadow-sm'
                  : 'border-slate-200 text-slate-500 bg-white hover:border-slate-300'
              }`}
              style={active ? { backgroundColor: color, borderColor: color } : {}}
            >
              <span
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: active ? 'rgba(255,255,255,0.7)' : color }}
              />
              {PASS_TYPE_LABELS[pt]}
              {pt === 'wings' && (
                <span className={`ml-auto text-xs px-1.5 py-0.5 rounded font-semibold ${active ? 'bg-white/20 text-white' : 'bg-orange-50 text-orange-600'}`}>
                  Premium
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
