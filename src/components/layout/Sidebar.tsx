import React from 'react';
import {
  LayoutDashboard,
  HeartPulse,
  PieChart,
  Wallet,
  TrendingUp,
  ShieldAlert,
  Bot,
  Lightbulb,
  CalendarDays,
  CreditCard,
  ReceiptText,
  FileSpreadsheet,
  Settings,
  Sparkles,
  Target,
  Calculator,
  SlidersHorizontal,
  X
} from 'lucide-react';
import { useFinance } from '../../context/FinancialContext';

interface SidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, setMobileOpen }) => {
  const { activeTab, setActiveTab, healthScore, unresolvedAnomaliesCount, profile, formatAmount, totalLiquidBalance } = useFinance();

  const navGroups = [
    {
      group: 'Core',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        {
          id: 'health',
          label: 'Financial Health',
          icon: HeartPulse,
          badge: `${healthScore.overall}/100`,
          badgeColor: healthScore.overall >= 80 ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
        },
        { id: 'spending', label: 'Spending Analysis', icon: PieChart },
      ]
    },
    {
      group: 'Planning & Simulation',
      items: [
        { id: 'budget', label: 'Budget Engine', icon: Wallet },
        { id: 'cashflow', label: 'Cash Flow Forecast', icon: TrendingUp, badge: 'AI Forecast', badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' },
        { id: 'scenarios', label: 'What-If & Monte Carlo', icon: SlidersHorizontal, badge: 'NEW 1k Sim', badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30' },
        { id: 'goals', label: 'Goal & FIRE Planner', icon: Target, badge: 'NEW FIRE', badgeColor: 'bg-pink-500/20 text-pink-300 border-pink-500/30' },
      ]
    },
    {
      group: 'Protection & Intelligence',
      items: [
        {
          id: 'risk-alerts',
          label: 'Risk & Alerts',
          icon: ShieldAlert,
          badge: unresolvedAnomaliesCount > 0 ? `${unresolvedAnomaliesCount} Action` : undefined,
          badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30'
        },
        { id: 'advisor', label: 'FinSight AI Advisor', icon: Bot, badge: 'Live LLM', badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' },
        { id: 'recommendations', label: 'Recommendations', icon: Lightbulb },
        { id: 'tax-optimizer', label: 'Tax Optimizer', icon: Calculator, badge: 'NEW FY26', badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
        { id: 'loan-optimizer', label: 'Loan Prepayment', icon: Sparkles, badge: 'NEW Saver', badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30' },
      ]
    },
    {
      group: 'Management & Records',
      items: [
        { id: 'recurring', label: 'Bills & EMIs', icon: CalendarDays },
        { id: 'overview', label: 'My Accounts', icon: CreditCard },
        { id: 'transactions', label: 'Transactions & CSV', icon: ReceiptText },
        { id: 'reports', label: 'Reports & PDF', icon: FileSpreadsheet },
        { id: 'settings', label: 'Settings & Privacy', icon: Settings },
      ]
    }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-slate-950/95 border-r border-slate-800/80 backdrop-blur-xl flex flex-col transition-transform duration-300 lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo and Brand */}
        <div className="h-16 px-6 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-[1px] shadow-lg shadow-indigo-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-indigo-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight text-white font-sans">FinSight</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">AI</span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium">Predictive Risk & Health</p>
            </div>
          </div>

          <button
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            onClick={() => setMobileOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
          {navGroups.map(group => (
            <div key={group.group}>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3 mb-2 font-mono">
                {group.group}
              </div>
              <div className="space-y-1">
                {group.items.map(item => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setMobileOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 group ${
                        isActive
                          ? 'bg-indigo-600/15 text-indigo-300 border border-indigo-500/30 shadow-sm shadow-indigo-950'
                          : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/60 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${item.badgeColor}`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* User Mini Card */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-900/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-emerald-400 flex items-center justify-center font-bold text-xs text-slate-950">
                {profile.name.charAt(0)}
              </div>
              <div>
                <div className="text-xs font-bold text-white truncate max-w-[110px]">{profile.name}</div>
                <div className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
                  {formatAmount(totalLiquidBalance, { compact: true })}
                </div>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('settings')}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              title="Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};