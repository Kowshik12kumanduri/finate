import React, { useState, useMemo } from 'react';
import {
  SlidersHorizontal,
  Play,
  RotateCcw,
  TrendingDown,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Info,
  DollarSign
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { useFinance } from '../../context/FinancialContext';
import { runMonteCarloSimulation } from '../../services/scenarioEngine';
import { ScenarioParameters } from '../../types/finance';

export const ScenarioSimulatorView: React.FC = () => {
  const { totalLiquidBalance, monthlyIncome, monthlyExpenses, formatAmount } = useFinance();

  const [params, setParams] = useState<ScenarioParameters>({
    incomeChangePercent: 0,
    inflationPercent: 3,
    majorExpenseAmount: 0,
    newMonthlyEmi: 0,
    jobLossMonths: 0,
    marketReturnPercent: 12
  });

  const simulationResult = useMemo(() => {
    return runMonteCarloSimulation(totalLiquidBalance, monthlyIncome, monthlyExpenses, params, 1000);
  }, [totalLiquidBalance, monthlyIncome, monthlyExpenses, params]);

  // Format line chart data across 12 months
  const chartData = useMemo(() => {
    const months = ['Month 0', 'M1', 'M2', 'M3', 'M4', 'M5', 'M6', 'M7', 'M8', 'M9', 'M10', 'M11', 'M12'];
    return months.map((m, idx) => {
      const point: any = { month: m };
      simulationResult.sampleRuns.forEach((run, rIdx) => {
        point[`run${rIdx + 1}`] = run.balances[idx] || 0;
      });
      return point;
    });
  }, [simulationResult]);

  const resetParams = () => {
    setParams({
      incomeChangePercent: 0,
      inflationPercent: 3,
      majorExpenseAmount: 0,
      newMonthlyEmi: 0,
      jobLossMonths: 0,
      marketReturnPercent: 12
    });
  };

  const { summary } = simulationResult;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-6 h-6 text-cyan-400" />
            <h1 className="text-2xl font-black text-white tracking-tight">What-If Scenario & Monte Carlo Simulator</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Stochastic life-event stress testing executing 1,000 probabilistic scenarios across 12 months
          </p>
        </div>
        <button
          onClick={resetParams}
          className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset Sliders
        </button>
      </div>

      {/* KPI Cards: Survival Rate & Bankruptcy Risk */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs font-bold text-slate-400">12-Month Survival Rate</span>
          <div className={`mt-2 text-2xl font-black font-mono ${
            summary.survivalRatePercent >= 80 ? 'text-emerald-400' : 'text-amber-400'
          }`}>
            {summary.survivalRatePercent}%
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Based on 1,000 random runs</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs font-bold text-slate-400">Bankruptcy / Deficit Risk</span>
          <div className={`mt-2 text-2xl font-black font-mono ${
            summary.bankruptcyRiskPercent > 20 ? 'text-rose-400' : 'text-white'
          }`}>
            {summary.bankruptcyRiskPercent}%
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Probability of negative cash</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs font-bold text-slate-400">Estimated Cash Runway</span>
          <div className="mt-2 text-2xl font-black text-white font-mono">{summary.runwayMonthsUnderJobLoss} Mo</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Zero-income burn duration</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs font-bold text-slate-400">Median 1-Year Balance</span>
          <div className="mt-2 text-2xl font-black text-indigo-400 font-mono">
            {formatAmount(summary.medianEndingBalance)}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">50th percentile outcome</div>
        </div>
      </div>

      {/* Main Simulation View: Sliders & Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sliders Form */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-5">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
            Stress Test Parameters
          </h3>

          {/* Income Change */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300">Salary Change (%)</span>
              <span className="font-mono font-bold text-white">
                {params.incomeChangePercent > 0 ? `+${params.incomeChangePercent}%` : `${params.incomeChangePercent}%`}
              </span>
            </div>
            <input
              type="range"
              min="-50"
              max="50"
              step="5"
              value={params.incomeChangePercent}
              onChange={e => setParams({ ...params, incomeChangePercent: Number(e.target.value) })}
              className="w-full accent-indigo-500 cursor-pointer"
            />
          </div>

          {/* Job Loss Months */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300">Income Freeze / Job Loss (Months)</span>
              <span className="font-mono font-bold text-rose-400">{params.jobLossMonths} Months</span>
            </div>
            <input
              type="range"
              min="0"
              max="12"
              step="1"
              value={params.jobLossMonths}
              onChange={e => setParams({ ...params, jobLossMonths: Number(e.target.value) })}
              className="w-full accent-rose-500 cursor-pointer"
            />
          </div>

          {/* Inflation */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300">Inflation Rate (%)</span>
              <span className="font-mono font-bold text-white">{params.inflationPercent}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="15"
              step="1"
              value={params.inflationPercent}
              onChange={e => setParams({ ...params, inflationPercent: Number(e.target.value) })}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>

          {/* New Monthly EMI */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300">New Monthly EMI / Loan Commitment</span>
              <span className="font-mono font-bold text-white">{formatAmount(params.newMonthlyEmi)}</span>
            </div>
            <input
              type="range"
              min="0"
              max="35000"
              step="2500"
              value={params.newMonthlyEmi}
              onChange={e => setParams({ ...params, newMonthlyEmi: Number(e.target.value) })}
              className="w-full accent-indigo-500 cursor-pointer"
            />
          </div>

          {/* Lump Sum Capital Shock */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300">Instant Capital Shock (e.g. Medical)</span>
              <span className="font-mono font-bold text-white">{formatAmount(params.majorExpenseAmount)}</span>
            </div>
            <input
              type="range"
              min="0"
              max="100000"
              step="5000"
              value={params.majorExpenseAmount}
              onChange={e => setParams({ ...params, majorExpenseAmount: Number(e.target.value) })}
              className="w-full accent-rose-500 cursor-pointer"
            />
          </div>
        </div>

        {/* Stochastic Trajectory Chart */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-white">Stochastic Trajectory Simulation (5 Sample Runs)</h3>
                <p className="text-[11px] text-slate-400">Shows path volatility incorporating random monthly expense shocks</p>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                1,000 Iterations
              </span>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <XAxis dataKey="month" stroke="#475569" tick={{ fontSize: 10 }} />
                  <YAxis stroke="#475569" tick={{ fontSize: 10 }} tickFormatter={v => `₹${v / 1000}k`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#090D16', borderColor: '#1E293B', borderRadius: '12px', fontSize: '11px' }}
                    formatter={(val: any) => [formatAmount(Number(val)), 'Balance']}
                  />
                  <Line type="monotone" dataKey="run1" stroke="#6366F1" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="run2" stroke="#06B6D4" strokeWidth={1.5} strokeDasharray="3 3" dot={false} />
                  <Line type="monotone" dataKey="run3" stroke="#10B981" strokeWidth={1.5} dot={false} />
                  <Line type="monotone" dataKey="run4" stroke="#F59E0B" strokeWidth={1.5} dot={false} />
                  <Line type="monotone" dataKey="run5" stroke="#EC4899" strokeWidth={1.5} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>Worst 10% Outcome: {formatAmount(summary.tenthPercentileBalance)}</span>
            <span>Best 10% Outcome: {formatAmount(summary.ninetiethPercentileBalance)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};