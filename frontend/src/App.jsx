import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import KpiGrid from './components/KpiGrid';
import ParetoChart from './components/ParetoChart';
import FeatureImportanceChart from './components/FeatureImportanceChart';
import AbcDonutChart from './components/AbcDonutChart';
import StockTable from './components/StockTable';
import { ShieldCheck, Zap, AlertCircle } from 'lucide-react';

export default function App() {
  const [kpis, setKpis] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [abcData, setAbcData] = useState({ distribution: [], pareto: [] });
  const [recommendations, setRecommendations] = useState({ items: [], total: 0, page: 1, limit: 10, total_pages: 1 });
  
  const [loadingKpis, setLoadingKpis] = useState(true);
  const [loadingCharts, setLoadingCharts] = useState(true);
  const [loadingTable, setLoadingTable] = useState(true);
  const [error, setError] = useState(null);

  // Table state
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Semua');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const fetchKpisAndMetrics = async () => {
    setLoadingKpis(true);
    setError(null);
    try {
      const [kpisRes, metricsRes] = await Promise.all([
        fetch('/api/kpis'),
        fetch('/api/metrics')
      ]);
      const kpisJson = await kpisRes.json();
      const metricsJson = await metricsRes.json();

      if (kpisJson.success) setKpis(kpisJson.data);
      if (metricsJson.success) setMetrics(metricsJson.data);
    } catch (err) {
      console.error('Error fetching KPIs:', err);
      setError('Gagal terhubung ke FastAPI Backend Server. Pastikan uvicorn backend running.');
    } finally {
      setLoadingKpis(false);
    }
  };

  const fetchAbcDistribution = async () => {
    setLoadingCharts(true);
    try {
      const res = await fetch('/api/abc-distribution');
      const json = await res.json();
      if (json.success) {
        setAbcData(json.data);
      }
    } catch (err) {
      console.error('Error fetching ABC distribution:', err);
    } finally {
      setLoadingCharts(false);
    }
  };

  const fetchRecommendations = useCallback(async () => {
    setLoadingTable(true);
    try {
      const params = new URLSearchParams({
        search: search.trim(),
        kategori_abc: category === 'Semua' ? '' : category,
        page: page.toString(),
        limit: limit.toString()
      });
      const res = await fetch(`/api/recommendations?${params.toString()}`);
      const json = await res.json();
      if (json.success) {
        setRecommendations(json.data);
      }
    } catch (err) {
      console.error('Error fetching recommendations:', err);
    } finally {
      setLoadingTable(false);
    }
  }, [search, category, page, limit]);

  const loadAllData = () => {
    fetchKpisAndMetrics();
    fetchAbcDistribution();
    fetchRecommendations();
  };

  useEffect(() => {
    fetchKpisAndMetrics();
    fetchAbcDistribution();
  }, []);

  useEffect(() => {
    fetchRecommendations();
  }, [fetchRecommendations]);

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-200 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Navigation Header */}
      <Navbar onRefresh={loadAllData} loading={loadingKpis || loadingCharts || loadingTable} />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        
        {/* Error Banner */}
        {error && (
          <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-3.5 flex items-center gap-3 text-rose-300 text-xs">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
            <div>
              <strong className="font-semibold text-rose-200">Koneksi Backend Terputus:</strong> {error}
            </div>
          </div>
        )}

        {/* Section 1: KPI & AI Model Metric Cards */}
        <section>
          <KpiGrid kpis={kpis} metrics={metrics} loading={loadingKpis} />
        </section>

        {/* Section 2: Visual Analytics & Pareto Analysis */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Main Pareto Dual-Axis Chart */}
          <div className="lg:col-span-8">
            <ParetoChart data={abcData.pareto} loading={loadingCharts} />
          </div>

          {/* CatBoost Feature Importance */}
          <div className="lg:col-span-4">
            <FeatureImportanceChart />
          </div>
        </section>

        {/* Section 3: Category Distribution & Inventory Insights */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-4">
            <AbcDonutChart data={abcData} loading={loadingCharts} />
          </div>

          {/* Policy & Operational Guidance */}
          <div className="lg:col-span-8 saas-card p-5 rounded-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400" />
                  Kebijakan Gudang & Rekomendasi Stok
                </h3>
                <span className="text-xs text-slate-400 font-medium bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                  Prinsip Pareto (80/20)
                </span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mt-3">
                <div className="bg-slate-900/80 p-3.5 rounded-lg border border-slate-800 space-y-1">
                  <div className="text-xs font-semibold text-rose-400 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                    Kelas A (Fast-Moving)
                  </div>
                  <p className="text-[11px] text-slate-300">
                    70% total volume demand. Terapkan <strong>Safety Stock Tinggi ({metrics?.mae ? round(metrics.mae * 3, 2) : '259.23'} unit)</strong> & evaluasi harian.
                  </p>
                </div>

                <div className="bg-slate-900/80 p-3.5 rounded-lg border border-slate-800 space-y-1">
                  <div className="text-xs font-semibold text-amber-400 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                    Kelas B (Medium-Moving)
                  </div>
                  <p className="text-[11px] text-slate-300">
                    20% total volume demand. Terapkan <strong>Safety Stock Standar ({metrics?.mae ?? 86.41} unit)</strong> & evaluasi mingguan.
                  </p>
                </div>

                <div className="bg-slate-900/80 p-3.5 rounded-lg border border-slate-800 space-y-1">
                  <div className="text-xs font-semibold text-cyan-400 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-500"></span>
                    Kelas C (Slow-Moving)
                  </div>
                  <p className="text-[11px] text-slate-300">
                    10% sisa volume demand. Terapkan <strong>Safety Stock Minimal (5 unit)</strong> untuk menekan holding cost persediaan.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-3 pt-2.5 border-t border-slate-800 text-[11px] text-slate-400 flex flex-wrap items-center justify-between gap-2">
              <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Model CatBoost 800 (MAE: 86.41 | R²: 45.53%)
              </span>
              <span className="text-slate-500 font-mono">Pipeline FastAPI + React Vite Active</span>
            </div>
          </div>
        </section>

        {/* Section 4: Paginated & Filterable Stock Table */}
        <section>
          <StockTable
            recommendations={recommendations}
            loading={loadingTable}
            search={search}
            setSearch={setSearch}
            category={category}
            setCategory={setCategory}
            page={page}
            setPage={setPage}
            limit={limit}
            setLimit={setLimit}
          />
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>E-Commerce Demand Forecasting Dashboard &copy; 2026</span>
          <span>FastAPI + Vite React Industrial Analytics Engine</span>
        </div>
      </footer>
    </div>
  );
}

function round(val, decimals) {
  return Number(Math.round(val + 'e' + decimals) + 'e-' + decimals);
}
