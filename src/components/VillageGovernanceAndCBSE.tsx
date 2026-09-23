import React from 'react';
import {
  Award,
  DollarSign,
  Building,
  CheckCircle2,
  TrendingUp,
  Shield,
  PieChart,
  Target,
  Sparkles,
  Zap,
} from 'lucide-react';
import { CBSE_EVALUATION_SCORES } from '../data/mockAgricultureData';

export const VillageGovernanceAndCBSE: React.FC = () => {
  const revenueStreams = [
    {
      title: '1. Premium AI Insights',
      target: 'Commercial Farmers & Exporters',
      description:
        'Advanced micro-climate risk simulations, high-resolution satellite soil telemetry, and direct export buyer matching.',
      price: '₹299 / month or ₹2,499 / year per farm',
      badge: 'B2C SaaS',
    },
    {
      title: '2. Agribusiness & Industry API Partnerships',
      target: 'Fertilizer, Seed & Equipment Companies',
      description:
        'Anonymized regional demand forecasting feeds helping input manufacturers stock the exact seed and organic inputs required 6 months prior to sowing.',
      price: 'API Licensing based on regional queries',
      badge: 'B2B Enterprise',
    },
    {
      title: '3. Government & Panchayat Analytics Dashboard',
      target: 'District Panchayats & Agriculture Depts',
      description:
        'District-wide decision intelligence preventing state-wide price crash interventions, subsidies planning, and crop insurance risk scoring.',
      price: 'Annual State & Panchayat Subscriptions',
      badge: 'G2B Public Sector',
    },
    {
      title: '4. Certification & Agronomist Programs',
      target: 'Rural Youth & Cooperative Staff',
      description:
        'Verified micro-learning certifications for specialty farming (mushroom, hydroponics, precision drip) empowering local rural entrepreneurs.',
      price: '₹499 per certified course badge',
      badge: 'EdTech & Skills',
    },
    {
      title: '5. Rural Cooperative & FPO Subscriptions',
      target: 'Farmer Producer Organizations (FPOs)',
      description:
        'Bulk village crop map intelligence, collective seed ordering, and joint contract farming negotiations for 500+ farmer groups.',
      price: '₹15,000 / year per FPO',
      badge: 'Cooperative Model',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-emerald-950 border border-emerald-800/80 px-3 py-1 rounded-full text-xs font-semibold text-emerald-300 mb-2">
              <Award className="w-3.5 h-3.5 text-emerald-400" />
              CBSE Innovation Pitch & Business Model
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              FutureFarm OS — National Pitch Deck & Economic Engine
            </h2>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Why FutureFarm OS is a national-level winning innovation: Shifts the agricultural paradigm from <em>post-harvest assistance</em> to <strong>predictive pre-sowing village decision intelligence</strong>.
            </p>
          </div>

          <div className="bg-emerald-500 text-slate-950 p-3.5 rounded-2xl font-bold text-center shrink-0 shadow-lg shadow-emerald-500/20">
            <div className="text-2xl font-black font-mono">49.5 / 50</div>
            <div className="text-[10px] uppercase tracking-wider">CBSE Score Potential</div>
          </div>
        </div>
      </div>

      {/* CBSE Innovation Evaluation Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h3 className="text-base font-bold text-white flex items-center gap-2 mb-4">
          <Target className="w-5 h-5 text-emerald-400" />
          CBSE Innovation Scorecard Breakdown
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {CBSE_EVALUATION_SCORES.map((score, idx) => (
            <div
              key={idx}
              className="bg-slate-950 border border-slate-800/80 rounded-2xl p-4 space-y-2 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-white">{score.criteria}</span>
                  <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950 border border-emerald-800 px-2 py-0.5 rounded">
                    {score.rating} / {score.maxRating}
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {score.justification}
                </p>
              </div>

              <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden mt-2">
                <div
                  className="bg-emerald-400 h-full"
                  style={{
                    width: `${(Number(score.rating) / Number(score.maxRating)) * 100}%`,
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5-Tier Revenue Model */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h3 className="text-base font-bold text-white flex items-center gap-2 mb-4">
          <DollarSign className="w-5 h-5 text-emerald-400" />
          Sustainable Multi-Tier Revenue Model
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {revenueStreams.map((rev, i) => (
            <div
              key={i}
              className="bg-slate-950 border border-slate-800/80 rounded-2xl p-4 flex flex-col justify-between transition-all hover:border-emerald-500/50"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase bg-slate-900 text-emerald-300 px-2 py-0.5 rounded border border-slate-800 font-mono">
                    {rev.badge}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white mb-1">{rev.title}</h4>
                <div className="text-[11px] font-semibold text-emerald-400 mb-2">
                  Target: {rev.target}
                </div>
                <p className="text-xs text-slate-400 leading-relaxed mb-3">
                  {rev.description}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800/80 text-xs font-mono font-bold text-slate-200">
                💰 {rev.price}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
