import React, { useState } from 'react';
import {
  Menu,
  Bell,
  Plus,
  UploadCloud,
  Globe,
  CheckCircle2,
  AlertTriangle,
  FileText
} from 'lucide-react';
import { useFinance } from '../../context/FinancialContext';
import { CurrencyCode } from '../../types/finance';
import { currencyExchangeRates } from '../../data/defaultData';

interface HeaderProps {
  onOpenMobileMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenMobileMenu }) => {
  const {
    currency,
    setCurrency,
    totalLiquidBalance,
    formatAmount,
    setIsAddTxModalOpen,
    setIsCSVImportModalOpen,
    unresolvedAnomaliesCount,
    transactions,
    setActiveTab,
    openDisputeModal
  } = useFinance();

  const [isCurrencyDropdownOpen, setIsCurrencyDropdownOpen] = useState(false);
  const [isNotifDrawerOpen, setIsNotifDrawerOpen] = useState(false);

  const flaggedTxs = transactions.filter(
    t => t.riskStatus === 'Potentially Unusual' || t.riskStatus === 'Flagged Suspicious'
  );

  return (
    <header className="sticky top-0 z-30 h-16 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80 px-4 lg:px-8 flex items-center justify-between gap-4">
      {/* Mobile Toggle & Status */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 border border-slate-800"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs">
          <span className="text-slate-400">Liquid Reserves:</span>
          <span className="font-extrabold text-white font-mono">{formatAmount(totalLiquidBalance)}</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Currency Switcher */}
        <div className="relative">
          <button
            onClick={() => setIsCurrencyDropdownOpen(!isCurrencyDropdownOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-200 transition"
          >
            <Globe className="w-3.5 h-3.5 text-indigo-400" />
            <span>{currency}</span>
            <span className="text-slate-400 text-[10px]">({currencyExchangeRates[currency].symbol})</span>
          </button>

          {isCurrencyDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95">
              <div className="text-[10px] font-bold text-slate-400 px-2 py-1 uppercase tracking-wider">
                Select Base Currency
              </div>
              {(Object.keys(currencyExchangeRates) as CurrencyCode[]).map(c => (
                <button
                  key={c}
                  onClick={() => {
                    setCurrency(c);
                    setIsCurrencyDropdownOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition ${
                    currency === c ? 'bg-indigo-600 text-white font-bold' : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span>{currencyExchangeRates[c].name}</span>
                  <span className="font-mono text-xs">{currencyExchangeRates[c].symbol}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Quick Add Buttons */}
        <button
          onClick={() => setIsAddTxModalOpen(true)}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/20 transition active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Transaction</span>
        </button>

        <button
          onClick={() => setIsCSVImportModalOpen(true)}
          className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 text-xs font-semibold transition flex items-center gap-1.5"
          title="Import CSV Statement"
        >
          <UploadCloud className="w-4 h-4 text-indigo-400" />
          <span className="hidden md:inline">Import CSV</span>
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setIsNotifDrawerOpen(!isNotifDrawerOpen)}
            className="relative p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition"
          >
            <Bell className="w-4 h-4" />
            {unresolvedAnomaliesCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-[10px] font-bold text-white flex items-center justify-center ring-2 ring-slate-950 animate-pulse">
                {unresolvedAnomaliesCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {isNotifDrawerOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2 font-bold text-sm text-white">
                  <Bell className="w-4 h-4 text-indigo-400" />
                  <span>Notifications & Alerts</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
                  {flaggedTxs.length} active
                </span>
              </div>

              <div className="py-2 space-y-2 max-h-72 overflow-y-auto">
                {flaggedTxs.length === 0 ? (
                  <div className="text-center py-6 text-slate-400 text-xs">
                    <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2 opacity-80" />
                    No active risks or unusual transactions detected.
                  </div>
                ) : (
                  flaggedTxs.map(tx => (
                    <div
                      key={tx.id}
                      className="p-3 rounded-xl bg-rose-950/20 border border-rose-500/30 text-xs space-y-1.5"
                    >
                      <div className="flex items-center justify-between font-bold text-rose-300">
                        <span className="flex items-center gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                          Unusual Transaction
                        </span>
                        <span className="font-mono">{formatAmount(tx.amount)}</span>
                      </div>
                      <p className="text-slate-300 text-[11px] leading-relaxed">{tx.description}</p>
                      <div className="pt-1 flex items-center justify-between">
                        <button
                          onClick={() => {
                            setIsNotifDrawerOpen(false);
                            setActiveTab('risk-alerts');
                          }}
                          className="text-[11px] font-bold text-indigo-400 hover:text-indigo-300 underline"
                        >
                          Investigate
                        </button>
                        <button
                          onClick={() => {
                            setIsNotifDrawerOpen(false);
                            openDisputeModal(tx);
                          }}
                          className="px-2 py-1 rounded bg-rose-500 hover:bg-rose-400 text-white font-bold text-[10px] flex items-center gap-1"
                        >
                          <FileText className="w-3 h-3" />
                          Dispute Letter
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};