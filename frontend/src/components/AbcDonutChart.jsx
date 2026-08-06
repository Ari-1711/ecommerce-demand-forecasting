import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { PieChart as PieIcon } from 'lucide-react';

const COLORS = ['#f43f5e', '#f59e0b', '#06b6d4'];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-900 border border-slate-700/90 p-3 rounded-lg shadow-xl text-xs">
        <div className="font-semibold text-white mb-1.5 border-b border-slate-800 pb-1">{data.category}</div>
        <div className="space-y-1 text-slate-300">
          <div className="flex justify-between gap-4">
            <span className="text-slate-400">Jumlah SKU:</span>
            <span className="font-medium font-mono text-white">{data.sku_count} ({data.percentage_sku}%)</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-slate-400">Volume Demand:</span>
            <span className="font-medium font-mono text-emerald-400">{data.total_demand.toLocaleString('id-ID')} unit ({data.percentage_demand}%)</span>
          </div>
          <div className="flex justify-between gap-4">
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
      <div className="saas-card p-5 rounded-xl h-[320px] flex items-center justify-center animate-pulse">
        <div className="w-36 h-36 rounded-full bg-slate-800"></div>
      </div>
    );
  }

  const distribution = data?.distribution || [];

  return (
    <div className="saas-card p-5 rounded-xl flex flex-col justify-between h-[340px]">
      <div>
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-sm font-semibold text-white flex items-center gap-2">
            <PieIcon className="w-4 h-4 text-rose-400" />
            Distribusi SKU & Volume Per Kelas
          </h2>
          <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
            Kategori ABC
          </span>
        </div>
        <p className="text-xs text-slate-400 mb-2">
          Proporsi Fast (A), Medium (B), dan Slow-Moving (C).
        </p>

        <div className="h-[170px] w-full relative flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={distribution}
                cx="50%"
                cy="50%"
                innerRadius={48}
                outerRadius={70}
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

      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800 text-center">
        {distribution.map((item, idx) => (
          <div key={idx} className="bg-slate-900/60 p-1.5 rounded border border-slate-800">
            <div className="text-[10px] font-medium text-slate-400 truncate">{item.category.split(' ')[0]} {item.category.split(' ')[1]}</div>
            <div className="text-xs font-bold font-mono text-slate-200">{item.percentage_demand}% Vol</div>
            <div className="text-[9px] text-slate-400 font-mono">{item.sku_count} SKU</div>
          </div>
        ))}
      </div>
    </div>
  );
}
