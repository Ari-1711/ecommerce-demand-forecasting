import React from 'react';
import { TrendingUp, ShieldCheck, Package, BrainCircuit, Activity } from 'lucide-react';

export default function KpiGrid({ kpis, metrics, loading }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="saas-card p-5 rounded-xl animate-pulse h-32 flex flex-col justify-between">
            <div className="h-3 bg-slate-800 rounded w-1/2"></div>
            <div className="h-7 bg-slate-800 rounded w-3/4"></div>
            <div className="h-3 bg-slate-800 rounded w-1/3"></div>
          </div>
        ))}
      </div>
    );
  }

  const formattedDemand = (kpis?.total_demand_7d || 0).toLocaleString('id-ID');
  const formattedSafety = (kpis?.total_safety_stock || 0).toLocaleString('id-ID');
  const formattedSku = (kpis?.total_sku || 0).toLocaleString('id-ID');

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* KPI 1: Proyeksi Demand 7 Hari */}
      <div className="saas-card p-5 rounded-xl flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-400">
            Total Proyeksi Demand (7D)
          </span>
          <div className="p-1.5 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>
        <div className="my-2">
          <div className="text-2xl font-bold font-mono text-white tracking-tight">
            {formattedDemand} <span className="text-xs font-normal text-slate-400 font-sans">unit</span>
          </div>
        </div>
        <div className="flex items-center text-[11px] text-slate-400">
          <Activity className="w-3 h-3 text-indigo-400 mr-1.5" /> Total permintaan seluruh SKU
        </div>
      </div>

      {/* KPI 2: Total Safety Stock */}
      <div className="saas-card p-5 rounded-xl flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-400">
            Total Safety Stock
          </span>
          <div className="p-1.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <ShieldCheck className="w-4 h-4" />
          </div>
        </div>
        <div className="my-2">
          <div className="text-2xl font-bold font-mono text-white tracking-tight">
            {formattedSafety} <span className="text-xs font-normal text-slate-400 font-sans">unit</span>
          </div>
        </div>
        <div className="flex items-center text-[11px] text-slate-400">
          Stok pengaman berbasis MAE model
        </div>
      </div>

      {/* KPI 3: Breakdown SKU (Kelas A / B / C) */}
      <div className="saas-card p-5 rounded-xl flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-400">
            Total Produk Active
          </span>
          <div className="p-1.5 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Package className="w-4 h-4" />
          </div>
        </div>
        <div className="my-2">
          <div className="text-2xl font-bold font-mono text-white tracking-tight">
            {formattedSku} <span className="text-xs font-normal text-slate-400 font-sans">SKU</span>
          </div>
        </div>
        <div className="flex items-center justify-between text-[11px] pt-1">
          <span className="text-rose-400 font-medium bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/20">
            A: {kpis?.sku_kelas_a || 0}
          </span>
          <span className="text-amber-400 font-medium bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
            B: {kpis?.sku_kelas_b || 0}
          </span>
          <span className="text-cyan-400 font-medium bg-cyan-500/10 px-1.5 py-0.5 rounded border border-cyan-500/20">
            C: {kpis?.sku_kelas_c || 0}
          </span>
        </div>
      </div>

      {/* KPI 4: CatBoost AI Model Metrics Card */}
      <div className="saas-card p-5 rounded-xl flex flex-col justify-between border-indigo-500/20">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-medium text-indigo-300 flex items-center gap-1.5">
            <BrainCircuit className="w-3.5 h-3.5 text-indigo-400" /> Metrik Model AI
          </span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 font-mono">
            CatBoost 800
          </span>
        </div>
        
        <div className="grid grid-cols-3 gap-1.5 my-1">
          <div className="bg-slate-900/80 p-1.5 rounded text-center border border-slate-800">
            <div className="text-[9px] text-slate-400 uppercase font-medium">MAE</div>
            <div className="text-sm font-bold font-mono text-emerald-400">{metrics?.mae ?? 86.41}</div>
          </div>
          <div className="bg-slate-900/80 p-1.5 rounded text-center border border-slate-800">
            <div className="text-[9px] text-slate-400 uppercase font-medium">R²</div>
            <div className="text-sm font-bold font-mono text-indigo-400">{metrics?.r2_percentage ?? '45.53%'}</div>
          </div>
          <div className="bg-slate-900/80 p-1.5 rounded text-center border border-slate-800">
            <div className="text-[9px] text-slate-400 uppercase font-medium">RMSE</div>
            <div className="text-sm font-bold font-mono text-amber-400">{metrics?.rmse ?? 206.56}</div>
          </div>
        </div>
        <div className="text-[10px] text-slate-500 text-center">
          Parameter Uji Model CatBoost
        </div>
      </div>
    </div>
  );
}
