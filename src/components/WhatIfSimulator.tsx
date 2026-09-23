import React, { useState } from 'react';
import {
  Sliders,
  Sparkles,
  TrendingUp,
  Droplets,
  ShieldAlert,
  ArrowRight,
  CheckCircle2,
  DollarSign,
  PieChart,
  RefreshCw,
  Award,
} from 'lucide-react';
import { SimulationInput, SimulationScenario, VillageInfo } from '../types';

interface WhatIfSimulatorProps {
  village: VillageInfo;
  onSelectScenarioForMentor?: (scenario: SimulationScenario) => void;
}

export const WhatIfSimulator: React.FC<WhatIfSimulatorProps> = ({
  village,
  onSelectScenarioForMentor,
}) => {
  // Input parameters
  const [landAcres, setLandAcres] = useState<number>(3);
  const [waterLevel, setWaterLevel] = useState<
    'High (Canal/Borewell)' | 'Moderate (Drip/Rainfed)' | 'Low (Deficit/Tanker)'
  >('Moderate (Drip/Rainfed)');
  const [budgetInr, setBudgetInr] = useState<number>(150000);
  const [riskTolerance, setRiskTolerance] = useState<
    'Low (Safe Staples)' | 'Balanced' | 'High (High-Margin Specialty)'
  >('Balanced');
  const [soilType, setSoilType] = useState<string>(village.soilTypes[0] || 'Alluvial Loam');

  React.useEffect(() => {
    if (village.soilTypes && village.soilTypes.length > 0) {
      setSoilType(village.soilTypes[0]);
    }
  }, [village.id, village.soilTypes]);

  const [loading, setLoading] = useState<boolean>(false);
  const [scenarios, setScenarios] = useState<SimulationScenario[]>([
    {
      id: 'scen-01',
      cropName: 'Organic Turmeric + Intercrop Cowpea',
      category: 'Spices & Legumes',
      expectedYieldPerAcre: '4.2 Tons Rhizomes / Acre',
      estimatedGrossRevenue: landAcres * 125000,
      estimatedCost: landAcres * 42000,
      expectedNetProfit: landAcres * 83000,
      roiPercentage: 197,
      waterUsageLiters: landAcres * 650000,
      waterEfficiencyRating: 'A+',
      riskScorePct: 18,
      crowdCompetitionIndex: 12,
      keyAdvantages: [
        '32% export price surge in Future Demand Radar',
        'Drip fertigation cuts water by 45%',
        'Cowpea intercrop fixes nitrogen naturally',
      ],
      riskFactors: ['Requires proper curing post harvest'],
      marketOutlook: 'Rapid Surge in Ayurvedic & Organic wellness markets.',
    },
    {
      id: 'scen-02',
      cropName: 'Hybrid Ethanol Maize',
      category: 'Cereal & Biofuel Feedstock',
      expectedYieldPerAcre: '3.8 Tons Grain / Acre',
      estimatedGrossRevenue: landAcres * 85000,
      estimatedCost: landAcres * 32000,
      expectedNetProfit: landAcres * 53000,
      roiPercentage: 165,
      waterUsageLiters: landAcres * 820000,
      waterEfficiencyRating: 'A',
      riskScorePct: 15,
      crowdCompetitionIndex: 25,
      keyAdvantages: [
        'Assured Government Ethanol Purchase Floor Price',
        'Low labor requirement',
        'Short 100-day harvest cycle',
      ],
      riskFactors: ['Potential fall armyworm pest watch'],
      marketOutlook: '20% Ethanol Blending Mandate guarantees buyer off-take.',
    },
    {
      id: 'scen-03',
      cropName: 'Oyster Mushroom Shed + Exotic Vegetables',
      category: 'Specialty High-Value',
      expectedYieldPerAcre: '6.5 Tons High-Value Produce',
      estimatedGrossRevenue: landAcres * 210000,
      estimatedCost: landAcres * 68000,
      expectedNetProfit: landAcres * 142000,
      roiPercentage: 208,
      waterUsageLiters: landAcres * 180000,
      waterEfficiencyRating: 'A+',
      riskScorePct: 28,
      crowdCompetitionIndex: 8,
      keyAdvantages: [
        'Highest net income per square meter',
        'Minimal water (90% lower than rice)',
        'Harvest every 25 days continuously',
      ],
      riskFactors: ['Requires local climate control in summer'],
      marketOutlook: 'Direct supply contracts with hotels & urban organic stores.',
    },
  ]);

  const runSimulation = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/simulate-scenarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          landAcres,
          waterLevel,
          budgetInr,
          riskTolerance,
          soilType,
          villageName: village.name,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.scenarios && data.scenarios.length > 0) {
          setScenarios(data.scenarios);
        }
      }
    } catch (err) {
      console.warn('Using client-calculated scenarios fallback', err);
      // Fallback update calculations based on inputs
      setScenarios([
        {
          id: 'scen-01',
          cropName: 'Organic Turmeric & Spices',
          category: 'Spices',
          expectedYieldPerAcre: '4.5 Tons / Acre',
          estimatedGrossRevenue: landAcres * 130000,
          estimatedCost: landAcres * 45000,
          expectedNetProfit: landAcres * 85000,
          roiPercentage: 188,
          waterUsageLiters: landAcres * 600000,
          waterEfficiencyRating: 'A+',
          riskScorePct: 20,
          crowdCompetitionIndex: 14,
          keyAdvantages: ['High export price surge', 'Drip water saving'],
          riskFactors: ['Requires 8 months duration'],
          marketOutlook: 'Strong wellness demand surge.',
        },
        {
          id: 'scen-02',
          cropName: 'Biofuel Hybrid Maize',
          category: 'Cereal',
          expectedYieldPerAcre: '3.6 Tons / Acre',
          estimatedGrossRevenue: landAcres * 88000,
          estimatedCost: landAcres * 30000,
          expectedNetProfit: landAcres * 58000,
          roiPercentage: 193,
          waterUsageLiters: landAcres * 780000,
          waterEfficiencyRating: 'A',
          riskScorePct: 12,
          crowdCompetitionIndex: 22,
          keyAdvantages: ['Guaranteed price floor', 'Low risk'],
          riskFactors: ['Drying requirement'],
          marketOutlook: 'Ethanol procurement mandate.',
        },
        {
          id: 'scen-03',
          cropName: 'Dragonfruit & Exotic Fruit',
          category: 'Specialty',
          expectedYieldPerAcre: '5.0 Tons / Acre',
          estimatedGrossRevenue: landAcres * 220000,
          estimatedCost: landAcres * 70000,
          expectedNetProfit: landAcres * 150000,
          roiPercentage: 214,
          waterUsageLiters: landAcres * 300000,
          waterEfficiencyRating: 'A+',
          riskScorePct: 30,
          crowdCompetitionIndex: 6,
          keyAdvantages: ['25-year plantation lifetime', 'Drought resilient'],
          riskFactors: ['High initial trellising cost'],
          marketOutlook: 'Premium urban superfood demand.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-emerald-950 border border-emerald-800/80 px-3 py-1 rounded-full text-xs font-semibold text-emerald-300 mb-2">
              <Sliders className="w-3.5 h-3.5 text-emerald-400" />
              Core Feature 2 — Predictive Decision Simulator
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              What-If Crop Decision Simulator
            </h2>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Acts like <strong>Google Maps for farming decisions</strong>. Plug in your land size, water, and budget to preview projected profit, water consumption, and market risk scores across 3 future crop paths.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Inputs Control Panel */}
        <div className="lg:col-span-1 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Sliders className="w-4 h-4 text-emerald-400" />
            Simulation Parameters
          </h3>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Land Size (Acres)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="0.5"
                max="25"
                step="0.5"
                value={landAcres}
                onChange={(e) => setLandAcres(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <span className="font-mono font-bold text-emerald-400 text-sm bg-slate-950 px-2.5 py-1 rounded border border-slate-800 shrink-0">
                {landAcres} Acres
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Water Source & Availability
            </label>
            <select
              value={waterLevel}
              onChange={(e: any) => setWaterLevel(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 outline-none focus:border-emerald-500"
            >
              <option value="High (Canal/Borewell)">High (Canal / Unlimited Borewell)</option>
              <option value="Moderate (Drip/Rainfed)">Moderate (Solar Drip / Rainfed)</option>
              <option value="Low (Deficit/Tanker)">Low (Water Deficit / Tanker Supply)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Operating Budget (₹)
            </label>
            <input
              type="number"
              step="10000"
              value={budgetInr}
              onChange={(e) => setBudgetInr(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 outline-none focus:border-emerald-500 font-mono"
            />
            <span className="text-[10px] text-slate-500 mt-1 block">
              Approx ₹{Math.round(budgetInr / landAcres).toLocaleString()} / Acre
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Risk Tolerance & Goal
            </label>
            <select
              value={riskTolerance}
              onChange={(e: any) => setRiskTolerance(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 outline-none focus:border-emerald-500"
            >
              <option value="Low (Safe Staples)">Low Risk (Safe Government Floor Price)</option>
              <option value="Balanced">Balanced (High Margin + Moderate Safety)</option>
              <option value="High (High-Margin Specialty)">High Risk & High Return (Exotic & Spices)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Soil Type
            </label>
            <select
              value={soilType}
              onChange={(e) => setSoilType(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 outline-none focus:border-emerald-500"
            >
              <option value="Alluvial Heavy Loam">Alluvial Heavy Loam (Punjab/UP)</option>
              <option value="Black Basalt Clay">Black Basalt Clay (Maharashtra/MP)</option>
              <option value="Red Sandy Loam">Red Sandy Loam (AP/Telangana/TN)</option>
            </select>
          </div>

          <button
            onClick={runSimulation}
            disabled={loading}
            className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" /> Simulating Options...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" /> Recalculate 3 Scenarios
              </>
            )}
          </button>
        </div>

        {/* Right Output Comparison Cards */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <PieChart className="w-4 h-4 text-emerald-400" />
              Predicted Crop Scenarios for {landAcres} Acres in {village.name}
            </h3>
            <span className="text-xs text-slate-400">
              Comparing <strong>Profit vs. Water vs. Risk</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {scenarios.map((scen, idx) => {
              const isBestOverall = idx === 0;
              return (
                <div
                  key={scen.id || idx}
                  className={`bg-slate-900 border rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 hover:border-emerald-500/80 relative ${
                    isBestOverall
                      ? 'border-emerald-500/80 bg-slate-900/90 shadow-xl shadow-emerald-950/40'
                      : 'border-slate-800'
                  }`}
                >
                  {isBestOverall && (
                    <div className="absolute -top-3 left-4 bg-emerald-500 text-slate-950 font-bold text-[10px] uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow">
                      <Award className="w-3 h-3" /> Top Recommended Path
                    </div>
                  )}

                  <div>
                    <div className="text-xs text-emerald-400 font-semibold uppercase tracking-wider mb-1">
                      Scenario {String.fromCharCode(65 + idx)} • {scen.category}
                    </div>
                    <h4 className="text-lg font-bold text-white mb-3">
                      {scen.cropName}
                    </h4>

                    {/* Financial Summary Highlight Box */}
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 space-y-2 mb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                          <DollarSign className="w-3.5 h-3.5 text-emerald-400" /> Expected Net Profit
                        </span>
                        <span className="text-base font-extrabold text-emerald-400 font-mono">
                          ₹{scen.expectedNetProfit.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500">Gross Revenue</span>
                        <span className="text-slate-300 font-mono">
                          ₹{scen.estimatedGrossRevenue.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500">Input Cost</span>
                        <span className="text-slate-300 font-mono">
                          ₹{scen.estimatedCost.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800">
                        <span className="text-slate-400">Projected ROI</span>
                        <span className="text-emerald-300 font-mono font-bold">
                          +{scen.roiPercentage}%
                        </span>
                      </div>
                    </div>

                    {/* Water & Risk Indicators */}
                    <div className="space-y-2.5 text-xs mb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 flex items-center gap-1">
                          <Droplets className="w-3.5 h-3.5 text-cyan-400" /> Water Consumed
                        </span>
                        <span className="font-mono text-slate-200">
                          {(scen.waterUsageLiters / 1000000).toFixed(2)} Million L
                          <span className="ml-1 text-[10px] bg-cyan-950 text-cyan-300 px-1.5 py-0.2 rounded">
                            {scen.waterEfficiencyRating}
                          </span>
                        </span>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-slate-400 flex items-center gap-1">
                            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" /> Market Risk Score
                          </span>
                          <span className="font-mono font-bold text-slate-200">
                            {scen.riskScorePct}/100
                          </span>
                        </div>
                        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${
                              scen.riskScorePct > 40
                                ? 'bg-rose-500'
                                : scen.riskScorePct > 20
                                ? 'bg-amber-500'
                                : 'bg-emerald-500'
                            }`}
                            style={{ width: `${scen.riskScorePct}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    {/* Key Advantages List */}
                    <div className="space-y-1.5 text-xs mb-4">
                      <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">
                        Key Advantages
                      </span>
                      {scen.keyAdvantages.map((adv, i) => (
                        <div key={i} className="flex items-start gap-1.5 text-slate-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{adv}</span>
                        </div>
                      ))}
                    </div>

                    <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800 text-[11px] text-slate-400 italic">
                      💡 Market Outlook: {scen.marketOutlook}
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-800/80">
                    {onSelectScenarioForMentor && (
                      <button
                        onClick={() => onSelectScenarioForMentor(scen)}
                        className="w-full py-2 bg-slate-800 hover:bg-emerald-600 hover:text-slate-950 text-emerald-300 font-semibold text-xs rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        Ask AI Mentor about Scenario {String.fromCharCode(65 + idx)} <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
