import React, { useState, useMemo } from 'react';
import {
  Calculator,
  CheckCircle2,
  TrendingDown,
  ArrowRight,
  ShieldCheck,
  FileText
} from 'lucide-react';
import { useFinance } from '../../context/FinancialContext';
import { calculateIndianTax } from '../../services/taxEngine';

export const TaxOptimizerView: React.FC = () => {
  const { profile, formatAmount } = useFinance();

  const [grossSalary, setGrossSalary] = useState(profile.monthlyIncomeBaseline * 12 || 780000);
  const [claimed80C, setClaimed80C] = useState(150000);
  const [claimed80D, setClaimed80D] = useState(25000);
  const [claimedHRA, setClaimedHRA] = useState(120000);

  const taxResult = useMemo(() => {
    return calculateIndianTax(grossSalary, claimed80C, claimed80D, claimedHRA);
  }, [grossSalary, claimed80C, claimed80D, claimedHRA]);

  const { oldRegime, newRegime, betterRegime, annualTaxSavings, recommendations } = taxResult;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Calculator className="w-6 h-6 text-emerald-400" />
            <h1 className="text-2xl font-black text-white tracking-tight">Indian Income Tax Optimizer (FY 2025-26 & 2026-27)</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Comparative tax liability engine between the Old and New Tax Regimes for salaried professionals
          </p>
        </div>
      </div>

      {/* Recommendation Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950/40 via-teal-950/30 to-slate-900 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300 font-mono">
            Optimized Tax Strategy
          </span>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono">
            Optimal Choice: {betterRegime}
          </div>
          <p className="text-xs text-slate-300">
            Selecting {betterRegime} yields <strong className="text-emerald-300">{formatAmount(annualTaxSavings)} in annual tax savings</strong>.
          </p>
        </div>
      </div>

      {/* Inputs & Comparison Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sliders / Inputs */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white font-mono uppercase">Taxpayer Inputs</h3>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Gross Annual Salary (CTC)
            </label>
            <input
              type="number"
              value={grossSalary}
              onChange={e => setGrossSalary(parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Section 80C Deductions (ELSS, PPF, EPF)
            </label>
            <input
              type="number"
              value={claimed80C}
              onChange={e => setClaimed80C(parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:outline-none focus:border-indigo-500"
            />
            <span className="text-[10px] text-slate-500">Max allowable under Old Regime: ₹1,50,000</span>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Section 80D Health Insurance Premium
            </label>
            <input
              type="number"
              value={claimed80D}
              onChange={e => setClaimed80D(parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              House Rent Allowance (HRA Exemption Claimed)
            </label>
            <input
              type="number"
              value={claimedHRA}
              onChange={e => setClaimedHRA(parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Side-by-Side Regime Cards */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Old Regime Card */}
          <div className={`p-6 rounded-3xl border flex flex-col justify-between space-y-4 ${
            betterRegime === 'Old Regime' ? 'bg-indigo-950/30 border-indigo-500/40 shadow-xl' : 'bg-slate-900 border-slate-800'
          }`}>
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-white uppercase font-mono">Old Tax Regime</span>
                {betterRegime === 'Old Regime' && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
                    Recommended
                  </span>
                )}
              </div>

              <div className="text-3xl font-black text-white font-mono">
                {formatAmount(oldRegime.totalTaxPayable)}
              </div>
              <div className="text-xs text-slate-400 mt-1">Effective Tax Rate: {oldRegime.effectiveRate}%</div>

              <div className="mt-4 pt-4 border-t border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Standard Deduction:</span>
                  <span className="font-mono text-white">{formatAmount(oldRegime.standardDeduction)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Section 80C Claimed:</span>
                  <span className="font-mono text-white">{formatAmount(oldRegime.section80C)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Section 80D Claimed:</span>
                  <span className="font-mono text-white">{formatAmount(oldRegime.section80D)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>HRA Exemption:</span>
                  <span className="font-mono text-white">{formatAmount(oldRegime.hraExemption)}</span>
                </div>
                <div className="flex justify-between text-slate-400 font-bold pt-2 border-t border-slate-800">
                  <span>Net Taxable Income:</span>
                  <span className="font-mono text-white">{formatAmount(oldRegime.netTaxableIncome)}</span>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-slate-400">
              Optimal when high rent receipts and investments exceed ₹3.75 Lakhs in aggregate deductions.
            </p>
          </div>

          {/* New Regime Card */}
          <div className={`p-6 rounded-3xl border flex flex-col justify-between space-y-4 ${
            betterRegime === 'New Regime' ? 'bg-indigo-950/30 border-indigo-500/40 shadow-xl' : 'bg-slate-900 border-slate-800'
          }`}>
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-white uppercase font-mono">New Tax Regime</span>
                {betterRegime === 'New Regime' && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
                    Recommended
                  </span>
                )}
              </div>

              <div className="text-3xl font-black text-white font-mono">
                {formatAmount(newRegime.totalTaxPayable)}
              </div>
              <div className="text-xs text-slate-400 mt-1">Effective Tax Rate: {newRegime.effectiveRate}%</div>

              <div className="mt-4 pt-4 border-t border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Standard Deduction:</span>
                  <span className="font-mono text-white">{formatAmount(newRegime.standardDeduction)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Rebate u/s 87A (up to 7L):</span>
                  <span className="font-mono text-white">Full Rebate</span>
                </div>
                <div className="flex justify-between text-slate-400 font-bold pt-2 border-t border-slate-800">
                  <span>Net Taxable Income:</span>
                  <span className="font-mono text-white">{formatAmount(newRegime.netTaxableIncome)}</span>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-slate-400">
              Zero documentation burden; lower tax brackets across ₹3L–₹15L slabs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};