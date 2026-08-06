import React, { useState } from 'react';
import { Cpu, RefreshCw, Layers, CheckCircle2, Menu, X } from 'lucide-react';

export default function Navbar({ onRefresh, loading }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-[#0e131f] border-b border-slate-800/80 px-4 sm:px-6 py-3 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Brand Title */}
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 sm:w-8 sm:h-8 rounded-lg bg-indigo-600/90 text-white flex items-center justify-center font-bold text-sm shadow-sm flex-shrink-0">
            <Layers className="w-5 h-5 sm:w-4 sm:h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-sm sm:text-base font-semibold tracking-tight text-white line-clamp-1">
                E-Commerce Demand & Inventory Planner
              </h1>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                CatBoost AI
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-400 line-clamp-1">
              Proyeksi Stok 7 Hari & Analisis ABC Pareto
            </p>
          </div>
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-md bg-slate-900 border border-slate-800 text-xs text-slate-300">
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
            className="flex items-center space-x-1.5 px-3.5 py-2.5 min-h-[44px] rounded-lg bg-slate-800 hover:bg-slate-700 active:bg-slate-900 border border-slate-700/80 text-slate-200 text-xs font-medium transition-colors cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-indigo-400' : 'text-slate-400'}`} />
            <span>{loading ? 'Refreshing...' : 'Refresh Data'}</span>
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="p-2.5 min-h-[44px] min-w-[44px] rounded-lg bg-slate-800 text-slate-300 border border-slate-700 flex items-center justify-center cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Collapsible Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden pt-3 pb-2 px-1 border-t border-slate-800/80 mt-3 space-y-3 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300">
            <div className="flex items-center space-x-2">
              <Cpu className="w-4 h-4 text-emerald-400" />
              <span>Model: <strong className="text-slate-100 font-medium">CatBoost 800</strong></span>
            </div>
            <span className="text-emerald-400 text-xs font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Ready
            </span>
          </div>

          <button
            onClick={() => {
              onRefresh();
              setMobileMenuOpen(false);
            }}
            disabled={loading}
            className="w-full flex items-center justify-center space-x-2 py-3 px-4 min-h-[44px] rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold cursor-pointer disabled:opacity-50 shadow-md"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'Memuat Data...' : 'Refresh Data Dashboard'}</span>
          </button>
        </div>
      )}
    </header>
  );
}
