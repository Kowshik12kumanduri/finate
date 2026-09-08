import React, { useState } from 'react';
import { X, CreditCard } from 'lucide-react';
import { useFinance } from '../../context/FinancialContext';
import { AccountType } from '../../types/finance';

export const AddAccountModal: React.FC = () => {
  const { isAddAccountModalOpen, setIsAddAccountModalOpen, addAccount } = useFinance();

  const [name, setName] = useState('');
  const [institution, setInstitution] = useState('');
  const [type, setType] = useState<AccountType>('Bank Account');
  const [balance, setBalance] = useState('');
  const [mask, setMask] = useState('');

  if (!isAddAccountModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !institution) return;

    addAccount({
      name,
      institution,
      type,
      balanceOrOutstanding: parseFloat(balance) || 0,
      accountNumberMask: mask ? `•••• ${mask.slice(-4)}` : '•••• 0000',
      icon: type === 'Credit Card' ? 'CreditCard' : type === 'Investments' ? 'TrendingUp' : 'Building2',
      color: '#6366F1',
      isDemo: false,
      details: `Linked user account with ${institution}.`
    });

    setName('');
    setInstitution('');
    setBalance('');
    setMask('');
    setIsAddAccountModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6 relative animate-in fade-in zoom-in-95">
        <button
          onClick={() => setIsAddAccountModalOpen(false)}
          className="absolute top-4 right-4 p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <CreditCard className="w-5 h-5 text-indigo-400" />
          <h2 className="text-base font-bold text-white">Link New Account</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Account Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Axis Salary Account"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Financial Institution
            </label>
            <input
              type="text"
              required
              value={institution}
              onChange={e => setInstitution(e.target.value)}
              placeholder="e.g. Axis Bank, Zerodha, SBI"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Account Type
              </label>
              <select
                value={type}
                onChange={e => setType(e.target.value as AccountType)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
              >
                <option value="Bank Account">Bank Account</option>
                <option value="Savings">Savings Reserve</option>
                <option value="UPI Wallet">UPI Wallet</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Loan / EMI">Loan / EMI</option>
                <option value="Investments">Investments</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Balance (INR ₹)
              </label>
              <input
                type="number"
                value={balance}
                onChange={e => setBalance(e.target.value)}
                placeholder="e.g. 50000"
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Account Last 4 Digits
            </label>
            <input
              type="text"
              maxLength={4}
              value={mask}
              onChange={e => setMask(e.target.value)}
              placeholder="e.g. 9182"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="pt-3 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsAddAccountModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/20 transition active:scale-95"
            >
              Link Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};