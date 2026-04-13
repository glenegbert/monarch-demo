import { YEARS, YEAR_COLORS, YEAR_STROKE_DASH } from '../../data/constants';

interface Props {
  selectedYears: number[];
  onToggle: (year: number) => void;
}

export function YearOverlaySelector({ selectedYears, onToggle }: Props) {
  return (
    <div>
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
        Year Overlay
      </p>
      <div className="flex flex-col gap-2">
        {[...YEARS].reverse().map((year) => {
          const active = selectedYears.includes(year);
          const color = YEAR_COLORS[year];
          return (
            <label
              key={year}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg border cursor-pointer transition-all ${
                active ? 'border-slate-200 bg-slate-50' : 'border-slate-100 bg-white opacity-60 hover:opacity-80'
              }`}
            >
              <input
                type="checkbox"
                checked={active}
                onChange={() => onToggle(year)}
                className="sr-only"
              />
              {/* Custom checkbox */}
              <span
                className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 border-2 transition-all`}
                style={{
                  backgroundColor: active ? color : 'transparent',
                  borderColor: color,
                }}
              >
                {active && (
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </span>
              {/* Year label with color indicator */}
              <span className="text-sm font-semibold text-slate-700">{year}</span>
              {/* Line style preview */}
              <span className="ml-auto flex items-center">
                <svg width="32" height="4" viewBox="0 0 32 4">
                  <line
                    x1="0" y1="2" x2="32" y2="2"
                    stroke={color} strokeWidth="2"
                    strokeDasharray={YEAR_STROKE_DASH[year] === '0' ? undefined : YEAR_STROKE_DASH[year]}
                  />
                </svg>
              </span>
              {year === 2026 && (
                <span className="text-xs text-purple-500 font-semibold">Current</span>
              )}
            </label>
          );
        })}
      </div>
      {selectedYears.length === 0 && (
        <p className="text-xs text-red-500 mt-2">Select at least one year</p>
      )}
    </div>
  );
}
