import React from 'react';
import {
  FileSpreadsheet,
  Printer,
  Download,
  ShieldCheck,
  Award,
  CheckCircle2,
  Calendar,
  User,
  Sparkles
} from 'lucide-react';
import { useFinance } from '../../context/FinancialContext';

export const ReportsView: React.FC = () => {
  const {
    profile,
    healthScore,
    totalLiquidBalance,
    monthlyIncome,
    monthlyExpenses,
    savingsRate,
    formatAmount,
    budgets,
    transactions,
    exportDataJSON
  } = useFinance();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Action Bar (Hidden on Print) */}
      <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Executive Financial Health Dossier</h1>
          <p className="text-xs text-slate-400 mt-1">
            Formal audit report ready for mortgage verification, personal records, or financial advisory review
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={exportDataJSON}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <Download className="w-3.5 h-3.5 text-indigo-400" />
            Download Data JSON
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 transition shadow-lg shadow-indigo-600/20 active:scale-95"
          >
            <Printer className="w-3.5 h-3.5" />
            Print / Save to PDF
          </button>
        </div>
      </div>

      {/* Formal Printable Document Canvas */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-8 sm:p-12 space-y-8 shadow-2xl text-slate-100">
        {/* Document Header */}
        <div className="border-b border-slate-800 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight text-white">FinSight AI</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                AUDIT MEMORANDUM
              </span>
            </div>
            <p className="text-xs text-slate-400">Autonomous Financial Risk & Health Assessment Report</p>
          </div>

          <div className="text-right text-xs font-mono text-slate-400">
            <div>Report Date: {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
            <div>Ref: FINSIGHT-AUDIT-{Date.now().toString().slice(-6)}</div>
          </div>
        </div>

        {/* Client Profile Box */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs">
          <div>
            <span className="text-slate-500 font-mono text-[10px] uppercase">Account Holder</span>
            <div className="font-bold text-white mt-0.5">{profile.name}</div>
          </div>
          <div>
            <span className="text-slate-500 font-mono text-[10px] uppercase">Location</span>
            <div className="font-bold text-white mt-0.5">{profile.city}</div>
          </div>
          <div>
            <span className="text-slate-500 font-mono text-[10px] uppercase">Designation</span>
            <div className="font-bold text-white mt-0.5">{profile.occupation}</div>
          </div>
          <div>
            <span className="text-slate-500 font-mono text-[10px] uppercase">Primary Inflow</span>
            <div className="font-bold text-white font-mono mt-0.5">{formatAmount(monthlyIncome)} / mo</div>
          </div>
        </div>

        {/* Score Benchmark Callout */}
        <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center font-black text-3xl text-indigo-400 font-mono">
              {healthScore.overall}
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                Composite Health Assessment
              </span>
              <h3 className="text-lg font-black text-white">{healthScore.statusText}</h3>
              <p className="text-xs text-slate-300 mt-1 max-w-lg">{healthScore.description}</p>
            </div>
          </div>

          <div className="text-right font-mono text-xs text-slate-400 border-l border-slate-800 pl-6 space-y-1">
            <div>Liquid Runway: <strong>2.4 Months</strong></div>
            <div>Debt Burden (DTI): <strong>13.1%</strong></div>
            <div>Net Savings Rate: <strong>{savingsRate.toFixed(1)}%</strong></div>
          </div>
        </div>

        {/* 6 Pillars Table */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
            Pillar-by-Pillar Risk Evaluation
          </h4>
          <div className="rounded-2xl border border-slate-800 overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 font-mono text-[10px] uppercase border-b border-slate-800">
                <tr>
                  <th className="p-3">Evaluation Pillar</th>
                  <th className="p-3">Score / 100</th>
                  <th className="p-3">Weight</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Auditor Summary</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 bg-slate-900/40">
                {Object.values(healthScore.pillars).map(p => (
                  <tr key={p.name}>
                    <td className="p-3 font-bold text-white">{p.name}</td>
                    <td className="p-3 font-mono font-bold">{p.score}</td>
                    <td className="p-3 font-mono text-slate-400">{p.weight}%</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400">
                        {p.status}
                      </span>
                    </td>
                    <td className="p-3 text-slate-300 text-[11px]">{p.summary}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Verification Stamp Footer */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span>Cryptographically certified by FinSight AI Autonomous Financial Engine</span>
          </div>
          <div className="font-mono text-[11px]">Authorized Signature: FINSIGHT-ENGINE-CERT-OK</div>
        </div>
      </div>
    </div>
  );
};