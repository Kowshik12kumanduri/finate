import React, { useState } from 'react';
import {
  TrendingUp,
  AlertCircle,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Info,
  ShieldCheck
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { useFinance } from '../../context/FinancialContext';

export const CashFlowForecastView: React.FC = () => {
  const { cashFlowForecast, totalLiquidBalance, formatAmount } = useFinance();
  const [selectedPoint, setSelectedPoint] = useState<any>(cashFlowForecast[13] || cashFlowForecast[0]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-indigo-400" />
            <h1 className="text-2xl font-black text-white tracking-tight">Predictive Cash Flow Trajectory</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Dynamic rolling daily forecast combining recurring auto-debits and stochastic expense models
          </p>
        </div>
      </div>

      {/* Trajectory Area Chart */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-sm font-bold text-white">30-Day Liquidity Projection</h3>
            <p className="text-[11px] text-slate-400">Tap or hover on any date point to view scheduled cash events</p>
          </div>
          <div className="flex items-center gap-4 text-[10px] font-mono text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-indigo-500 inline-block"></span>
              Predicted Balance
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-cyan-400/30 inline-block"></span>
              Confidence Range
            </span>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={cashFlowForecast}
              margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
              onClick={(e: any) => {
                if (e && e.activePayload && e.activePayload[0]) {
                  setSelectedPoint(e.activePayload[0].payload);
                }
              }}
            >
              <defs>
                <linearGradient id="mainForecast" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366F1" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#6366F1" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="confBand" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#06B6D4" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <XAxis dataKey="dayLabel" stroke="#475569" tick={{ fontSize: 10 }} interval={3} />
              <YAxis stroke="#475569" tick={{ fontSize: 10 }} tickFormatter={v => `₹${v / 1000}k`} />
              <Tooltip
                contentStyle={{ backgroundColor: '#090D16', borderColor: '#1E293B', borderRadius: '12px', fontSize: '11px' }}
                formatter={(val: any) => [formatAmount(Number(val)), 'Projected']}
              />
              <Area type="monotone" dataKey="optimisticBalance" stroke="transparent" fill="url(#confBand)" />
              <Area type="monotone" dataKey="cautiousBalance" stroke="transparent" fill="#090D16" />
              <Area type="monotone" dataKey="predictedBalance" stroke="#6366F1" strokeWidth={2.5} fill="url(#mainForecast)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Selected Day Inspector */}
      {selectedPoint && (
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-bold text-white font-mono">{selectedPoint.dayLabel} (2026)</span>
              {selectedPoint.isToday && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Today
                </span>
              )}
            </div>
            <div className="mt-2 text-xl font-black text-white font-mono">
              {formatAmount(selectedPoint.predictedBalance)}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Optimistic: {formatAmount(selectedPoint.optimisticBalance)} • Cautious: {formatAmount(selectedPoint.cautiousBalance)}
            </div>
          </div>

          <div className="sm:text-right space-y-1 text-xs">
            {selectedPoint.events && selectedPoint.events.length > 0 ? (
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Scheduled Cash Events:
                </span>
                {selectedPoint.events.map((ev: string, idx: number) => (
                  <span
                    key={idx}
                    className={`inline-block px-2.5 py-1 rounded-lg text-xs font-bold font-mono mr-1 ${
                      ev.includes('+') ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                    }`}
                  >
                    {ev}
                  </span>
                ))}
              </div>
            ) : (
              <span className="text-[11px] text-slate-500 italic">No scheduled fixed auto-debits on this date.</span>
            )}
          </div>
        </div>
      )}

      {/* Warning Cushion Callout */}
      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3 text-xs text-amber-300">
        <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-sm block text-amber-200">Payment Window Buffer Warning</span>
          <p className="mt-1 leading-relaxed text-slate-300">
            Between the <strong>5th and 10th of September</strong>, auto-debits for Broadband (₹999), BESCOM Electricity (₹1,850), and HDFC Personal Loan EMI (₹8,500) will debit consecutively. Maintain a minimum balance of <strong>₹20,000</strong> in your primary HDFC checking account to guarantee zero insufficient fund charges.
          </p>
        </div>
      </div>
    </div>
  );
};