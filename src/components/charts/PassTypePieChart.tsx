import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { PieDataPoint } from '../../data/types';
import type { Metric } from '../../data/types';
import { formatCurrency, formatNumber } from '../../utils/formatters';

interface Props {
  data: PieDataPoint[];
  metric: Metric;
}

interface LabelProps {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
}

function renderCustomLabel({ cx, cy, midAngle, innerRadius, outerRadius, percent }: LabelProps) {
  if (percent < 0.06) return null;
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={600}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
}

export function PassTypePieChart({ data, metric }: Props) {
  if (data.length === 0) return null;

  const total = data.reduce((s, d) => s + d.value, 0);
  const totalLabel = metric === 'revenue' ? formatCurrency(total) : formatNumber(total);
  const totalSub = metric === 'revenue' ? 'Total Revenue' : 'Total Passes';

  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
      <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Pass Type Mix</h3>
      <div className="relative">
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={62}
              outerRadius={90}
              dataKey="value"
              labelLine={false}
              label={renderCustomLabel}
              paddingAngle={2}
            >
              {data.map((entry) => (
                <Cell key={entry.passType} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number, name: string) => [
                metric === 'revenue' ? formatCurrency(value) : `${formatNumber(value)} passes`,
                name,
              ]}
              contentStyle={{
                fontSize: '12px',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              }}
            />
            <Legend
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: '11px', paddingTop: '4px' }}
            />
          </PieChart>
        </ResponsiveContainer>
        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none" style={{ top: '-20px' }}>
          <span className="text-lg font-bold text-slate-900 leading-none">{totalLabel}</span>
          <span className="text-xs text-slate-400 mt-1">{totalSub}</span>
        </div>
      </div>
    </div>
  );
}
