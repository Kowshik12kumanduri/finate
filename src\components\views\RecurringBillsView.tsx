import React from 'react';
import {
  CalendarDays,
  Plus,
  CheckCircle2,
  Clock,
  Zap,
  Building2,
  CreditCard,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { useFinance } from '../../context/FinancialContext';

export const RecurringBillsView: React.FC = () => {
  const { recurringBills, toggleBillPaid, setIsAddBillModalOpen, formatAmount } = useFinance();

  const totalMonthlyCommitment = recurringBills.reduce((acc, b) => acc + b.amount, 0);
  const paidTotal = recurringBills.filter(b => b.status === 'Paid').reduce((acc, b) => acc + b.amount, 0);
  const upcomingTotal = totalMonthlyCommitment - paidTotal;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <CalendarDays className="w-6 h-6 text-indigo-400" />
            <h1 className="text-2xl font-black text-white tracking-tight">Recurring Obligations & EMI Schedules</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Automated tracking of fixed obligations, rent, mutual fund SIPs, and loan mandates
          </p>
        </div>
        <button
          onClick={() => setIsAddBillModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 transition shadow-lg shadow-indigo-600/20 active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Recurring Bill
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs font-bold text-slate-400">Total Fixed Monthly Outflow</span>
          <div className="mt-2 text-2xl font-black text-white font-mono">{formatAmount(totalMonthlyCommitment)}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">{recurringBills.length} active scheduled mandates</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs font-bold text-slate-400">Settled This Month</span>
          <div className="mt-2 text-2xl font-black text-emerald-400 font-mono">{formatAmount(paidTotal)}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">{recurringBills.filter(b => b.status === 'Paid').length} paid</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs font-bold text-slate-400">Upcoming Remaining Debits</span>
          <div className="mt-2 text-2xl font-black text-amber-400 font-mono">{formatAmount(upcomingTotal)}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Scheduled between 3rd and 15th</div>
        </div>
      </div>

      {/* Bills Schedule List */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
        <h3 className="text-sm font-bold text-white mb-2">Payment Schedule & Biller Details</h3>

        <div className="divide-y divide-slate-800/80">
          {recurringBills.map(bill => (
            <div key={bill.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-start sm:items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                    bill.status === 'Paid' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-indigo-500/15 text-indigo-400'
                  }`}
                >
                  <CalendarDays className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm text-white">{bill.name}</span>
                    {bill.isAutoDebit && (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        Auto-Debit
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                    <span className="text-slate-300">{bill.billerName}</span>
                    <span>•</span>
                    <span className="font-mono text-slate-400">Due: {bill.dueDate}</span>
                    <span>•</span>
                    <span>{bill.paymentMethod}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-4">
                <div className="text-right">
                  <div className="text-base font-black text-white font-mono">{formatAmount(bill.amount)}</div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      bill.status === 'Paid'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-amber-500/20 text-amber-300'
                    }`}
                  >
                    {bill.status}
                  </span>
                </div>

                <button
                  onClick={() => toggleBillPaid(bill.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                    bill.status === 'Paid'
                      ? 'bg-slate-800 text-slate-400 hover:text-white'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white font-bold'
                  }`}
                >
                  {bill.status === 'Paid' ? 'Mark Upcoming' : 'Mark as Paid'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};