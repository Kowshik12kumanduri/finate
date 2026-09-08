import React, { useState } from 'react';
import { Wallet, AlertTriangle, CheckCircle2, TrendingDown, Plus, Sparkles } from 'lucide-react';
import { useFinance } from '../../context/FinancialContext';

export const BudgetEngineView: React.FC = () => {
  const { budgets, updateBudget, formatAmount, monthlyIncome, monthlyExpenses } = useFinance();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempBudget, setTempBudget] = useState<string>('');

  const totalAllocated = budgets.reduce((acc, b) => acc + b.monthlyBudget, 0);
  const totalSpent = budgets.reduce((acc, b) => acc + b.spent, 0);
  const unallocatedSurplus = Math.max(0, monthlyIncome - totalAllocated);

  const handleStartEdit = (id: string, current: number) => {
    setEditingId(id);
    setTempBudget(String(current));
  };

  const handleSaveEdit = (id: string) => {
    const val = parseFloat(tempBudget);
    if (val > 0) {
      updateBudget(id, val);
    }
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Autonomous Budget Engine</h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time threshold monitoring with automated burn rate warnings
          </p>
        </div>
      </div>

      {/* Top Allocation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs font-bold text-slate-400">Total Monthly Budget Planned</span>
          <div className="mt-2 text-2xl font-black text-white font-mono">{formatAmount(totalAllocated)}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">{Math.round((totalAllocated / monthlyIncome) * 100)}% of income</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs font-bold text-slate-400">Actual Outflow to Date</span>
          <div className="mt-2 text-2xl font-black text-white font-mono">{formatAmount(totalSpent)}</div>
          <div className="text-[11px] text-emerald-400 mt-0.5">
            {formatAmount(Math.max(0, totalAllocated - totalSpent))} remaining
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs font-bold text-slate-400">Target Unallocated Surplus</span>
          <div className="mt-2 text-2xl font-black text-emerald-400 font-mono">{formatAmount(unallocatedSurplus)}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Reserved for investments & emergency buffer</div>
        </div>
      </div>

      {/* Budget Bars List */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-bold text-white">Active Category Allocations</h3>
          <span className="text-xs text-slate-400">Click any limit to adjust allocation</span>
        </div>

        <div className="space-y-4">
          {budgets.map(b => {
            const percent = Math.min(100, Math.round((b.spent / b.monthlyBudget) * 100));
            const isOver = b.spent > b.monthlyBudget;
            const isNear = percent >= 90 && !isOver;

            return (
              <div key={b.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: b.color }} />
                    <span className="text-xs font-bold text-white">{b.category}</span>
                    {isOver && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                        Over Budget
                      </span>
                    )}
                    {isNear && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        Near Limit
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    {editingId === b.id ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={tempBudget}
                          onChange={e => setTempBudget(e.target.value)}
                          className="w-24 px-2 py-1 rounded-lg bg-slate-900 border border-indigo-500 text-white font-mono text-xs"
                        />
                        <button
                          onClick={() => handleSaveEdit(b.id)}
                          className="px-2 py-1 rounded bg-indigo-600 text-white text-[10px] font-bold"
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleStartEdit(b.id, b.monthlyBudget)}
                        className="text-xs font-mono font-bold text-slate-300 hover:text-white"
                        title="Click to modify budget"
                      >
                        {formatAmount(b.spent)} / <span className="text-indigo-400 underline">{formatAmount(b.monthlyBudget)}</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      isOver ? 'bg-rose-500' : isNear ? 'bg-amber-400' : 'bg-indigo-500'
                    }`}
                    style={{ width: `${percent}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                  <span>{b.aiAdvice}</span>
                  <span className="font-mono font-bold text-slate-300">{percent}% utilized</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};