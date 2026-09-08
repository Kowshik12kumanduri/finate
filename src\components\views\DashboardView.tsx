import React from 'react';
import {
  Wallet,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  ShieldAlert,
  Sparkles,
  ArrowRight,
  Calendar,
  AlertTriangle,
  Receipt,
  Plus
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { useFinance } from '../../context/FinancialContext';
import { categoryColors } from '../../data/defaultData';

export const DashboardView: React.FC = () => {
  const {
    totalLiquidBalance,
    monthlyIncome,
    monthlyExpenses,
    savingsRate,
    healthScore,
    cashFlowForecast,
    transactions,
    budgets,
    formatAmount,
    setIsExplainModalOpen,
    setIsAddTxModalOpen,
    setActiveTab,
    openDisputeModal
  } = useFinance();

  const flaggedTx = transactions.find(
    t => t.riskStatus === 'Potentially Unusual' || t.riskStatus === 'Flagged Suspicious'
  );

  // Spend by Category for Pie Chart
  const categoryData = budgets
    .filter(b => b.spent > 0)
    .map(b => ({
      name: b.category,
      value: b.spent,
      color: categoryColors[b.category] || '#64748B'
    }));

  return (
    <div className="space-y-6">
      {/* Top Welcome & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">Financial Command Center</h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time predictive liquidity, autonomous anomaly surveillance, and personalized guidance
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsExplainModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            Explain Score
          </button>
          <button
            onClick={() => setIsAddTxModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-indigo-600/20 transition active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Transaction
          </button>
        </div>
      </div>

      {/* 4 Primary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Total Liquid Reserves</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/15 flex items-center justify-center text-emerald-400">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-black text-white font-mono">{formatAmount(totalLiquidBalance)}</div>
          <div className="mt-1 text-[11px] text-emerald-400 flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>2.4 Months emergency buffer</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Monthly Inflow</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-500/15 flex items-center justify-center text-indigo-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-black text-white font-mono">{formatAmount(monthlyIncome)}</div>
          <div className="mt-1 text-[11px] text-slate-400">Salary on 1st of month</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Current Month Outflow</span>
            <div className="w-8 h-8 rounded-xl bg-rose-500/15 flex items-center justify-center text-rose-400">
              <ArrowDownRight className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-black text-white font-mono">{formatAmount(monthlyExpenses)}</div>
          <div className="mt-1 text-[11px] text-amber-400 flex items-center gap-1">
            <span>Discretionary + fixed commitments</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Net Savings Rate</span>
            <div className="w-8 h-8 rounded-xl bg-cyan-500/15 flex items-center justify-center text-cyan-400">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-black text-white font-mono">{savingsRate.toFixed(1)}%</div>
          <div className="mt-1 text-[11px] text-slate-400">
            Target: 35.0% (Gap: {Math.max(0, 35 - savingsRate).toFixed(1)}%)
          </div>
        </div>
      </div>

      {/* Main Row: Health Score & Forecast */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Health Score Spotlight Card */}
        <div className="lg:col-span-1 p-6 rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 relative flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
                FinSight Health Index
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                XAI Calibrated
              </span>
            </div>

            <div className="flex items-center gap-5 my-3">
              <div className="relative w-24 h-24 rounded-full bg-slate-950 border-4 border-indigo-500/40 flex items-center justify-center shadow-2xl shadow-indigo-500/20 shrink-0">
                <span className="text-3xl font-black text-white font-mono">{healthScore.overall}</span>
                <span className="text-[10px] text-slate-400 absolute bottom-3">/ 100</span>
              </div>
              <div>
                <div className="text-sm font-extrabold text-white">{healthScore.statusText}</div>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                  Strong savings discipline with headroom in emergency reserves.
                </p>
              </div>
            </div>

            {/* 6 Mini Pillar Progress Bars */}
            <div className="space-y-2 mt-5 pt-4 border-t border-slate-800/80">
              {Object.values(healthScore.pillars).slice(0, 4).map(p => (
                <div key={p.name} className="space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">{p.name}</span>
                    <span className="font-mono font-bold text-white">{p.score}</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        p.score >= 80 ? 'bg-emerald-400' : 'bg-amber-400'
                      }`}
                      style={{ width: `${p.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setActiveTab('health')}
            className="mt-6 w-full py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-indigo-300 text-xs font-bold flex items-center justify-center gap-1.5 border border-slate-700/60 transition"
          >
            <span>Deep Dive into 6 Pillars</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 30-Day Rolling Forecast Chart */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 relative flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <h3 className="text-sm font-bold text-white">30-Day Rolling Cash Flow Trajectory</h3>
                <p className="text-[11px] text-slate-400">Dynamic forecast modeling scheduled auto-debits and daily burn</p>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 inline-block"></span>
                  Baseline
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400/40 inline-block"></span>
                  Uncertainty Range
                </span>
              </div>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={cashFlowForecast} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="forecastGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366F1" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#6366F1" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="bandGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#06B6D4" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="dayLabel" stroke="#475569" tick={{ fontSize: 10 }} interval={4} />
                  <YAxis stroke="#475569" tick={{ fontSize: 10 }} tickFormatter={v => `₹${v / 1000}k`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#090D16', borderColor: '#1E293B', borderRadius: '12px', fontSize: '11px' }}
                    formatter={(val: any) => [formatAmount(Number(val)), 'Balance']}
                  />
                  <Area
                    type="monotone"
                    dataKey="optimisticBalance"
                    stroke="transparent"
                    fill="url(#bandGradient)"
                  />
                  <Area
                    type="monotone"
                    dataKey="cautiousBalance"
                    stroke="transparent"
                    fill="#090D16"
                  />
                  <Area
                    type="monotone"
                    dataKey="predictedBalance"
                    stroke="#6366F1"
                    strokeWidth={2.5}
                    fill="url(#forecastGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-slate-400">Upcoming auto-debit cluster: Sep 5–10 (₹11,349)</span>
            <button
              onClick={() => setActiveTab('cashflow')}
              className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
            >
              Interactive Timeline <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Flagged Anomaly Alert Banner (if exists) */}
      {flaggedTx && (
        <div className="p-4 sm:p-5 rounded-2xl bg-rose-950/25 border border-rose-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400 shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-rose-300 uppercase tracking-wider">
                  Potentially Unusual Transaction Flagged
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300">
                  {formatAmount(flaggedTx.amount)}
                </span>
              </div>
              <p className="text-xs text-slate-200 mt-1">{flaggedTx.description} on {flaggedTx.date}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">{flaggedTx.notes}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('risk-alerts')}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-700 transition"
            >
              Investigate
            </button>
            <button
              onClick={() => openDisputeModal(flaggedTx)}
              className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition shadow-lg shadow-rose-600/20"
            >
              Generate Dispute Letter
            </button>
          </div>
        </div>
      )}

      {/* Bottom Grid: Spending Breakdown & Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category Spending Donut */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-white">Monthly Allocation by Category</h3>
            <button
              onClick={() => setActiveTab('spending')}
              className="text-[11px] text-indigo-400 hover:text-indigo-300 font-bold"
            >
              View All
            </button>
          </div>

          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#090D16', borderColor: '#1E293B', borderRadius: '12px', fontSize: '11px' }}
                  formatter={(val: any) => [formatAmount(Number(val)), 'Spent']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-2">
            {categoryData.slice(0, 4).map(c => (
              <div key={c.name} className="flex items-center gap-1.5 text-[11px]">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: c.color }} />
                <span className="text-slate-400 truncate">{c.name}</span>
                <span className="font-mono text-slate-200 font-bold ml-auto">{formatAmount(c.value, { compact: true })}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Transactions Stream */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white">Recent Transactions Stream</h3>
              <p className="text-[11px] text-slate-400">Verified and audited transactions ledger</p>
            </div>
            <button
              onClick={() => setActiveTab('transactions')}
              className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
            >
              View Full Ledger <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-800/80 space-y-1">
            {transactions.slice(0, 5).map(t => (
              <div key={t.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${categoryColors[t.category] || '#6366F1'}20` }}
                  >
                    <Receipt className="w-4 h-4" style={{ color: categoryColors[t.category] || '#6366F1' }} />
                  </div>
                  <div>
                    <div className="font-bold text-white truncate max-w-[180px] sm:max-w-xs">{t.description}</div>
                    <div className="text-[10px] text-slate-400 flex items-center gap-2 mt-0.5">
                      <span className="font-mono">{t.date}</span>
                      <span>•</span>
                      <span>{t.paymentMethod}</span>
                      {t.riskStatus !== 'Normal' && (
                        <span className="px-1 py-0.2 rounded bg-rose-500/20 text-rose-300 font-bold text-[9px]">
                          {t.riskStatus}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div
                    className={`font-mono font-bold ${
                      t.type === 'income' ? 'text-emerald-400' : 'text-slate-100'
                    }`}
                  >
                    {t.type === 'income' ? '+' : '-'}{formatAmount(t.amount)}
                  </div>
                  <div className="text-[10px] text-slate-500">{t.category}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};