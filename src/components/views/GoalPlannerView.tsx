import React, { useState } from 'react';
import {
  Target,
  Flame,
  Plus,
  ShieldCheck,
  Building2,
  Plane,
  Sparkles,
  TrendingUp,
  CheckCircle2
} from 'lucide-react';
import { useFinance } from '../../context/FinancialContext';

export const GoalPlannerView: React.FC = () => {
  const { goals, updateGoalProgress, addGoal, formatAmount, monthlyIncome, monthlyExpenses } = useFinance();

  // FIRE Calculator state
  const [annualExpenseInput, setAnnualExpenseInput] = useState(monthlyExpenses * 12 || 513000);
  const [swrPercent, setSwrPercent] = useState(4.0); // 4% safe withdrawal rule
  const [monthlySipInput, setMonthlySipInput] = useState(15000);
  const [currentInvested, setCurrentInvested] = useState(260000);

  // FIRE Math
  const standardFireCorpus = Math.round(annualExpenseInput * (100 / swrPercent));
  const leanFireCorpus = Math.round(standardFireCorpus * 0.75);
  const fatFireCorpus = Math.round(standardFireCorpus * 1.5);

  // Time to reach FIRE with 12% annual compounding
  const r = 0.12 / 12; // monthly rate
  const pv = currentInvested;
  const pmt = monthlySipInput;
  const fv = standardFireCorpus;

  // Approximate nper
  let monthsToFire = 0;
  if (pmt > 0) {
    monthsToFire = Math.round(
      Math.log((fv * r + pmt) / (pv * r + pmt)) / Math.log(1 + r)
    );
  }
  const yearsToFire = Math.max(1, Math.round((monthsToFire / 12) * 10) / 10);
  const fireAge = 28 + Math.round(yearsToFire);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Target className="w-6 h-6 text-pink-400" />
            <h1 className="text-2xl font-black text-white tracking-tight">Milestone Goals & FIRE Independence Engine</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Track capital allocation milestones and compute your Financial Independence, Retire Early (FIRE) trajectory
          </p>
        </div>
      </div>

      {/* FIRE Spotlight Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-pink-950/40 via-purple-950/30 to-slate-900 border border-pink-500/30 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-pink-500/20 text-pink-400">
              <Flame className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-pink-300 font-mono">
                FIRE Readiness Engine (4% SWR)
              </span>
              <h3 className="text-xl font-black text-white">Projected Retirement Age: {fireAge} Years</h3>
            </div>
          </div>
          <div className="text-right font-mono text-xs text-slate-400">
            <div>Target Corpus: <strong className="text-white">{formatAmount(standardFireCorpus)}</strong></div>
            <div>Time Horizon: <strong className="text-pink-300">{yearsToFire} years</strong></div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-500 font-mono">Lean FIRE (Frugal)</span>
            <div className="text-lg font-black text-white font-mono mt-1">{formatAmount(leanFireCorpus)}</div>
            <p className="text-[10px] text-slate-400 mt-0.5">Covers core housing, nutrition & healthcare</p>
          </div>

          <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/30">
            <span className="text-[10px] uppercase font-bold text-indigo-400 font-mono">Standard FIRE (Current Lifestyle)</span>
            <div className="text-lg font-black text-indigo-300 font-mono mt-1">{formatAmount(standardFireCorpus)}</div>
            <p className="text-[10px] text-slate-400 mt-0.5">Maintains 100% of current living standard</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-500 font-mono">Fat FIRE (Abundant)</span>
            <div className="text-lg font-black text-white font-mono mt-1">{formatAmount(fatFireCorpus)}</div>
            <p className="text-[10px] text-slate-400 mt-0.5">Includes luxury travel & discretionary buffer</p>
          </div>
        </div>
      </div>

      {/* Active Financial Goals Cards */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
          Active Financial Milestones
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {goals.map(g => {
            const percent = Math.min(100, Math.round((g.currentAmount / g.targetAmount) * 100));
            return (
              <div
                key={g.id}
                className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300">
                      {g.category}
                    </span>
                    <span className="text-xs font-mono font-bold text-emerald-400">{percent}% Complete</span>
                  </div>

                  <h4 className="text-base font-extrabold text-white">{g.name}</h4>

                  <div className="flex items-baseline justify-between text-xs pt-1">
                    <span className="text-slate-400">
                      Saved: <strong className="text-white font-mono">{formatAmount(g.currentAmount)}</strong>
                    </span>
                    <span className="text-slate-400">
                      Target: <strong className="text-slate-300 font-mono">{formatAmount(g.targetAmount)}</strong>
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-indigo-500 transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>Target Date: {g.targetDate}</span>
                    <span>Monthly SIP: {formatAmount(g.monthlyContribution)}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">Need to allocate surplus?</span>
                  <button
                    onClick={() => updateGoalProgress(g.id, 5000)}
                    className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition active:scale-95"
                  >
                    + Add {formatAmount(5000)}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};