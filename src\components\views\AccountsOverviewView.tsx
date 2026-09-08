import React from 'react';
import {
  CreditCard,
  Building2,
  TrendingUp,
  Smartphone,
  Landmark,
  PiggyBank,
  Plus,
  Trash2,
  Lock
} from 'lucide-react';
import { useFinance } from '../../context/FinancialContext';

export const AccountsOverviewView: React.FC = () => {
  const { accounts, deleteAccount, setIsAddAccountModalOpen, formatAmount, totalLiquidBalance } = useFinance();

  const totalInvestments = accounts
    .filter(a => a.type === 'Investments')
    .reduce((acc, a) => acc + a.balanceOrOutstanding, 0);

  const totalDebt = accounts
    .filter(a => a.type === 'Credit Card' || a.type === 'Loan / EMI')
    .reduce((acc, a) => acc + a.balanceOrOutstanding, 0);

  const netWorth = totalLiquidBalance + totalInvestments - totalDebt;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-indigo-400" />
            <h1 className="text-2xl font-black text-white tracking-tight">Accounts & Portfolio Balances</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Aggregated real-time position across salary accounts, savings reserves, UPI, credit lines, and mutual funds
          </p>
        </div>
        <button
          onClick={() => setIsAddAccountModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 transition shadow-lg shadow-indigo-600/20 active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" />
          Link Account
        </button>
      </div>

      {/* Net Worth Summary Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs font-bold text-slate-400">Total Liquid Reserves</span>
          <div className="mt-2 text-2xl font-black text-white font-mono">{formatAmount(totalLiquidBalance)}</div>
          <div className="text-[11px] text-emerald-400 mt-0.5">Checking & savings buffer</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs font-bold text-slate-400">Investment Corpus</span>
          <div className="mt-2 text-2xl font-black text-cyan-400 font-mono">{formatAmount(totalInvestments)}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Equity SIPs & PPF</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs font-bold text-slate-400">Total Liabilities / Debt</span>
          <div className="mt-2 text-2xl font-black text-rose-400 font-mono">{formatAmount(totalDebt)}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Personal loan + credit card</div>
        </div>

        <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30">
          <span className="text-xs font-bold text-indigo-300">Estimated Net Worth</span>
          <div className="mt-2 text-2xl font-black text-white font-mono">{formatAmount(netWorth)}</div>
          <div className="text-[11px] text-indigo-300 mt-0.5">Assets minus outstanding debt</div>
        </div>
      </div>

      {/* Accounts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {accounts.map(acc => {
          const isDebt = acc.type === 'Credit Card' || acc.type === 'Loan / EMI';
          return (
            <div
              key={acc.id}
              className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center text-white"
                      style={{ backgroundColor: acc.color }}
                    >
                      {acc.type === 'Credit Card' && <CreditCard className="w-4 h-4" />}
                      {acc.type === 'Loan / EMI' && <Landmark className="w-4 h-4" />}
                      {acc.type === 'Investments' && <TrendingUp className="w-4 h-4" />}
                      {acc.type === 'Savings' && <PiggyBank className="w-4 h-4" />}
                      {acc.type === 'Bank Account' && <Building2 className="w-4 h-4" />}
                      {acc.type === 'UPI Wallet' && <Smartphone className="w-4 h-4" />}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white leading-tight">{acc.name}</h4>
                      <span className="text-[10px] text-slate-400 font-mono">{acc.accountNumberMask}</span>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    {acc.type}
                  </span>
                </div>

                <div className="pt-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    {isDebt ? 'Outstanding Balance' : 'Current Balance'}
                  </span>
                  <div
                    className={`text-2xl font-black font-mono mt-0.5 ${
                      isDebt ? 'text-rose-400' : 'text-white'
                    }`}
                  >
                    {formatAmount(acc.balanceOrOutstanding)}
                  </div>
                </div>

                <p className="text-[11px] text-slate-400 leading-relaxed">{acc.details}</p>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                <span className="text-slate-500">{acc.institution}</span>
                {!acc.isDemo && (
                  <button
                    onClick={() => deleteAccount(acc.id)}
                    className="text-rose-400 hover:text-rose-300 flex items-center gap-1 font-semibold"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Unlink
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};