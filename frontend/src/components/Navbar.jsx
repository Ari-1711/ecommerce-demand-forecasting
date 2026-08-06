import React from 'react';
import { Cpu, RefreshCw, Layers, Sparkles, CheckCircle2 } from 'lucide-react';

export default function Navbar({ onRefresh, loading }) {
  return (
    <header className="bg-[#0e131f] border-b border-slate-800/80 px-6 py-3.5 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Brand Title */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600/90 text-white flex items-center justify-center font-bold text-sm shadow-sm">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-base font-semibold tracking-tight text-white">
                E-Commerce Demand & Inventory Planner
              </h1>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                CatBoost AI
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Proyeksi Stok Gudang 7 Hari & Analisis Kumulatif ABC Pareto
            </p>
          </div>
        </div>

        {/* Status Indicator & Refresh Button */}
        <div className="flex items-center gap-3">
          {/* Model Status Pill */}
          <div className="hidden sm:flex items-center space-x-2 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-xs text-slate-300">
            <Cpu className="w-3.5 h-3.5 text-emerald-400" />
            <span>Model: <strong className="text-slate-100 font-medium">CatBoost 800</strong></span>
            <span className="text-slate-700">|</span>
            <span className="text-emerald-400 text-[11px] font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Ready
            </span>
          </div>

          <button
            onClick={onRefresh}
            disabled={loading}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 active:bg-slate-900 border border-slate-700/80 text-slate-200 text-xs font-medium transition-colors cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-indigo-400' : 'text-slate-400'}`} />
            <span>{loading ? 'Refreshing...' : 'Refresh Data'}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
