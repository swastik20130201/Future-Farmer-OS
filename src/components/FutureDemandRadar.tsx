import React, { useState } from 'react';
import {
  TrendingUp,
  AlertCircle,
  Sparkles,
  Calendar,
  Building2,
  Utensils,
  Globe,
  CheckCircle2,
  Filter,
  ArrowUpRight,
  TrendingDown,
} from 'lucide-react';
import { DemandSignal } from '../types';

interface FutureDemandRadarProps {
  signals: DemandSignal[];
  onApplySignalFilter?: (cropTarget: string) => void;
}

export const FutureDemandRadar: React.FC<FutureDemandRadarProps> = ({
  signals,
  onApplySignalFilter,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = [
    'All',
    'Festival Demand',
    'Institutional Procurement',
    'Industrial Processing',
    'Export Trend',
    'Climate Shift',
  ];

  const filteredSignals =
    selectedCategory === 'All'
      ? signals
      : signals.filter((s) => s.category === selectedCategory);

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'Festival Demand':
        return <Calendar className="w-4 h-4 text-amber-400" />;
      case 'Institutional Procurement':
        return <Utensils className="w-4 h-4 text-emerald-400" />;
      case 'Industrial Processing':
        return <Building2 className="w-4 h-4 text-cyan-400" />;
      case 'Export Trend':
        return <Globe className="w-4 h-4 text-purple-400" />;
      default:
        return <TrendingUp className="w-4 h-4 text-emerald-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-emerald-950 border border-emerald-800/80 px-3 py-1 rounded-full text-xs font-semibold text-emerald-300 mb-2">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              Core Feature 3 — Market Demand Predictor
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Future Market Demand Radar & Price Signals
            </h2>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Monitors future demand triggers 6 months ahead — including upcoming festive seasons, school nutrition procurement tenders, processing plant contracts, and climate shifts.
            </p>
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        <span className="text-xs font-semibold text-slate-400 flex items-center gap-1 shrink-0 mr-1">
          <Filter className="w-3.5 h-3.5 text-emerald-400" /> Filter Signal Source:
        </span>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === cat
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-950'
                : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Signals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredSignals.map((sig) => {
          const isWarning = sig.demandTrend === 'Oversupply Warning';
          return (
            <div
              key={sig.id}
              className={`bg-slate-900 border rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 hover:scale-[1.01] ${
                isWarning
                  ? 'border-rose-800/80 bg-rose-950/10'
                  : 'border-slate-800 hover:border-emerald-500/60'
              }`}
            >
              <div>
                {/* Header Badge */}
                <div className="flex items-center justify-between mb-3">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-950 border border-slate-800 text-slate-200">
                    {getCategoryIcon(sig.category)}
                    {sig.category}
                  </span>
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 font-mono ${
                      isWarning
                        ? 'bg-rose-950 text-rose-300 border border-rose-800'
                        : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    }`}
                  >
                    {isWarning ? (
                      <TrendingDown className="w-3.5 h-3.5" />
                    ) : (
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    )}
                    {sig.demandTrend} ({sig.expectedPriceSurgePct > 0 ? '+' : ''}
                    {sig.expectedPriceSurgePct}%)
                  </span>
                </div>

                {/* Signal Title */}
                <h3 className="text-lg font-bold text-white mb-1">{sig.title}</h3>

                <div className="text-xs font-medium text-emerald-400 mb-3 flex items-center gap-1.5">
                  Target Crop: <span className="text-white font-bold">{sig.cropTarget}</span>
                  <span className="text-slate-500 font-normal">• {sig.timeframe}</span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  {sig.description}
                </p>

                {/* Source & Confidence Bar */}
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 mb-4 space-y-2">
                  <div className="text-[11px] text-slate-400 flex items-center justify-between">
                    <span>Source Signal</span>
                    <span className="text-slate-200 font-semibold">{sig.source}</span>
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                      <span>Signal Confidence Score</span>
                      <span className="font-mono font-bold text-emerald-400">
                        {sig.confidenceScore}% High Certainty
                      </span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-400 h-full"
                        style={{ width: `${sig.confidenceScore}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Recommended Farmer Action */}
                <div className="p-3 bg-emerald-950/40 border border-emerald-800/60 rounded-xl text-xs text-emerald-200 flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-emerald-300 uppercase text-[10px] tracking-wider mb-0.5">
                      Recommended Decision
                    </strong>
                    {sig.recommendedFarmerAction}
                  </div>
                </div>
              </div>

              {onApplySignalFilter && (
                <div className="mt-4 pt-3 border-t border-slate-800">
                  <button
                    onClick={() => onApplySignalFilter(sig.cropTarget)}
                    className="w-full py-2 bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-slate-200 font-semibold text-xs rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer"
                  >
                    Simulate {sig.cropTarget} in What-If Simulator →
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
