import React, { useState } from 'react';
import {
  Layers,
  Sparkles,
  Droplets,
  Calendar,
  TrendingUp,
  BarChart3,
  PlusCircle,
  CheckCircle2,
  Sprout,
  Activity,
  History,
  Compass,
  Cloud,
  Check,
} from 'lucide-react';
import { DigitalTwinFarm as TwinType, FarmSeasonLog } from '../types';
import { useCloudData } from '../context/CloudDataContext';

interface DigitalTwinFarmProps {
  twinData?: TwinType;
  onAddSeasonLog?: (log: FarmSeasonLog) => void;
}

export const DigitalTwinFarm: React.FC<DigitalTwinFarmProps> = ({
  twinData: propTwinData,
  onAddSeasonLog: propAddSeasonLog,
}) => {
  const { twinData: cloudTwinData, addFarmSeasonLog, isCloudConnected } = useCloudData();
  const twinData = cloudTwinData || propTwinData;

  const [showAddLogModal, setShowAddLogModal] = useState<boolean>(false);
  const [isSavingCloud, setIsSavingCloud] = useState<boolean>(false);

  // Form State
  const [seasonName, setSeasonName] = useState<string>('Upcoming Kharif 2026');
  const [cropGrown, setCropGrown] = useState<string>('Organic Turmeric');
  const [acresPlanted, setAcresPlanted] = useState<number>(3.5);
  const [yieldTons, setYieldTons] = useState<number>(14.2);
  const [expenses, setExpenses] = useState<number>(48000);
  const [income, setIncome] = useState<number>(165000);
  const [irrigationMethod, setIrrigationMethod] = useState<string>('Solar Drip Fertigation');
  const [learnings, setLearnings] = useState<string>(
    'Shifted to solar drip fertigation. Reduced water by 50% and saved electricity cost.'
  );

  if (!twinData) {
    return (
      <div className="p-8 text-center bg-slate-900 border border-slate-800 rounded-2xl">
        <div className="w-8 h-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin mx-auto mb-3" />
        <p className="text-slate-400 text-sm">Loading Cloud Digital Twin Farm Telemetry...</p>
      </div>
    );
  }

  const handleAddLog = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingCloud(true);
    try {
      const newLog: FarmSeasonLog = {
        id: `s-${Date.now()}`,
        seasonName,
        cropGrown,
        acresPlanted: Number(acresPlanted),
        yieldObtainedTons: Number(yieldTons),
        totalExpensesInr: Number(expenses),
        totalIncomeInr: Number(income),
        netProfitInr: Number(income) - Number(expenses),
        rainfallMm: 520,
        primaryIrrigationMethod: irrigationMethod,
        keyLearnings: learnings,
      };

      if (addFarmSeasonLog) {
        await addFarmSeasonLog(newLog);
      } else if (propAddSeasonLog) {
        propAddSeasonLog(newLog);
      }
      setShowAddLogModal(false);
    } catch (err) {
      console.error('Failed to save season log to cloud:', err);
    } finally {
      setIsSavingCloud(false);
    }
  };

  const totalHistoricalProfit = twinData.seasons.reduce(
    (acc, s) => acc + s.netProfitInr,
    0
  );

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-emerald-950 border border-emerald-800/80 px-3 py-1 rounded-full text-xs font-semibold text-emerald-300 mb-2">
              <Layers className="w-3.5 h-3.5 text-emerald-400" />
              <span>Core Digital Twin Farm • Cloud Synchronized</span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Digital Twin Farm — {twinData.farmName}
            </h2>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Virtual replica of <strong>{twinData.ownerName}'s</strong> field in {twinData.villageName}. Stores historical yield, rainfall, and soil telemetry in Firestore. Over time, the digital twin becomes smarter and refines future predictions.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs shrink-0">
            <div className="text-right">
              <div className="text-slate-400">Twin Intelligence Rating</div>
              <div className="text-lg font-black text-emerald-400 font-mono">
                {twinData.twinIntelligenceScore}/100 Smart
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      {/* Top Telemetry & Soil Health Gauges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-1">
          <div className="text-xs text-slate-400 uppercase font-semibold flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-emerald-400" /> Land Holding
          </div>
          <div className="text-xl font-bold text-white">
            {twinData.totalAreaAcres} Acres
          </div>
          <div className="text-[11px] text-slate-500">
            {twinData.soilType} • {twinData.elevationMeters}m MSL
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-1">
          <div className="text-xs text-slate-400 uppercase font-semibold flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-cyan-400" /> Soil Health pH & Carbon
          </div>
          <div className="text-xl font-bold text-emerald-300 font-mono">
            pH {twinData.soilPh} • {twinData.organicCarbonPct}% OC
          </div>
          <div className="text-[11px] text-slate-500">
            Optimal for Turmeric, Maize & Legumes
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-1">
          <div className="text-xs text-slate-400 uppercase font-semibold flex items-center gap-1.5">
            <Sprout className="w-3.5 h-3.5 text-emerald-400" /> N-P-K Nutrients
          </div>
          <div className="text-xs font-bold text-slate-200 flex items-center gap-2 pt-1">
            <span className="bg-emerald-950 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-800">
              N: {twinData.npkStatus.nitrogen}
            </span>
            <span className="bg-emerald-950 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-800">
              P: {twinData.npkStatus.phosphorus}
            </span>
            <span className="bg-emerald-950 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-800">
              K: {twinData.npkStatus.potassium}
            </span>
          </div>
          <div className="text-[11px] text-slate-500">Soil Sensors Synced</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-1">
          <div className="text-xs text-slate-400 uppercase font-semibold flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> Lifetime Net Profit
          </div>
          <div className="text-xl font-bold text-emerald-400 font-mono">
            ₹{totalHistoricalProfit.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500">
            Across {twinData.seasons.length} logged seasons
          </div>
        </div>
      </div>

      {/* Historical Seasons Timeline */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <History className="w-4 h-4 text-emerald-400" />
              Multi-Season Yield, Profit & Learning History
            </h3>
            <p className="text-xs text-slate-400">
              Historical ledger feeding the farm's Digital Twin AI engine in cloud database.
            </p>
          </div>

          <button
            onClick={() => setShowAddLogModal(true)}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <PlusCircle className="w-4 h-4" /> Log Completed Season
          </button>
        </div>

        <div className="space-y-4">
          {twinData.seasons.map((s, idx) => (
            <div
              key={s.id || idx}
              className="bg-slate-950 border border-slate-800/80 rounded-2xl p-5 relative transition-all hover:border-slate-700"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-3 border-b border-slate-800/60 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-emerald-400 font-mono font-bold text-xs">
                    S{idx + 1}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">
                      {s.seasonName} • <span className="text-emerald-300">{s.cropGrown}</span>
                    </h4>
                    <span className="text-xs text-slate-400">
                      {s.acresPlanted} Acres • {s.primaryIrrigationMethod} • {s.rainfallMm}mm Rain
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs font-mono">
                  <div className="text-right">
                    <span className="text-slate-500 block text-[10px]">Expenses</span>
                    <span className="text-slate-300">₹{s.totalExpensesInr.toLocaleString()}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-500 block text-[10px]">Income</span>
                    <span className="text-slate-200">₹{s.totalIncomeInr.toLocaleString()}</span>
                  </div>
                  <div className="text-right bg-emerald-950/60 border border-emerald-800/80 p-2 rounded-lg">
                    <span className="text-emerald-400 block text-[10px] font-sans">Net Profit</span>
                    <span className="text-emerald-300 font-extrabold text-sm">
                      ₹{s.netProfitInr.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 text-xs text-slate-300">
                <strong className="text-emerald-400 text-[10px] uppercase block mb-0.5">
                  Twin Key Learning & Takeaway
                </strong>
                "{s.keyLearnings}"
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Season Modal */}
      {showAddLogModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-emerald-400" />
              Log Season Results to Cloud Digital Twin
            </h3>

            <form onSubmit={handleAddLog} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Season Name</label>
                <input
                  type="text"
                  value={seasonName}
                  onChange={(e) => setSeasonName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 mb-1">Crop Grown</label>
                  <input
                    type="text"
                    value={cropGrown}
                    onChange={(e) => setCropGrown(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Acres Planted</label>
                  <input
                    type="number"
                    step="0.5"
                    value={acresPlanted}
                    onChange={(e) => setAcresPlanted(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 mb-1">Total Expenses (₹)</label>
                  <input
                    type="number"
                    value={expenses}
                    onChange={(e) => setExpenses(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Total Revenue (₹)</label>
                  <input
                    type="number"
                    value={income}
                    onChange={(e) => setIncome(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Key Observation / Learning</label>
                <textarea
                  value={learnings}
                  onChange={(e) => setLearnings(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200 h-20"
                  required
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddLogModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingCloud}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold rounded-lg cursor-pointer flex items-center gap-1"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{isSavingCloud ? 'Saving to Cloud...' : 'Save to Cloud Twin'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
