import React, { useState } from 'react';
import {
  PieChart,
  BarChart3,
  TrendingUp,
  CreditCard,
  Smartphone,
  ArrowUpRight,
  Filter
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { useFinance } from '../../context/FinancialContext';
import { categoryColors } from '../../data/defaultData';

export const SpendingAnalysisView: React.FC = () => {
  const { budgets, transactions, formatAmount } = useFinance();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const chartData = budgets.map(b => ({
    category: b.category.split(' ')[0], // short label
    fullName: b.category,
    spent: b.spent,
    budget: b.monthlyBudget,
    color: categoryColors[b.category] || '#64748B'
  }));

  // Payment method breakdown
  const paymentMethods = [
    { method: 'UPI', count: 12, amount: 28430, icon: Smartphone },
    { method: 'Credit Card', count: 4, amount: 18150, icon: CreditCard },
    { method: 'Auto-Debit EMI', count: 1, amount: 8500, icon: BarChart3 },
    { method: 'NetBanking', count: 2, amount: 70000, icon: TrendingUp },
  ];

  const filteredTransactions = selectedCategory === 'All'
    ? transactions.filter(t => t.type === 'expense')
    : transactions.filter(t => t.type === 'expense' && t.category === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Spending & Merchant Analytics</h1>
          <p className="text-xs text-slate-400 mt-1">
            Deep granular analytics connecting expenses, payment methods, and optimization levers
          </p>
        </div>
      </div>

      {/* Category Budget vs Actual Chart */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-sm font-bold text-white">Budget vs. Actual Spend by Category</h3>
            <p className="text-[11px] text-slate-400">Compare allocated thresholds against actual monthly run rate</p>
          </div>
          <div className="flex items-center gap-3 text-[10px] font-mono text-slate-400">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 inline-block"></span>
              Spent
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-700 inline-block"></span>
              Budget
            </span>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 20 }}>
              <XAxis dataKey="category" stroke="#475569" tick={{ fontSize: 10 }} angle={-25} textAnchor="end" />
              <YAxis stroke="#475569" tick={{ fontSize: 10 }} tickFormatter={v => `₹${v / 1000}k`} />
              <Tooltip
                contentStyle={{ backgroundColor: '#090D16', borderColor: '#1E293B', borderRadius: '12px', fontSize: '11px' }}
                formatter={(val: any, name: any) => [formatAmount(Number(val)), name === 'spent' ? 'Spent' : 'Budget']}
              />
              <Bar dataKey="spent" fill="#6366F1" radius={[6, 6, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.spent > entry.budget ? '#EF4444' : entry.color}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Payment Channels Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {paymentMethods.map(pm => {
          const Icon = pm.icon;
          return (
            <div key={pm.method} className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400">{pm.method}</span>
                <div className="w-8 h-8 rounded-xl bg-indigo-500/15 text-indigo-400 flex items-center justify-center">
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3 text-lg font-black text-white font-mono">{formatAmount(pm.amount)}</div>
              <div className="mt-1 text-[11px] text-slate-500">{pm.count} transactions recorded</div>
            </div>
          );
        })}
      </div>

      {/* Category Filter & Ledger */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-sm font-bold text-white">Expense Audit Ledger</h3>
            <p className="text-[11px] text-slate-400">Filter expenses by category to inspect transaction history</p>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
            >
              <option value="All">All Categories</option>
              {budgets.map(b => (
                <option key={b.id} value={b.category}>
                  {b.category}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="divide-y divide-slate-800">
          {filteredTransactions.map(tx => (
            <div key={tx.id} className="py-3 flex items-center justify-between text-xs">
              <div>
                <div className="font-bold text-white">{tx.description}</div>
                <div className="text-[10px] text-slate-400 flex items-center gap-2 mt-0.5 font-mono">
                  <span>{tx.date}</span>
                  <span>•</span>
                  <span>{tx.paymentMethod}</span>
                  <span>•</span>
                  <span>{tx.category}</span>
                </div>
              </div>
              <div className="text-right">
                <span className="font-mono font-bold text-rose-400">-{formatAmount(tx.amount)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};