import React, { useState, useMemo } from 'react';
import {
  ReceiptText,
  Search,
  Filter,
  Plus,
  UploadCloud,
  Download,
  Trash2,
  ShieldAlert,
  CheckCircle2,
  FileText
} from 'lucide-react';
import { useFinance } from '../../context/FinancialContext';
import { categoryColors } from '../../data/defaultData';
import { ExpenseCategory } from '../../types/finance';

export const TransactionsView: React.FC = () => {
  const {
    transactions,
    deleteTransaction,
    setIsAddTxModalOpen,
    setIsCSVImportModalOpen,
    formatAmount,
    openDisputeModal
  } = useFinance();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedRisk, setSelectedRisk] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');

  const filtered = useMemo(() => {
    return transactions.filter(t => {
      const matchSearch =
        t.description.toLowerCase().includes(search.toLowerCase()) ||
        t.category.toLowerCase().includes(search.toLowerCase()) ||
        (t.upiIdOrMerchant && t.upiIdOrMerchant.toLowerCase().includes(search.toLowerCase()));

      const matchCat = selectedCategory === 'All' || t.category === selectedCategory;
      const matchType = selectedType === 'All' || t.type === selectedType;
      const matchRisk =
        selectedRisk === 'All' ||
        (selectedRisk === 'Anomalies' && (t.riskStatus === 'Potentially Unusual' || t.riskStatus === 'Flagged Suspicious')) ||
        (selectedRisk === 'Normal' && t.riskStatus === 'Normal');

      return matchSearch && matchCat && matchType && matchRisk;
    }).sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      return b.amount - a.amount;
    });
  }, [transactions, search, selectedCategory, selectedType, selectedRisk, sortBy]);

  const exportCSV = () => {
    const headers = ['Date', 'Time', 'Description', 'Category', 'Amount', 'Type', 'PaymentMethod', 'RiskStatus'];
    const rows = filtered.map(t => [
      t.date,
      t.time || '',
      `"${t.description.replace(/"/g, '""')}"`,
      t.category,
      t.amount,
      t.type,
      t.paymentMethod,
      t.riskStatus
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `finsight-transactions-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
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
    'Income & Salary',
    'Education & Learning',
    'Other'
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ReceiptText className="w-6 h-6 text-indigo-400" />
            <h1 className="text-2xl font-black text-white tracking-tight">Transactions & Statement Audit Ledger</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Complete audited financial records with autonomous fraud risk classification
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCSVImportModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <UploadCloud className="w-3.5 h-3.5 text-indigo-400" />
            Import Statement
          </button>
          <button
            onClick={exportCSV}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            Export CSV
          </button>
          <button
            onClick={() => setIsAddTxModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 transition shadow-lg shadow-indigo-600/20 active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Entry
          </button>
        </div>
      </div>

      {/* Filter Controls Bar */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search merchant, description, or UPI ID..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Category */}
        <select
          value={selectedCategory}
          onChange={e => setSelectedCategory(e.target.value)}
          className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
        >
          <option value="All">All Categories</option>
          {categories.map(c => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        {/* Type */}
        <select
          value={selectedType}
          onChange={e => setSelectedType(e.target.value)}
          className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
        >
          <option value="All">All Types</option>
          <option value="expense">Expenses Only</option>
          <option value="income">Incomes Only</option>
        </select>

        {/* Risk Status */}
        <select
          value={selectedRisk}
          onChange={e => setSelectedRisk(e.target.value)}
          className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
        >
          <option value="All">All Risk Statuses</option>
          <option value="Anomalies">Flagged Anomalies Only</option>
          <option value="Normal">Normal Only</option>
        </select>

        {/* Sort */}
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value as any)}
          className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500 font-mono"
        >
          <option value="date">Sort by Date</option>
          <option value="amount">Sort by Amount</option>
        </select>
      </div>

      {/* Ledger Table */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 font-mono text-[10px] uppercase border-b border-slate-800">
              <tr>
                <th className="p-4">Date & Time</th>
                <th className="p-4">Description</th>
                <th className="p-4">Category</th>
                <th className="p-4">Payment Method</th>
                <th className="p-4 text-right">Amount</th>
                <th className="p-4">Risk Surveillance</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 bg-slate-900/40">
              {filtered.map(t => {
                const isFlagged = t.riskStatus === 'Potentially Unusual' || t.riskStatus === 'Flagged Suspicious';
                return (
                  <tr key={t.id} className="hover:bg-slate-800/30 transition">
                    <td className="p-4 font-mono text-slate-400 text-[11px] whitespace-nowrap">
                      <div>{t.date}</div>
                      <div className="text-[10px] text-slate-500">{t.time || '12:00 PM'}</div>
                    </td>

                    <td className="p-4 text-slate-100 font-bold max-w-xs">
                      <div className="truncate">{t.description}</div>
                      {t.upiIdOrMerchant && (
                        <div className="text-[10px] text-slate-400 font-mono truncate">{t.upiIdOrMerchant}</div>
                      )}
                    </td>

                    <td className="p-4">
                      <span
                        className="inline-block px-2.5 py-1 rounded-lg text-[11px] font-semibold"
                        style={{
                          backgroundColor: `${categoryColors[t.category] || '#64748B'}15`,
                          color: categoryColors[t.category] || '#94A3B8'
                        }}
                      >
                        {t.category}
                      </span>
                    </td>

                    <td className="p-4 text-slate-300 font-medium whitespace-nowrap">
                      {t.paymentMethod}
                    </td>

                    <td className="p-4 text-right font-mono font-black text-sm whitespace-nowrap">
                      <span className={t.type === 'income' ? 'text-emerald-400' : 'text-slate-100'}>
                        {t.type === 'income' ? '+' : '-'}{formatAmount(t.amount)}
                      </span>
                    </td>

                    <td className="p-4 whitespace-nowrap">
                      {isFlagged ? (
                        <div className="flex items-center gap-1.5">
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1">
                            <ShieldAlert className="w-3 h-3" />
                            {t.riskStatus}
                          </span>
                        </div>
                      ) : (
                        <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          Normal
                        </span>
                      )}
                    </td>

                    <td className="p-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        {isFlagged && (
                          <button
                            onClick={() => openDisputeModal(t)}
                            className="p-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-[10px] font-bold flex items-center gap-1 border border-rose-500/30"
                            title="Generate Dispute Letter"
                          >
                            <FileText className="w-3 h-3" />
                            Dispute
                          </button>
                        )}
                        <button
                          onClick={() => deleteTransaction(t.id)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition"
                          title="Delete Transaction"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};