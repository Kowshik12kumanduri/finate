import React from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  FileText,
  CheckCircle2,
  Clock,
  Store,
  DollarSign
} from 'lucide-react';
import { useFinance } from '../../context/FinancialContext';

export const RiskAlertsView: React.FC = () => {
  const { transactions, resolveAnomaly, openDisputeModal, formatAmount, unresolvedAnomaliesCount } = useFinance();

  const flaggedTransactions = transactions.filter(
    t => t.riskStatus === 'Potentially Unusual' || t.riskStatus === 'Flagged Suspicious'
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-rose-400" />
            <h1 className="text-2xl font-black text-white tracking-tight">Autonomous Anomaly & Risk Surveillance</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time heuristic fraud scoring, merchant verification, and automated dispute resolution
          </p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
          unresolvedAnomaliesCount > 0
            ? 'bg-rose-500/20 text-rose-300 border-rose-500/30 animate-pulse'
            : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
        }`}>
          {unresolvedAnomaliesCount > 0 ? `${unresolvedAnomaliesCount} Anomaly Flagged` : 'System Secure (0 Threats)'}
        </span>
      </div>

      {/* Flagged Transactions Deep-Dive */}
      <div className="space-y-4">
        {flaggedTransactions.length === 0 ? (
          <div className="p-12 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-3">
            <ShieldCheck className="w-12 h-12 text-emerald-400 mx-auto" />
            <h3 className="text-base font-bold text-white">All Clear — Zero Anomaly Alerts</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Your financial streams and recent transaction signatures are 100% compliant with your established spending baseline.
            </p>
          </div>
        ) : (
          flaggedTransactions.map(tx => (
            <div
              key={tx.id}
              className="p-6 rounded-3xl bg-slate-900 border border-rose-500/40 shadow-xl space-y-5"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="p-3 rounded-2xl bg-rose-500/20 text-rose-400">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">
                        {tx.riskStatus}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        Level: {tx.riskLevel}
                      </span>
                    </div>
                    <h3 className="text-base font-black text-white mt-1">{tx.description}</h3>
                    <div className="text-xs text-slate-400 font-mono mt-0.5">
                      {tx.date} at {tx.time || '02:45 AM'} • {tx.paymentMethod}
                    </div>
                  </div>
                </div>

                <div className="sm:text-right">
                  <div className="text-2xl font-black text-white font-mono">{formatAmount(tx.amount)}</div>
                  <div className="text-[11px] text-slate-400">{tx.category}</div>
                </div>
              </div>

              {/* Anomaly Drivers Breakdown */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                  Why FinSight Flagged This Transaction:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                    <div className="flex items-center gap-1.5 text-rose-400 font-bold mb-1">
                      <DollarSign className="w-4 h-4" /> Amount Spike
                    </div>
                    <p className="text-[11px] text-slate-300">
                      3.4x higher than standard median shopping expenditure (₹3,600).
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                    <div className="flex items-center gap-1.5 text-amber-400 font-bold mb-1">
                      <Clock className="w-4 h-4" /> Off-Peak Timestamp
                    </div>
                    <p className="text-[11px] text-slate-300">
                      Executed at 02:45 AM, deviating from daytime activity hours.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                    <div className="flex items-center gap-1.5 text-cyan-400 font-bold mb-1">
                      <Store className="w-4 h-4" /> Merchant Deviation
                    </div>
                    <p className="text-[11px] text-slate-300">
                      Uncommon luxury consumer tech merchant without transaction history.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <span className="text-xs text-slate-400">
                  Did you make this purchase or suspect unauthorized card skimming?
                </span>
                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => resolveAnomaly(tx.id, 'Resolved Safe')}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    I Recognize This (Mark Safe)
                  </button>
                  <button
                    onClick={() => openDisputeModal(tx)}
                    className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-1.5 transition shadow-lg shadow-rose-600/20 active:scale-95"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    Generate Bank Dispute Notice
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};