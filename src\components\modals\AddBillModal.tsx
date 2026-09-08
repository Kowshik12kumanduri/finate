import React, { useState } from 'react';
import { X, CalendarDays } from 'lucide-react';
import { useFinance } from '../../context/FinancialContext';
import { ExpenseCategory, PaymentMethod } from '../../types/finance';

export const AddBillModal: React.FC = () => {
  const { isAddBillModalOpen, setIsAddBillModalOpen, addRecurringBill } = useFinance();

  const [name, setName] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('Bills & Utilities');
  const [amount, setAmount] = useState('');
  const [dueDay, setDueDay] = useState(5);
  const [isAutoDebit, setIsAutoDebit] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI');
  const [billerName, setBillerName] = useState('');

  if (!isAddBillModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount) || 0;
    if (!name || numAmount <= 0) return;

    addRecurringBill({
      name,
      category,
      amount: numAmount,
      dueDate: `${String(dueDay).padStart(2, '0')} Sep`,
      dueDay: Number(dueDay),
      frequency: 'Monthly',
      paymentMethod,
      status: 'Upcoming',
      reminderEnabled: true,
      isAutoDebit,
      billerName: billerName || name
    });

    setName('');
    setAmount('');
    setIsAddBillModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6 relative animate-in fade-in zoom-in-95">
        <button
          onClick={() => setIsAddBillModalOpen(false)}
          className="absolute top-4 right-4 p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <CalendarDays className="w-5 h-5 text-indigo-400" />
          <h2 className="text-base font-bold text-white">Add Recurring Bill / EMI</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Bill / Obligation Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Jio Fiber Broadband"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Monthly Amount (₹)
              </label>
              <input
                type="number"
                required
                value={amount}
                onChange={e => setAmount(e.target.value)}
                placeholder="e.g. 1299"
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Day of Month Due
              </label>
              <input
                type="number"
                min="1"
                max="31"
                value={dueDay}
                onChange={e => setDueDay(parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Category
            </label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value as ExpenseCategory)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
            >
              <option value="Bills & Utilities">Bills & Utilities</option>
              <option value="Housing & Rent">Housing & Rent</option>
              <option value="EMI & Debt Repayment">EMI & Debt Repayment</option>
              <option value="Investments & Savings">Investments & Savings (SIP)</option>
              <option value="Entertainment & Leisure">Entertainment & Subscriptions</option>
            </select>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="autodebit"
              checked={isAutoDebit}
              onChange={e => setIsAutoDebit(e.target.checked)}
              className="rounded bg-slate-950 border-slate-700 text-indigo-600 focus:ring-0"
            />
            <label htmlFor="autodebit" className="text-xs text-slate-300 select-none">
              Automated Mandate / Standing Instruction (e-NACH)
            </label>
          </div>

          <div className="pt-3 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsAddBillModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/20 transition active:scale-95"
            >
              Save Schedule
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};