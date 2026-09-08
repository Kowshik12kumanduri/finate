import React from 'react';
import {
  Lightbulb,
  Sparkles,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Zap,
  CheckCircle2
} from 'lucide-react';
import { useFinance } from '../../context/FinancialContext';

export const RecommendationsView: React.FC = () => {
  const { recommendations, formatAmount, setActiveTab } = useFinance();

  const totalPotentialAnnualSavings = 26400;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Lightbulb className="w-6 h-6 text-amber-400" />
            <h1 className="text-2xl font-black text-white tracking-tight">Prescriptive Financial Recommendations</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Data-backed action items ranked by return on capital and risk reduction
          </p>
        </div>
      </div>

      {/* Top Banner Potential Wealth Multiplier */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-900/40 via-purple-900/30 to-slate-900 border border-indigo-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-300 font-mono">
            Annual Wealth Optimization Opportunity
          </span>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono">
            +{formatAmount(totalPotentialAnnualSavings)} / year
          </div>
          <p className="text-xs text-slate-300">
            Unlocking idle cash sweep yields, eliminating surge commute premiums, and auditing subscriptions
          </p>
        </div>
        <button
          onClick={() => setActiveTab('advisor')}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-2 transition shadow-lg shadow-indigo-600/25 active:scale-95 shrink-0"
        >
          <Sparkles className="w-4 h-4" />
          <span>Ask Advisor for Step-by-Step Plan</span>
        </button>
      </div>

      {/* Recommendations Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {recommendations.map(rec => (
          <div
            key={rec.id}
            className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between space-y-4 hover:border-slate-700 transition"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {rec.type}
                </span>
                <span className="text-xs font-bold text-emerald-400 font-mono">
                  Impact: {formatAmount(rec.impactAmountRupees)}
                </span>
              </div>

              <h3 className="text-base font-extrabold text-white">{rec.title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed">{rec.summary}</p>

              <div className="space-y-1.5 pt-1">
                {rec.whyExplanation.map((reason, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-[11px] text-slate-400">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5 text-indigo-400" />
                    <span>{reason}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setActiveTab(rec.actionTab)}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-indigo-300 hover:text-white text-xs font-bold flex items-center justify-center gap-1.5 border border-slate-700/80 transition"
            >
              <span>{rec.actionLabel}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};