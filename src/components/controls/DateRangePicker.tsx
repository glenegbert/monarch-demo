import ReactDatePicker from 'react-datepicker';
import { useState } from 'react';

interface Props {
  dateRange: [Date, Date];
  onChange: (range: [Date, Date]) => void;
}

export function DateRangePicker({ dateRange, onChange }: Props) {
  const [start, end] = dateRange;
  // Local state lets the picker enter its two-click selection mode without
  // immediately snapping the endDate back to the committed value.
  const [localStart, setLocalStart] = useState<Date | null>(start);
  const [localEnd, setLocalEnd] = useState<Date | null>(end);

  function handleChange(dates: [Date | null, Date | null]) {
    const [s, e] = dates;
    setLocalStart(s);
    setLocalEnd(e);
    // Only commit to parent once both ends of the range are chosen
    if (s && e) onChange([s, e]);
  }

  return (
    <div>
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
        Date Range
      </p>
      <ReactDatePicker
        selectsRange
        startDate={localStart}
        endDate={localEnd}
        onChange={handleChange}
        dateFormat="MMM d"
        placeholderText="Select date range"
        isClearable={false}
        monthsShown={1}
      />
      <p className="text-xs text-slate-400 mt-1">Month &amp; day filter — applies across all years</p>
    </div>
  );
}
