import React from 'react';
import { Sliders } from 'lucide-react';

const featureData = [
  { feature: 'StockCode Encoded', importance: 71.1, color: 'bg-indigo-500' },
  { feature: 'Rolling Mean 7D', importance: 10.5, color: 'bg-indigo-400' },
  { feature: 'UnitPrice', importance: 5.4, color: 'bg-indigo-400' },
  { feature: 'DayOfWeek', importance: 3.8, color: 'bg-slate-400' },
  { feature: 'Month', importance: 2.9, color: 'bg-slate-400' },
  { feature: 'Lag 7 Hari', importance: 2.3, color: 'bg-slate-500' },
  { feature: 'Is_Weekend', importance: 1.8, color: 'bg-slate-500' },
  { feature: 'Lainnya', importance: 2.2, color: 'bg-slate-600' },
];

export default function FeatureImportanceChart() {
  return (
    <div className="saas-card p-4 sm:p-5 rounded-xl flex flex-col justify-between h-[320px] sm:h-[380px] lg:h-[400px]">
      <div>
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-xs sm:text-sm font-semibold text-white flex items-center gap-2">
            <Sliders className="w-4 h-4 text-indigo-400 flex-shrink-0" />
            CatBoost Driver Utama
          </h2>
          <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
            Importance
          </span>
        </div>
        <p className="text-[11px] sm:text-xs text-slate-400 mb-2 sm:mb-4">
          Bobot variabel dalam memprediksi demand 7 hari.
        </p>

        <div className="space-y-2 sm:space-y-2.5">
          {featureData.map((item, index) => (
            <div key={index} className="space-y-1">
              <div className="flex justify-between text-[11px] sm:text-xs">
                <span className="text-slate-300 font-medium truncate pr-2">{item.feature}</span>
                <span className="text-slate-200 font-mono text-[10px] sm:text-[11px] flex-shrink-0">{item.importance}%</span>
              </div>
              <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden border border-slate-800">
                <div
                  className={`h-full rounded-full ${item.color}`}
                  style={{ width: `${item.importance}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-2 border-t border-slate-800 text-[10px] sm:text-[11px] text-slate-400 flex items-center justify-between">
        <span className="truncate">Utama: <strong className="text-slate-200 font-medium">StockCode & History</strong></span>
        <span className="text-slate-500 font-mono">100%</span>
      </div>
    </div>
  );
}
