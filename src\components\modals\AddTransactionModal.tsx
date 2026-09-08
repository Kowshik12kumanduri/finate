import React, { useState } from 'react';
import { X, PlusCircle, AlertCircle } from 'lucide-react';
import { useFinance } from '../../context/FinancialContext';
import { ExpenseCategory, PaymentMethod } from '../../types/finance';
import { categoryColors } from '../../data/defaultData';

export const AddTransactionModal: React.FC = () => {
  const { isAddTxModalOpen, setIsAddTxModalOpen, addTransaction, formatAmount } = useFinance();

  const [type, setType] = useState<'expense' | 'income'>('expense');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('Shopping & E-Commerce');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));

  if (!isAddTxModalOpen) return null;

  const numAmount = parseFloat(amount) || 0;
  const isHighValue = numAmount >= 10000 && type === 'expense';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || numAmount <= 0) return;

    addTransaction({
      date,
      time,
      description,
      category: type === 'income' ? 'Income & Salary' : category,
      amount: numAmount,
      type,
      paymentMethod,
      upiIdOrMerchant: description.slice(0, 30),
      riskStatus: isHighValue ? 'Potentially Unusual' : 'Normal',
      riskLevel: isHighValue ? 'Medium' : 'Low',
      riskReason: isHighValue ? [`Amount (${formatAmount(numAmount)}) is higher than typical transactions.`] : undefined
    });

    setDescription('');
    setAmount('');
    setIsAddTxModalOpen(false);
  };

  const categories: ExpenseCategory[] = [
    'Shopping & E-Commerce',
    'Food & Dining',
    'Transport & Commute',
    'Bills & Utilities',
    'Entertainment & Leisure',
    'Healthcare & Wellness',
    'Housing & Rent',
    'EMI & Debt Repayment',
    'Investments & Savings',
    'Education & Learning',
    'Other'
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6 relative animate-in fade-in zoom-in-95">
        <button
          onClick={() => setIsAddTxModalOpen(false)}
          className="absolute top-4 right-4 p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-5">
          <PlusCircle className="w-5 h-5 text-indigo-400" />
          <h2 className="text-base font-bold text-white">Record New Transaction</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Type Toggle */}
          <div className="grid grid-cols-2 p-1 rounded-xl bg-slate-950 border border-slate-800">
            <button
              type="button"
              onClick={() => setType('expense')}
              className={`py-2 rounded-lg text-xs font-bold transition ${
                type === 'expense' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'text-slate-400'
              }`}
            >
              Expense (-)
            </button>
            <button
              type="button"
              onClick={() => setType('income')}
              className={`py-2 rounded-lg text-xs font-bold transition ${
                type === 'income' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'text-slate-400'
              }`}
            >
              Income (+)
            </button>
          </div>

          {/* Amount & Description */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Amount (INR ₹)
            </label>
            <input
              type="number"
              required
              min="1"
              step="any"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              placeholder="e.g. 1500"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Description / Merchant
            </label>
            <input
              type="text"
              required
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="e.g. Amazon India – Books"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Category & Payment Method */}
          {type === 'expense' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Category
                </label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value as ExpenseCategory)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                >
                  {categories.map(c => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Payment Method
                </label>
                <select
                  value={paymentMethod}
                  onChange={e => setPaymentMethod(e.target.value as PaymentMethod)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                >
                  <option value="UPI">UPI</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Debit Card">Debit Card</option>
                  <option value="NetBanking">NetBanking</option>
                  <option value="Auto-Debit EMI">Auto-Debit EMI</option>
                  <option value="Cash">Cash</option>
                  <option value="Wallet">Wallet</option>
                </select>
              </div>
            </div>
          )}

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Time
              </label>
              <input
                type="text"
                value={time}
                onChange={e => setTime(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>
          </div>

          {isHighValue && (
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-2.5 text-xs text-amber-300">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                This high-value amount will be auto-flagged for review in <strong>Risk & Alerts</strong> to ensure accurate budgeting.
              </span>
            </div>
          )}

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsAddTxModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/20 transition active:scale-95"
            >
              Save Transaction
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};