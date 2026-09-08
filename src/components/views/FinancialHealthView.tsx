import React from 'react';
import {
  HeartPulse,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Target,
  Users
} from 'lucide-react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip
} from 'recharts';
import { useFinance } from '../../context/FinancialContext';

export const FinancialHealthView: React.FC = () => {
  const { healthScore, setIsExplainModalOpen, setActiveTab } = useFinance();

  const radarData = [
    { pillar: 'Spending', score: healthScore.pillars.spendingBehavior.score, benchmark: 70 },
    { pillar: 'Savings', score: healthScore.pillars.savingsConsistency.score, benchmark: 65 },
    { pillar: 'Debt (DTI)', score: healthScore.pillars.debtBurden.score, benchmark: 60 },
    { pillar: 'Stability', score: healthScore.pillars.cashFlowStability.score, benchmark: 75 },
    { pillar: 'Emergency', score: healthScore.pillars.emergencyFund.score, benchmark: 55 },
    { pillar: 'Recurring', score: healthScore.pillars.recurringExpenses.score, benchmark: 68 },
  ];

  const pillarsList = Object.values(healthScore.pillars);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <HeartPulse className="w-6 h-6 text-emerald-400" />
            <h1 className="text-2xl font-black text-white tracking-tight">Predictive Financial Health Diagnostic</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Multivariate behavioral scoring calibrated against Reserve Bank of India risk standards
          </p>
        </div>
        <button
          onClick={() => setIsExplainModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 transition shadow-lg shadow-indigo-600/20 active:scale-95"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Explain Scoring Formula
        </button>
      </div>

      {/* Top Banner: Score & Radar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Score Overview */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono uppercase">
              <span>Overall Score</span>
              <span>Peer Percentile: 82%</span>
            </div>

            <div className="mt-4 flex items-baseline gap-3">
              <span className="text-5xl font-black text-white font-mono">{healthScore.overall}</span>
              <span className="text-slate-500 text-base font-bold">/ 100</span>
            </div>

            <div className="mt-2 inline-block px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              {healthScore.statusText}
            </div>

            <p className="text-xs text-slate-300 mt-4 leading-relaxed">
              {healthScore.description}
            </p>
          </div>

          <div className="mt-6 p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-3 text-xs text-slate-300">
            <Users className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>
              Outperforming <strong>82% of tech professionals</strong> in Bengaluru within your salary bracket.
            </span>
          </div>
        </div>

        {/* Radar Chart */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-white">6-Pillar Strength Radar</h3>
            <div className="flex items-center gap-3 text-[10px] font-mono text-slate-400">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 inline-block"></span>
                Your Score
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-600 inline-block"></span>
                Peer Benchmark
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="pillar" stroke="#94A3B8" tick={{ fontSize: 11 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" tick={{ fontSize: 9 }} />
                <Radar name="Your Score" dataKey="score" stroke="#6366F1" fill="#6366F1" fillOpacity={0.4} />
                <Radar name="Peer Average" dataKey="benchmark" stroke="#64748B" fill="#64748B" fillOpacity={0.2} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#090D16', borderColor: '#1E293B', borderRadius: '12px', fontSize: '11px' }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 6 In-Depth Pillar Cards */}
      <div className="space-y-3">
        <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">Granular Pillar Diagnostics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pillarsList.map(p => (
            <div
              key={p.name}
              className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-white">{p.name}</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono text-slate-500">wt. {p.weight}%</span>
                    <span
                      className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full border ${
                        p.score >= 80
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                      }`}
                    >
                      {p.score}/100
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{p.summary}</p>

                {/* Positive Drivers & Risks */}
                <div className="space-y-1.5 pt-1">
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
              </div>

              {/* Action Recommendation */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-indigo-300 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 shrink-0 text-indigo-400 mt-0.5" />
                <span className="leading-snug">{p.recommendation}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};