import React from 'react';
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { BarChart3 } from 'lucide-react';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const kumulatifPct = (data.kumulatif_pct * 100).toFixed(2);
    const kontribusiPct = (data.kontribusi_pct * 100).toFixed(2);

    return (
      <div className="bg-slate-900 border border-slate-700/90 p-2.5 sm:p-3 rounded-lg shadow-xl text-xs max-w-[240px] sm:max-w-none">
        <div className="font-semibold text-slate-100 mb-1.5 flex items-center justify-between gap-2 border-b border-slate-800 pb-1.5">
          <span className="font-mono text-white text-[11px] sm:text-xs">StockCode: {label}</span>
          <span className={`px-1.5 py-0.5 rounded text-[9px] sm:text-[10px] font-medium ${
            data.kategori_abc?.includes('Kelas A') ? 'bg-rose-500/10 text-rose-300 border border-rose-500/20' :
            data.kategori_abc?.includes('Kelas B') ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20' :
            'bg-cyan-500/10 text-cyan-300 border border-cyan-500/20'
          }`}>
            {data.kategori_abc}
          </span>
        </div>
        <div className="space-y-1 text-slate-300 mt-1 text-[11px] sm:text-xs">
          <div className="flex justify-between gap-3">
            <span className="text-slate-400">Demand:</span>
            <span className="font-semibold font-mono text-emerald-400">{data.demand.toLocaleString('id-ID')} unit</span>
          </div>
          <div className="flex justify-between gap-3">
            <span className="text-slate-400">Kontribusi:</span>
            <span className="font-mono text-indigo-300">{kontribusiPct}%</span>
          </div>
          <div className="flex justify-between gap-3">
            <span className="text-slate-400">Kumulatif:</span>
            <span className="font-mono text-amber-300">{kumulatifPct}%</span>
          </div>
          <div className="flex justify-between gap-3 pt-1 border-t border-slate-800/80">
            <span className="text-slate-400">Safety Stock:</span>
            <span className="font-semibold font-mono text-purple-300">{data.safety_stock} unit</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export default function ParetoChart({ data, loading }) {
  if (loading) {
    return (
      <div className="saas-card p-4 sm:p-5 rounded-xl h-[320px] sm:h-[380px] lg:h-[400px] flex flex-col justify-between animate-pulse">
        <div className="w-1/3 h-5 bg-slate-800 rounded"></div>
        <div className="w-full h-60 sm:h-72 bg-slate-800/50 rounded"></div>
      </div>
    );
  }

  const chartData = (data || []).map((item) => ({
    ...item,
    kumulatif_scaled: Number((item.kumulatif_pct * 100).toFixed(2))
  }));

  return (
    <div className="saas-card p-4 sm:p-5 rounded-xl flex flex-col h-[320px] sm:h-[380px] lg:h-[400px]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2 sm:mb-3">
        <div>
          <h2 className="text-xs sm:text-sm font-semibold text-white flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-indigo-400 flex-shrink-0" />
            Kurva Pareto & Demand Top 40 SKU
          </h2>
          <p className="text-[11px] sm:text-xs text-slate-400">
            Analisis Kumulatif Volume Demand (Hukum 80/20 ABC Analysis)
          </p>
        </div>
        <div className="flex items-center space-x-3 text-xs self-start sm:self-auto">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-indigo-500 inline-block"></span>
            <span className="text-slate-300 text-[10px] sm:text-[11px]">Demand</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-amber-400 inline-block"></span>
            <span className="text-slate-300 text-[10px] sm:text-[11px]">Kumulatif %</span>
          </div>
        </div>
      </div>

      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={chartData}
            margin={{ top: 10, right: 0, left: -15, bottom: 15 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis
              dataKey="stock_code"
              stroke="#64748b"
              fontSize={9}
              tickLine={false}
              axisLine={{ stroke: '#334155' }}
              interval="preserveStartEnd"
              angle={-45}
              textAnchor="end"
            />
            <YAxis
              yAxisId="left"
              orientation="left"
              stroke="#64748b"
              fontSize={10}
              tickLine={false}
              axisLine={{ stroke: '#334155' }}
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="#64748b"
              fontSize={10}
              domain={[0, 100]}
              tickLine={false}
              axisLine={{ stroke: '#334155' }}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine
              yAxisId="right"
              y={80}
              label={{
                value: '80% Pareto',
                fill: '#f43f5e',
                fontSize: 9,
                position: 'insideTopLeft'
              }}
              stroke="#f43f5e"
              strokeDasharray="3 3"
            />
            <Bar
              yAxisId="left"
              dataKey="demand"
              fill="#6366f1"
              radius={[3, 3, 0, 0]}
              maxBarSize={24}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="kumulatif_scaled"
              stroke="#f59e0b"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: '#f59e0b' }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
