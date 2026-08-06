import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { PieChart as PieIcon } from 'lucide-react';

const COLORS = ['#f43f5e', '#f59e0b', '#06b6d4'];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-900 border border-slate-700/90 p-2.5 sm:p-3 rounded-lg shadow-xl text-xs max-w-[240px] sm:max-w-none">
        <div className="font-semibold text-white mb-1.5 border-b border-slate-800 pb-1 text-[11px] sm:text-xs">{data.category}</div>
        <div className="space-y-1 text-slate-300 text-[11px] sm:text-xs">
          <div className="flex justify-between gap-3">
            <span className="text-slate-400">Jumlah SKU:</span>
            <span className="font-medium font-mono text-white">{data.sku_count} ({data.percentage_sku}%)</span>
          </div>
          <div className="flex justify-between gap-3">
            <span className="text-slate-400">Volume Demand:</span>
            <span className="font-medium font-mono text-emerald-400">{data.total_demand.toLocaleString('id-ID')} unit ({data.percentage_demand}%)</span>
          </div>
          <div className="flex justify-between gap-3">
            <span className="text-slate-400">Safety Stock:</span>
            <span className="font-medium font-mono text-purple-300">{data.total_safety_stock.toLocaleString('id-ID')} unit</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export default function AbcDonutChart({ data, loading }) {
  if (loading) {
    return (
      <div className="saas-card p-4 sm:p-5 rounded-xl h-[300px] sm:h-[340px] flex items-center justify-center animate-pulse">
        <div className="w-32 sm:w-36 h-32 sm:h-36 rounded-full bg-slate-800"></div>
      </div>
    );
  }

  const distribution = data?.distribution || [];

  return (
    <div className="saas-card p-4 sm:p-5 rounded-xl flex flex-col justify-between h-[300px] sm:h-[340px]">
      <div>
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-xs sm:text-sm font-semibold text-white flex items-center gap-2">
            <PieIcon className="w-4 h-4 text-rose-400 flex-shrink-0" />
            Distribusi SKU & Volume Per Kelas
          </h2>
          <span className="text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">
            Kategori ABC
          </span>
        </div>
        <p className="text-[11px] sm:text-xs text-slate-400 mb-2">
          Proporsi Fast (A), Medium (B), dan Slow (C).
        </p>

        <div className="h-[140px] sm:h-[170px] w-full relative flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={distribution}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={62}
                paddingAngle={3}
                dataKey="total_demand"
                nameKey="category"
              >
                {distribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="#0d121f" strokeWidth={2} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-1.5 sm:gap-2 pt-2 border-t border-slate-800 text-center">
        {distribution.map((item, idx) => (
          <div key={idx} className="bg-slate-900/60 p-1.5 rounded border border-slate-800">
            <div className="text-[9px] sm:text-[10px] font-medium text-slate-400 truncate">{item.category.split(' ')[0]} {item.category.split(' ')[1]}</div>
            <div className="text-[11px] sm:text-xs font-bold font-mono text-slate-200">{item.percentage_demand}% Vol</div>
            <div className="text-[9px] text-slate-400 font-mono">{item.sku_count} SKU</div>
          </div>
        ))}
      </div>
    </div>
  );
}
