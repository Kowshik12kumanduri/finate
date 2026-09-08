import React, { useState } from 'react';
import {
  Sparkles,
  TrendingDown,
  Clock,
  DollarSign,
  ShieldCheck,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useFinance } from '../../context/FinancialContext';

export const LoanOptimizerView: React.FC = () => {
  const { formatAmount } = useFinance();

  // Active HDFC Personal Loan details
  const principal = 142000;
  const annualRate = 11.5;
  const currentMonths = 18;
  const currentEmi = 8500;

  const [extraPrepayment, setExtraPrepayment] = useState(1500);

  // Amortization with prepayment calculation
  const monthlyRate = annualRate / 100 / 12;
  const newMonthlyPayment = currentEmi + extraPrepayment;

  let balance = principal;
  let newMonths = 0;
  let totalInterestWithPrepay = 0;

  while (balance > 0 && newMonths < 60) {
    const interest = balance * monthlyRate;
    totalInterestWithPrepay += interest;
    const principalPaid = Math.min(balance, newMonthlyPayment - interest);
    balance -= principalPaid;
    newMonths++;
  }

  // Standard total interest without prepayment
  const standardTotalInterest = currentEmi * currentMonths - principal;
  const totalInterestSaved = Math.max(0, standardTotalInterest - totalInterestWithPrepay);
  const monthsSaved = Math.max(0, currentMonths - newMonths);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-purple-400" />
            <h1 className="text-2xl font-black text-white tracking-tight">Loan EMI & Principal Prepayment Optimizer</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Simulate the interest-slashing power of automated micro-prepayments on your HDFC Personal Loan
          </p>
        </div>
      </div>

      {/* Savings Summary Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-950/40 via-indigo-950/30 to-slate-900 border border-purple-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-purple-300 font-mono">
            Calculated Prepayment ROI
          </span>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono">
            Save {formatAmount(totalInterestSaved)} in Interest
          </div>
          <p className="text-xs text-slate-300">
            Paying an extra <strong>{formatAmount(extraPrepayment)}/month</strong> closes your loan <strong>{monthsSaved} months earlier</strong>!
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-right font-mono text-xs">
          <div>Original Tenure: <strong>{currentMonths} Months</strong></div>
          <div className="text-emerald-400">Optimized Tenure: <strong>{newMonths} Months</strong></div>
        </div>
      </div>

      {/* Prepayment Slider Card */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white">Monthly Additional Prepayment Amount</h3>
          <span className="text-base font-black text-purple-400 font-mono">+{formatAmount(extraPrepayment)} / mo</span>
        </div>

        <input
          type="range"
          min="500"
          max="5000"
          step="250"
          value={extraPrepayment}
          onChange={e => setExtraPrepayment(Number(e.target.value))}
          className="w-full accent-purple-500 cursor-pointer"
        />

        <div className="flex justify-between text-[11px] text-slate-500 font-mono">
          <span>+₹500/mo</span>
          <span>+₹2,500/mo</span>
          <span>+₹5,000/mo</span>
        </div>
      </div>

      {/* Loan Snapshot Details */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs font-bold text-slate-400">Current Outstanding Principal</span>
          <div className="mt-2 text-xl font-black text-white font-mono">{formatAmount(principal)}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">HDFC Bank Retail Loan</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs font-bold text-slate-400">Annual Interest Rate</span>
          <div className="mt-2 text-xl font-black text-white font-mono">{annualRate}% p.a.</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Fixed reducing balance</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs font-bold text-slate-400">Base Monthly EMI</span>
          <div className="mt-2 text-xl font-black text-white font-mono">{formatAmount(currentEmi)}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Auto-debit on 10th of month</div>
        </div>
      </div>
    </div>
  );
};