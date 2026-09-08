import React from 'react';
import { X, Sparkles, CheckCircle2, AlertTriangle, ShieldCheck, ArrowRight } from 'lucide-react';
import { useFinance } from '../../context/FinancialContext';

export const ExplainableHealthModal: React.FC = () => {
  const { isExplainModalOpen, setIsExplainModalOpen, healthScore, setActiveTab } = useFinance();

  if (!isExplainModalOpen) return null;

  const pillarsList = Object.values(healthScore.pillars);

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-3xl rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-6 sm:p-8 relative animate-in fade-in zoom-in-95 max-h-[90vh] flex flex-col">
        <button
          onClick={() => setIsExplainModalOpen(false)}
          className="absolute top-5 right-5 p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-white">Explainable AI (XAI) Health Scoring Engine</h2>
            <p className="text-xs text-slate-400">Mathematical transparency into your {healthScore.overall}/100 Financial Health Score</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto space-y-5 pr-1">
          {/* Formula Callout */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-2">
            <div className="font-bold text-slate-300 font-mono text-[11px] uppercase tracking-wider">
              Scoring Weight Distribution
            </div>
            <div className="font-mono text-indigo-300 text-xs bg-slate-900 p-2.5 rounded-xl border border-slate-800 overflow-x-auto">
              Overall Score = (0.20 × Spending) + (0.20 × Savings) + (0.15 × DTI) + (0.15 × Stability) + (0.15 × Emergency) + (0.15 × Fixed Commitments)
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Scores are calibrated in real time using automated behavioral economics heuristics, Reserve Bank of India DTI recommendations, and 4-month emergency liquidity benchmarks.
            </p>
          </div>

          {/* Pillars Breakdown */}
          <div className="space-y-3">
            <div className="text-xs font-bold text-white uppercase tracking-wider">Pillar Diagnostics</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {pillarsList.map(p => (
                <div key={p.name} className="p-4 rounded-2xl bg-slate-950 border border-slate-800/90 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-white">{p.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-500 font-mono">wt. {p.weight}%</span>
                      <span className={`text-xs font-mono font-extrabold px-2 py-0.5 rounded-full border ${
                        p.score >= 80
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                      }`}>
                        {p.score}/100
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300">{p.summary}</p>

                  {/* Positive Drivers */}
                  <div className="space-y-1 pt-1">
                    {p.positiveDrivers.map((d, i) => (
                      <div key={i} className="flex items-start gap-1.5 text-[11px] text-emerald-300">
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5 text-emerald-400" />
                        <span>{d}</span>
                      </div>
                    ))}
                    {p.riskFlags.map((r, i) => (
                      <div key={i} className="flex items-start gap-1.5 text-[11px] text-amber-300">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-400" />
                        <span>{r}</span>
                      </div>
                    ))}
                  </div>

                  {/* Recommendation */}
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800/80 text-[11px] text-indigo-300 flex items-start gap-2">
                    <ShieldCheck className="w-4 h-4 shrink-0 text-indigo-400 mt-0.5" />
                    <span>{p.recommendation}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800 flex items-center justify-between mt-4">
          <span className="text-xs text-slate-400">100% Deterministic & Auditable</span>
          <button
            onClick={() => {
              setIsExplainModalOpen(false);
              setActiveTab('advisor');
            }}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 transition"
          >
            Ask FinSight AI Advisor <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};