import React, { useState } from 'react';
import {
  Map,
  AlertTriangle,
  CheckCircle2,
  TrendingDown,
  UserCheck,
  PlusCircle,
  Zap,
  RotateCcw,
  BarChart3,
  Droplets,
  Layers,
} from 'lucide-react';
import { VillageInfo, AnonymousCropRegistration } from '../types';

interface VillageIntelligenceMapProps {
  village: VillageInfo;
  onRegisterCrop: (reg: AnonymousCropRegistration) => void;
  registrations: AnonymousCropRegistration[];
}

export const VillageIntelligenceMap: React.FC<VillageIntelligenceMapProps> = ({
  village,
  onRegisterCrop,
  registrations,
}) => {
  // Form state
  const [landSize, setLandSize] = useState<number>(2.5);
  const [plannedCrop, setPlannedCrop] = useState<string>('Organic Turmeric');
  const [season, setSeason] = useState<string>('Upcoming Kharif');
  const [submittedMessage, setSubmittedMessage] = useState<string | null>(null);

  // Shock simulator state
  const [simulatedExtraFarmers, setSimulatedExtraFarmers] = useState<number>(0);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const newReg: AnonymousCropRegistration = {
      id: `reg-${Date.now()}`,
      villageId: village.id,
      farmerAlias: `Anonymous Farmer #${Math.floor(100 + Math.random() * 900)}`,
      landSizeAcres: Number(landSize),
      plannedCrop,
      season,
      registeredAt: 'Just now',
    };
    onRegisterCrop(newReg);
    setSubmittedMessage(
      `✅ Anonymous intention recorded! ${landSize} Acres of ${plannedCrop} added to ${village.name}'s live decision index.`
    );
    setTimeout(() => setSubmittedMessage(null), 5000);
  };

  const cropList = village.crops;

  // Calculate stats considering extra simulated farmers for Tomato or Rice
  const getSimulatedRisk = (cropName: string, originalRisk: 'green' | 'yellow' | 'red') => {
    if (simulatedExtraFarmers > 0 && cropName.toLowerCase().includes('tomato')) {
      if (simulatedExtraFarmers >= 10) return 'red';
      return 'yellow';
    }
    return originalRisk;
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-emerald-950 border border-emerald-800/80 px-3 py-1 rounded-full text-xs font-semibold text-emerald-300 mb-2">
              <Map className="w-3.5 h-3.5 text-emerald-400" />
              Core Feature 1 — Village Decision Intelligence
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Village Crop Intelligence Map & Risk Heatmap
            </h2>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Anonymously tracks what farmers in <strong>{village.name}</strong> are planning to plant for the upcoming season to prevent regional oversupply, price crashes, and food waste.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-950 p-3 rounded-xl border border-slate-800 shrink-0">
            <div className="text-right">
              <div className="text-xs text-slate-400">Total Arable Land</div>
              <div className="text-lg font-bold text-emerald-400">
                {village.totalArableAcres} Acres
              </div>
            </div>
            <div className="h-8 w-px bg-slate-800 mx-1"></div>
            <div>
              <div className="text-xs text-slate-400">Registered Intentions</div>
              <div className="text-lg font-bold text-white">
                {village.activeFarmersRegistered + registrations.length} Farmers
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Live Grid & Heatmap */}
        <div className="lg:col-span-2 space-y-6">
          {/* Spatial Grid Representation */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-400" />
                Live Spatial Crop Density Map — {village.name}
              </h3>
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1 text-emerald-400 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
                  Green = Opportunity
                </span>
                <span className="flex items-center gap-1 text-amber-400 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span>
                  Yellow = Moderate
                </span>
                <span className="flex items-center gap-1 text-rose-400 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block"></span>
                  Red = Oversupply
                </span>
              </div>
            </div>

            {/* Interactive Grid Representation of Farm Holdings in Village */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80">
              <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2 mb-3">
                {Array.from({ length: 40 }).map((_, idx) => {
                  let cropIndex = idx % cropList.length;
                  let crop = cropList[cropIndex];
                  let effectiveRisk = getSimulatedRisk(crop.cropName, crop.riskLevel);

                  let bgClass = 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300';
                  if (effectiveRisk === 'yellow') {
                    bgClass = 'bg-amber-500/20 border-amber-500/40 text-amber-300';
                  } else if (effectiveRisk === 'red') {
                    bgClass = 'bg-rose-500/20 border-rose-500/40 text-rose-300';
                  }

                  return (
                    <div
                      key={idx}
                      className={`h-12 rounded-lg border flex flex-col items-center justify-center p-1 text-center transition-all duration-300 hover:scale-105 cursor-pointer ${bgClass}`}
                      title={`Plot #${idx + 1}: ${crop.cropName} (${crop.category}) - Risk: ${effectiveRisk.toUpperCase()}`}
                    >
                      <span className="text-[10px] font-bold truncate max-w-full">
                        {crop.cropName.split(' ')[0]}
                      </span>
                      <span className="text-[8px] opacity-75 font-mono">Plot #{idx + 1}</span>
                    </div>
                  );
                })}
              </div>
              <p className="text-xs text-slate-400 text-center">
                🗺️ Each cell represents a registered 25-acre farming cluster in {village.name}. Click or hover to inspect density.
              </p>
            </div>

            {/* Shock Simulator Widget */}
            <div className="mt-5 bg-slate-950/80 border border-slate-800 p-4 rounded-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-xs font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    Interactive "What-If Shock Simulator"
                  </h4>
                  <p className="text-xs text-slate-400">
                    Simulate what happens to market risk if 15 additional farmers switch to Tomato in {village.name}.
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() =>
                      setSimulatedExtraFarmers((prev) => (prev === 0 ? 15 : 0))
                    }
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                      simulatedExtraFarmers > 0
                        ? 'bg-amber-500 text-slate-950 hover:bg-amber-400'
                        : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                    }`}
                  >
                    {simulatedExtraFarmers > 0 ? (
                      <>
                        <RotateCcw className="w-3.5 h-3.5" /> Reset Shock
                      </>
                    ) : (
                      <>
                        <Zap className="w-3.5 h-3.5" /> +15 Farmers Tomato Shock
                      </>
                    )}
                  </button>
                </div>
              </div>
              {simulatedExtraFarmers > 0 && (
                <div className="mt-3 p-3 bg-rose-950/40 border border-rose-800/60 rounded-lg text-xs text-rose-200 flex items-start gap-2 animate-fadeIn">
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <strong>OVERSUPPLY CRASH SIMULATED!</strong> Adding +15 farmers (approx 45 Acres) of Tomato raises {village.name}'s Tomato share to 78%, triggering a <strong>RED CRITICAL OVERCROWDING ALERT</strong>. Projected harvest market prices drop by 42%.
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Breakdown Table & Metrics */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <h3 className="text-base font-semibold text-white flex items-center gap-2 mb-4">
              <BarChart3 className="w-4 h-4 text-emerald-400" />
              Crop Land Share & Risk Analysis for {village.name}
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 uppercase font-semibold">
                    <th className="py-2.5 px-3">Crop Name</th>
                    <th className="py-2.5 px-3">Planted Land</th>
                    <th className="py-2.5 px-3">Village Share</th>
                    <th className="py-2.5 px-3">Crowding Risk</th>
                    <th className="py-2.5 px-3">Price Trend</th>
                    <th className="py-2.5 px-3">Est. Village Yield</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {cropList.map((c, i) => {
                    const effectiveRisk = getSimulatedRisk(c.cropName, c.riskLevel);
                    return (
                      <tr key={i} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-3 font-semibold text-white flex items-center gap-2">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              effectiveRisk === 'green'
                                ? 'bg-emerald-400'
                                : effectiveRisk === 'yellow'
                                ? 'bg-amber-400'
                                : 'bg-rose-400'
                            }`}
                          ></span>
                          {c.cropName}
                          <span className="text-[10px] text-slate-500 font-normal">({c.category})</span>
                        </td>
                        <td className="py-3 px-3">
                          {c.acresPlanted} Acres
                          <span className="text-slate-500 block text-[10px]">{c.farmerCount} farmers</span>
                        </td>
                        <td className="py-3 px-3">
                          <div className="w-24 bg-slate-800 rounded-full h-2 overflow-hidden mb-1">
                            <div
                              className={`h-full ${
                                effectiveRisk === 'red'
                                  ? 'bg-rose-500'
                                  : effectiveRisk === 'yellow'
                                  ? 'bg-amber-500'
                                  : 'bg-emerald-500'
                              }`}
                              style={{ width: `${Math.min(100, c.percentageOfVillageLand)}%` }}
                            ></div>
                          </div>
                          <span className="font-mono text-[11px]">{c.percentageOfVillageLand}%</span>
                        </td>
                        <td className="py-3 px-3">
                          {effectiveRisk === 'red' ? (
                            <span className="bg-rose-950 text-rose-300 border border-rose-800/60 px-2 py-0.5 rounded font-semibold inline-flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3 text-rose-400" /> RED (High)
                            </span>
                          ) : effectiveRisk === 'yellow' ? (
                            <span className="bg-amber-950 text-amber-300 border border-amber-800/60 px-2 py-0.5 rounded font-semibold inline-flex items-center gap-1">
                              🟡 Yellow (Moderate)
                            </span>
                          ) : (
                            <span className="bg-emerald-950 text-emerald-300 border border-emerald-800/60 px-2 py-0.5 rounded font-semibold inline-flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Green (Opportunity)
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3">
                          {c.marketPriceTrend === 'rising' ? (
                            <span className="text-emerald-400 font-semibold flex items-center gap-1">
                              ↗ Rising
                            </span>
                          ) : c.marketPriceTrend === 'falling' ? (
                            <span className="text-rose-400 font-semibold flex items-center gap-1">
                              ↘ Falling
                            </span>
                          ) : (
                            <span className="text-slate-400 font-medium">→ Stable</span>
                          )}
                        </td>
                        <td className="py-3 px-3 font-mono font-medium text-slate-200">
                          {c.expectedVillageYieldTons} Tons
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Anonymous Intent Registration Form & Live Submissions */}
        <div className="space-y-6">
          {/* Registration Form */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 relative">
            <div className="flex items-center gap-2 mb-3">
              <PlusCircle className="w-5 h-5 text-emerald-400" />
              <h3 className="text-base font-semibold text-white">
                Anonymous Season Intent Registration
              </h3>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Help your village stay smart! Submit your planned crop before buying seeds. No personal name or phone required.
            </p>

            {submittedMessage && (
              <div className="mb-4 p-3 bg-emerald-950/80 border border-emerald-800 rounded-xl text-xs text-emerald-200 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{submittedMessage}</span>
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Target Village
                </label>

                <div className="bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 font-medium">
                  {village.name} ({village.district}, {village.state})
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Land Area Planned (Acres)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="0.5"
                    max="20"
                    step="0.5"
                    value={landSize}
                    onChange={(e) => setLandSize(Number(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                  <span className="font-mono font-bold text-emerald-400 text-sm bg-slate-950 px-2.5 py-1 rounded border border-slate-800 shrink-0">
                    {landSize} Acres
                  </span>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Crop You Are Considering
                </label>
                <select
                  value={plannedCrop}
                  onChange={(e) => setPlannedCrop(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 outline-none focus:border-emerald-500"
                >
                  <option value="Organic Turmeric">Organic Turmeric (🟢 Opportunity)</option>
                  <option value="Hybrid Maize (Corn)">Hybrid Maize / Biofuel (🟢 Opportunity)</option>
                  <option value="Oyster Mushroom">Oyster / Button Mushroom (🟢 High Margin)</option>
                  <option value="Dragonfruit">Dragonfruit / Exotic Fruit (🟢 High Margin)</option>
                  <option value="Groundnut">Groundnut / Oilseeds (🟢 Balanced)</option>
                  <option value="Paddy Rice">Paddy Rice (🔴 High Village Oversupply)</option>
                  <option value="Tomato">Tomato (🔴 Critical Oversupply Risk)</option>
                  <option value="Red Onion">Red Onion (🔴 Price Volatility Risk)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Farming Season
                </label>
                <select
                  value={season}
                  onChange={(e) => setSeason(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 outline-none focus:border-emerald-500"
                >
                  <option value="Upcoming Kharif">Upcoming Kharif (Monsoon)</option>
                  <option value="Upcoming Rabi">Upcoming Rabi (Winter)</option>
                  <option value="Zaid / Summer">Zaid / Summer Short-Cycle</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-slate-950 font-bold rounded-xl shadow-lg shadow-emerald-950/50 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <UserCheck className="w-4 h-4" /> Anonymously Register Intention
              </button>
            </form>
          </div>

          {/* Recent Registrations Log */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center justify-between">
              <span>Live Anonymous Activity Stream</span>
              <span className="text-[10px] bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded font-mono">
                Real-time
              </span>
            </h3>

            <div className="space-y-2.5 max-h-64 overflow-y-auto no-scrollbar">
              {registrations.length === 0 ? (
                <div className="text-slate-500 text-xs text-center py-4">
                  No new registrations in session yet. Be the first to register above!
                </div>
              ) : (
                registrations.map((reg) => (
                  <div
                    key={reg.id}
                    className="p-2.5 bg-slate-950 border border-slate-800/80 rounded-xl text-xs flex items-center justify-between gap-2 animate-fadeIn"
                  >
                    <div>
                      <div className="font-semibold text-emerald-300 flex items-center gap-1.5">
                        <span>{reg.farmerAlias}</span>
                        <span className="text-[10px] text-slate-500 font-normal">
                          • {reg.season}
                        </span>
                      </div>
                      <div className="text-slate-400 mt-0.5">
                        Planned: <strong className="text-slate-200">{reg.plannedCrop}</strong> ({reg.landSizeAcres} Acres)
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-500 whitespace-nowrap font-mono">
                      {reg.registeredAt}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
