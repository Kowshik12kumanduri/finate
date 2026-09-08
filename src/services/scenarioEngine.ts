import { ScenarioParameters, MonteCarloSummary, MonteCarloSimulationRun } from '../types/finance';

export function runMonteCarloSimulation(
  initialBalance: number,
  monthlyIncome: number,
  monthlyExpense: number,
  params: ScenarioParameters,
  simulationsCount: number = 1000
): { summary: MonteCarloSummary; sampleRuns: MonteCarloSimulationRun[] } {
  const adjustedIncome = monthlyIncome * (1 + params.incomeChangePercent / 100);
  const adjustedExpense = monthlyExpense * (1 + params.inflationPercent / 100) + params.newMonthlyEmi;
  const initialCapShock = initialBalance - params.majorExpenseAmount;

  const runs: MonteCarloSimulationRun[] = [];
  const endingBalances: number[] = [];
  let survivedCount = 0;

  for (let i = 0; i < simulationsCount; i++) {
    let balance = initialCapShock;
    const monthlyBalances: number[] = [balance];
    let survived = true;
    let minBalance = balance;

    for (let m = 1; m <= 12; m++) {
      // If within job loss window, income is 0
      const currentMonthIncome = m <= params.jobLossMonths ? 0 : adjustedIncome;

      // Random normal expense fluctuation (mean = 1.0, stdDev = 0.08)
      const u1 = Math.random();
      const u2 = Math.random();
      const z = Math.sqrt(-2.0 * Math.log(u1 || 0.0001)) * Math.cos(2.0 * Math.PI * u2);
      const expenseMultiplier = Math.max(0.7, Math.min(1.4, 1.0 + z * 0.08));

      // Investment return volatility
      const marketReturnMonthly = (params.marketReturnPercent / 100 / 12) + (z * 0.015);
      const investmentGrowth = balance > 0 ? balance * 0.3 * marketReturnMonthly : 0;

      const monthlyNet = currentMonthIncome - (adjustedExpense * expenseMultiplier) + investmentGrowth;
      balance += monthlyNet;
      monthlyBalances.push(Math.round(balance));

      if (balance < minBalance) {
        minBalance = balance;
      }
      if (balance < 0) {
        survived = false;
      }
    }

    if (balance > 0 && survived) {
      survivedCount++;
    }

    endingBalances.push(balance);
    if (i < 5) {
      runs.push({
        runId: i + 1,
        balances: monthlyBalances,
        survived,
        minimumBalance: Math.round(minBalance)
      });
    }
  }

  endingBalances.sort((a, b) => a - b);
  const p10Index = Math.floor(simulationsCount * 0.10);
  const p50Index = Math.floor(simulationsCount * 0.50);
  const p90Index = Math.floor(simulationsCount * 0.90);

  const survivalRate = (survivedCount / simulationsCount) * 100;
  const bankruptcyRisk = 100 - survivalRate;

  // Calculate runway in months under job loss
  const monthlyBurn = adjustedExpense;
  const runwayMonths = monthlyBurn > 0 ? Math.max(0, initialCapShock / monthlyBurn) : 99;

  return {
    summary: {
      survivalRatePercent: Math.round(survivalRate * 10) / 10,
      medianEndingBalance: Math.round(endingBalances[p50Index]),
      tenthPercentileBalance: Math.round(endingBalances[p10Index]),
      ninetiethPercentileBalance: Math.round(endingBalances[p90Index]),
      bankruptcyRiskPercent: Math.round(bankruptcyRisk * 10) / 10,
      runwayMonthsUnderJobLoss: Math.round(runwayMonths * 10) / 10
    },
    sampleRuns: runs
  };
}