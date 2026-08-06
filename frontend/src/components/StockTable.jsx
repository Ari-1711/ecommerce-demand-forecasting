import React from 'react';
import { Search, Download, ChevronLeft, ChevronRight, Filter, Table } from 'lucide-react';

export default function StockTable({
  recommendations,
  loading,
  search,
  setSearch,
  category,
  setCategory,
  page,
  setPage,
  limit,
  setLimit
}) {
  const items = recommendations?.items || [];
  const total = recommendations?.total || 0;
  const totalPages = recommendations?.total_pages || 1;

  const categories = [
    { label: 'Semua SKU', value: 'Semua' },
    { label: 'Kelas A (Fast)', value: 'Kelas A' },
    { label: 'Kelas B (Medium)', value: 'Kelas B' },
    { label: 'Kelas C (Slow)', value: 'Kelas C' },
  ];

  const handleExportCSV = () => {
    if (!items || items.length === 0) return;

    const headers = ["StockCode", "Prediksi_Demand_AI_7Hari", "Kontribusi_%", "Kumulatif_%", "Kategori_ABC", "Safety_Stock_Rekomendasi", "Rekomendasi_Total_Stok_Gudang"];
    const rows = items.map(item => [
      item.stock_code,
      item.prediksi_demand_7d,
      `${(item.kontribusi_pct * 100).toFixed(4)}%`,
      `${(item.kumulatif_pct * 100).toFixed(2)}%`,
      `"${item.kategori_abc}"`,
      item.safety_stock,
      item.rekomendasi_total_stok
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `rekomendasi_stok_${category.replace(/\s+/g, '_')}_page${page}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getBadgeStyle = (cat) => {
    if (cat.includes('Kelas A')) {
      return 'bg-rose-500/10 text-rose-300 border-rose-500/30';
    } else if (cat.includes('Kelas B')) {
      return 'bg-amber-500/10 text-amber-300 border-amber-500/30';
    } else {
      return 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30';
    }
  };

  return (
    <div className="saas-card rounded-xl p-4 sm:p-5 flex flex-col space-y-4">
      {/* Table Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xs sm:text-sm font-semibold text-white flex items-center gap-2">
            <Table className="w-4 h-4 text-indigo-400 flex-shrink-0" />
            Tabel Detail Rekomendasi Stok Gudang
          </h2>
          <p className="text-[11px] sm:text-xs text-slate-400">
            Pencarian cepat StockCode, filter kategori ABC, dan alokasi persediaan.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          {/* Instant Search Bar */}
          <div className="relative flex-1 sm:w-60">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Cari StockCode (e.g. 23084)..."
              className="w-full bg-slate-900 border border-slate-700/80 rounded-lg pl-9 pr-3 py-2.5 min-h-[44px] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          {/* Export CSV Button */}
          <button
            onClick={handleExportCSV}
            className="flex items-center justify-center space-x-1.5 px-4 py-2.5 min-h-[44px] rounded-lg bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white text-xs font-semibold transition-colors cursor-pointer shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span>Unduh CSV</span>
          </button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center space-x-1.5 border-b border-slate-800 pb-2.5 overflow-x-auto -mx-1 px-1">
        <Filter className="w-3.5 h-3.5 text-slate-400 mr-1 flex-shrink-0" />
        {categories.map((cat) => {
          const isActive = category === cat.value;
          return (
            <button
              key={cat.value}
              onClick={() => {
                setCategory(cat.value);
                setPage(1);
              }}
              className={`px-3 py-2 min-h-[40px] rounded-md text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                isActive
                  ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 font-semibold'
                  : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Scrollable Table Area */}
      <div className="overflow-x-auto rounded-lg border border-slate-800 bg-slate-950/40 -mx-1 sm:mx-0">
        <table className="w-full text-left border-collapse text-xs min-w-[640px]">
          <thead>
            <tr className="bg-slate-900/80 border-b border-slate-800 text-slate-400 font-medium uppercase tracking-wider text-[10px] sm:text-[11px]">
              <th className="py-3 px-3 sm:px-4">Stock Code</th>
              <th className="py-3 px-3 sm:px-4">Prediksi Demand (7D)</th>
              <th className="py-3 px-3 sm:px-4">Kontribusi (%)</th>
              <th className="py-3 px-3 sm:px-4">Kumulatif (%)</th>
              <th className="py-3 px-3 sm:px-4">Kategori ABC</th>
              <th className="py-3 px-3 sm:px-4">Safety Stock</th>
              <th className="py-3 px-3 sm:px-4 text-right">Rekomendasi Total Stok</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-[11px] sm:text-xs">
            {loading ? (
              Array.from({ length: limit }).map((_, idx) => (
                <tr key={idx} className="animate-pulse">
                  <td className="py-3 px-4"><div className="h-4 bg-slate-800 rounded w-16"></div></td>
                  <td className="py-3 px-4"><div className="h-4 bg-slate-800 rounded w-20"></div></td>
                  <td className="py-3 px-4"><div className="h-4 bg-slate-800 rounded w-16"></div></td>
                  <td className="py-3 px-4"><div className="h-4 bg-slate-800 rounded w-16"></div></td>
                  <td className="py-3 px-4"><div className="h-4 bg-slate-800 rounded w-24"></div></td>
                  <td className="py-3 px-4"><div className="h-4 bg-slate-800 rounded w-16"></div></td>
                  <td className="py-3 px-4"><div className="h-4 bg-slate-800 rounded w-20 ml-auto"></div></td>
                </tr>
              ))
            ) : items.length === 0 ? (
              <tr>
                <td colSpan="7" className="py-10 text-center text-slate-500">
                  Tidak ada data rekomendasi stok yang cocok.
                </td>
              </tr>
            ) : (
              items.map((row) => (
                <tr key={row.stock_code} className="hover:bg-slate-900/50 transition-colors">
                  <td className="py-2.5 px-3 sm:px-4 font-mono font-bold text-slate-100 whitespace-nowrap">
                    {row.stock_code}
                  </td>
                  <td className="py-2.5 px-3 sm:px-4 font-mono font-semibold text-emerald-400 whitespace-nowrap">
                    {row.prediksi_demand_7d.toLocaleString('id-ID')} <span className="text-[10px] text-slate-500 font-sans font-normal">unit</span>
                  </td>
                  <td className="py-2.5 px-3 sm:px-4 font-mono text-indigo-300 whitespace-nowrap">
                    {(row.kontribusi_pct * 100).toFixed(3)}%
                  </td>
                  <td className="py-2.5 px-3 sm:px-4 font-mono text-amber-300 whitespace-nowrap">
                    {(row.kumulatif_pct * 100).toFixed(2)}%
                  </td>
                  <td className="py-2.5 px-3 sm:px-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-medium border ${getBadgeStyle(row.kategori_abc)}`}>
                      {row.kategori_abc}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 sm:px-4 font-mono font-medium text-purple-300 whitespace-nowrap">
                    {row.safety_stock.toLocaleString('id-ID')} <span className="text-[10px] text-slate-500 font-sans font-normal">unit</span>
                  </td>
                  <td className="py-2.5 px-3 sm:px-4 text-right font-mono font-bold text-white whitespace-nowrap">
                    {row.rekomendasi_total_stok.toLocaleString('id-ID')} <span className="text-[10px] font-sans font-normal text-indigo-300">unit</span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile-Responsive Pagination Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 text-xs text-slate-400">
        <div className="flex items-center justify-between sm:justify-start space-x-2">
          <span>Menampilkan</span>
          <select
            value={limit}
            onChange={(e) => {
              setLimit(Number(e.target.value));
              setPage(1);
            }}
            className="bg-slate-900 border border-slate-700 text-white rounded px-2.5 py-1.5 min-h-[36px] focus:outline-none"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <span>dari <strong className="font-mono text-slate-200">{total.toLocaleString('id-ID')}</strong> SKU</span>
        </div>

        <div className="flex items-center justify-between sm:justify-end space-x-3">
          <span>Halaman <strong className="font-mono text-slate-200">{page}</strong> dari <strong className="font-mono text-slate-200">{totalPages}</strong></span>
          <div className="flex items-center space-x-1.5">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1 || loading}
              aria-label="Previous Page"
              className="p-2 min-h-[40px] min-w-[40px] rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 disabled:opacity-40 flex items-center justify-center cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4 text-slate-300" />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages || loading}
              aria-label="Next Page"
              className="p-2 min-h-[40px] min-w-[40px] rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 disabled:opacity-40 flex items-center justify-center cursor-pointer"
            >
              <ChevronRight className="w-4 h-4 text-slate-300" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
