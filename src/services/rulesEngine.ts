import {
  Transaction,
  BudgetCategory,
  RecurringBill,
  FinancialHealthScore,
  DailyForecastPoint,
  CurrencyCode
} from '../types/finance';
import { currencyExchangeRates } from '../data/defaultData';

export function formatMoney(
  amountInINR: number,
  currency: CurrencyCode = 'INR',
  options?: { compact?: boolean; showSign?: boolean }
): string {
  const isNegative = amountInINR < 0;
  const absINR = Math.abs(amountInINR);
  const info = currencyExchangeRates[currency] || currencyExchangeRates.INR;
  const converted = absINR * info.rate;

  if (currency === 'INR') {
    if (options?.compact && absINR >= 10000000) {
      const cr = (absINR / 10000000).toFixed(2);
      return `${isNegative ? '-' : options?.showSign ? '+' : ''}₹${cr} Cr`;
    }
    if (options?.compact && absINR >= 100000) {
      const l = (absINR / 100000).toFixed(2);
      return `${isNegative ? '-' : options?.showSign ? '+' : ''}₹${l} L`;
    }
    const formatted = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(converted);
    return `${isNegative ? '-' : options?.showSign && amountInINR > 0 ? '+' : ''}₹${formatted}`;
  }

  // Non-INR currencies
  if (options?.compact && converted >= 1000000) {
    return `${isNegative ? '-' : options?.showSign ? '+' : ''}${info.symbol}${(converted / 1000000).toFixed(1)}M`;
  }
  if (options?.compact && converted >= 1000) {
    return `${isNegative ? '-' : options?.showSign ? '+' : ''}${info.symbol}${(converted / 1000).toFixed(1)}k`;
  }

  const formatted = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: converted < 10 ? 2 : 0
  }).format(converted);
  return `${isNegative ? '-' : options?.showSign && amountInINR > 0 ? '+' : ''}${info.symbol}${formatted}`;
}

export function calculateHealthScore(
  transactions: Transaction[],
  budgets: BudgetCategory[],
  recurring: RecurringBill[],
  currentLiquidBalance: number = 85450,
  monthlyIncome: number = 65000
): FinancialHealthScore {
  const expenses = transactions.filter(t => t.type === 'expense');
  const totalExpense = expenses.reduce((acc, t) => acc + t.amount, 0);

  // 1. Spending Behavior (20%)
  const overBudgetCategories = budgets.filter(b => b.spent > b.monthlyBudget);
  const totalOverBudget = overBudgetCategories.reduce((acc, b) => acc + (b.spent - b.monthlyBudget), 0);
  let spendingScore = 85;
  if (overBudgetCategories.length > 0) {
    spendingScore -= Math.min(30, overBudgetCategories.length * 8 + (totalOverBudget / 1000) * 3);
  }
  spendingScore = Math.max(35, Math.min(100, Math.round(spendingScore)));

  // 2. Savings Consistency (20%)
  const savingsAmount = Math.max(0, monthlyIncome - totalExpense);
  const currentSavingsRate = (savingsAmount / monthlyIncome) * 100;
  let savingsScore = Math.round((currentSavingsRate / 35) * 85);
  const hasInvestmentSIP = recurring.some(r => r.category === 'Investments & Savings');
  if (hasInvestmentSIP) savingsScore += 8;
  savingsScore = Math.max(30, Math.min(100, savingsScore));

  // 3. Debt Burden / DTI (15%)
  const monthlyDebt = recurring
    .filter(r => r.category === 'EMI & Debt Repayment')
    .reduce((acc, r) => acc + r.amount, 0);
  const dti = (monthlyDebt / monthlyIncome) * 100;
  let debtScore = 90;
  if (dti > 40) debtScore = 45;
  else if (dti > 30) debtScore = 65;
  else if (dti > 15) debtScore = 78;
  else if (dti > 0) debtScore = 88;

  // 4. Cash Flow Stability (15%)
  let cashFlowScore = currentLiquidBalance > monthlyIncome * 0.8 ? 85 : 68;
  if (currentLiquidBalance > monthlyIncome * 1.5) cashFlowScore = 92;

  // 5. Emergency Readiness (15%)
  const monthlyLivingCosts = totalExpense > 0 ? totalExpense : 42750;
  const runwayMonths = currentLiquidBalance / monthlyLivingCosts;
  let emergencyScore = Math.round((runwayMonths / 4.0) * 90);
  emergencyScore = Math.max(30, Math.min(100, emergencyScore));

  // 6. Recurring Commitments (15%)
  const totalRecurring = recurring.reduce((acc, r) => acc + r.amount, 0);
  const recurringRatio = (totalRecurring / monthlyIncome) * 100;
  let recurringScore = 82;
  if (recurringRatio > 55) recurringScore = 55;
  else if (recurringRatio > 40) recurringScore = 75;

  // Weighted overall score
  const overall = Math.round(
    spendingScore * 0.20 +
    savingsScore * 0.20 +
    debtScore * 0.15 +
    cashFlowScore * 0.15 +
    emergencyScore * 0.15 +
    recurringScore * 0.15
  );

  let statusText = 'Excellent – Financial Champion';
  if (overall < 50) statusText = 'Critical – Immediate Correction Required';
  else if (overall < 65) statusText = 'Fair – Vulnerable to Shocks';
  else if (overall < 82) statusText = 'Good – Room for Improvement';

  return {
    overall,
    statusText,
    description: `Your overall health score of ${overall}/100 demonstrates strong fundamental stability with disciplined savings, though optimization in discretionary pacing and emergency reserves will elevate you to champion tier.`,
    pillars: {
      spendingBehavior: {
        name: 'Spending Behavior',
        score: spendingScore,
        weight: 20,
        status: spendingScore >= 80 ? 'Good' : 'Fair',
        summary: `Discretionary spending adherence is at ${overBudgetCategories.length === 0 ? '100%' : '88%'}.`,
        positiveDrivers: [
          'Groceries & daily essentials strictly within budget limits',
          'Zero unauthorized cash withdrawals recorded'
        ],
        riskFlags: overBudgetCategories.length > 0
          ? [`${overBudgetCategories[0].category} exceeded planned budget by ₹${overBudgetCategories[0].spent - overBudgetCategories[0].monthlyBudget}`]
          : ['Slight uptick in peak-hour ride hail surge fares'],
        recommendation: 'Implement a weekly discretionary spending soft cap of ₹3,500 to eliminate month-end spillovers.'
      },
      savingsConsistency: {
        name: 'Savings Consistency',
        score: savingsScore,
        weight: 20,
        status: savingsScore >= 80 ? 'Excellent' : 'Good',
        summary: `Net savings rate is ${currentSavingsRate.toFixed(1)}% of income (Target: 35%).`,
        positiveDrivers: [
          'Automated monthly Mutual Fund SIP active on 3rd of month',
          'Positive net operational savings maintained for 4 consecutive months'
        ],
        riskFlags: [
          'Substantial surplus sitting in low-yield savings accounts rather than liquid sweep funds'
        ],
        recommendation: 'Maintain your ₹5,000 automated SIP and sweep ₹20,000 idle cash into an overnight arbitrage fund.'
      },
      debtBurden: {
        name: 'Debt Burden (DTI)',
        score: debtScore,
        weight: 15,
        status: debtScore >= 80 ? 'Good' : 'Fair',
        summary: `Debt-to-Income (DTI) ratio is ${dti.toFixed(1)}%, comfortably below the 35% safe limit.`,
        positiveDrivers: [
          'Zero revolving credit card interest charges accrued',
          'Single personal loan EMI of ₹8,500 paid on time with perfect track record'
        ],
        riskFlags: [
          'Fixed EMI represents approx. 20% of net monthly expenditure'
        ],
        recommendation: 'Target prepaying loan principal once emergency buffer reaches 4 full months.'
      },
      cashFlowStability: {
        name: 'Cash-Flow Stability',
        score: cashFlowScore,
        weight: 15,
        status: cashFlowScore >= 80 ? 'Excellent' : 'Good',
        summary: 'Resilient operational liquidity buffer preventing overdrafts.',
        positiveDrivers: [
          'Consistent 1st-of-month salary deposit from employer',
          'Daily checking balance maintained comfortably above ₹25,000'
        ],
        riskFlags: [
          'Concentrated outflow of large auto-debits between 5th and 10th of every month'
        ],
        recommendation: 'Maintain a ₹20,000 cushion in primary account prior to the 10th to absorb auto-debits smoothly.'
      },
      emergencyFund: {
        name: 'Emergency Readiness',
        score: emergencyScore,
        weight: 15,
        status: emergencyScore >= 80 ? 'Good' : 'Fair',
        summary: `Liquid buffer covers ${runwayMonths.toFixed(1)} months of living costs (Target: 4.0 months).`,
        positiveDrivers: [
          `₹${currentLiquidBalance.toLocaleString('en-IN')} in instantly redeemable savings`
        ],
        riskFlags: [
          `Target 4-month emergency cushion is ₹${(monthlyLivingCosts * 4).toLocaleString('en-IN')}, leaving a ₹${Math.max(0, monthlyLivingCosts * 4 - currentLiquidBalance).toLocaleString('en-IN')} gap`
        ],
        recommendation: 'Direct ₹5,000 of monthly surplus into a dedicated liquid fund emergency reserve.'
      },
      recurringExpenses: {
        name: 'Recurring Expenses',
        score: recurringScore,
        weight: 15,
        status: recurringScore >= 80 ? 'Good' : 'Fair',
        summary: `Fixed commitments account for ${recurringRatio.toFixed(1)}% of total monthly income.`,
        positiveDrivers: [
          'Utilities and broadband costs are consistent without unexpected billing surprises'
        ],
        riskFlags: [
          'Multiple overlapping OTT subscriptions renewing simultaneously'
        ],
        recommendation: 'Audit and consolidate unused subscriptions to save ₹600–₹1,000 monthly.'
      }
    },
    keyPositives: [
      `Savings rate is resilient at ${currentSavingsRate.toFixed(1)}%`,
      'Income is highly stable and predictable with primary employer deposit',
      'Zero revolving credit card finance charges'
    ],
    keyRisks: [
      'Discretionary shopping exceeded targeted allocation',
      'Concentrated bill and EMI payments between the 5th and 10th',
      `Emergency buffer is currently at ${runwayMonths.toFixed(1)}x monthly expense (Target: 4.0x)`
    ]
  };
}

export function generateCashFlowForecast(
  recurringBills: RecurringBill[],
  currentBalance: number = 85450,
  monthlySalary: number = 65000
): DailyForecastPoint[] {
  const points: DailyForecastPoint[] = [];
  let runningBalance = currentBalance - 17250; // past start

  for (let day = 1; day <= 30; day++) {
    const dayStr = String(day).padStart(2, '0');
    const dateStr = `2026-09-${dayStr}`;
    const label = `${dayStr} Sep`;
    const isPast = day < 14;
    const isToday = day === 14;

    let income = 0;
    let expense = 0;
    const events: string[] = [];

    if (day === 1) {
      income += monthlySalary;
      events.push(`Salary Credit (+₹${monthlySalary.toLocaleString('en-IN')})`);
    }

    // Check recurring bills due on this day
    const dueBills = recurringBills.filter(b => b.dueDay === day);
    for (const bill of dueBills) {
      expense += bill.amount;
      events.push(`${bill.name} (-₹${bill.amount.toLocaleString('en-IN')})`);
    }

    // Average daily discretionary burn
    const dailyDiscretionary = 650 + (day * 37) % 350;
    expense += dailyDiscretionary;

    if (isPast) {
      runningBalance = runningBalance + income - expense;
      points.push({
        date: dateStr,
        dayLabel: label,
        isPast: true,
        isToday: false,
        actualBalance: runningBalance,
        predictedBalance: runningBalance,
        optimisticBalance: runningBalance,
        cautiousBalance: runningBalance,
        expectedIncome: income,
        expectedExpense: expense,
        events: events.length > 0 ? events : undefined
      });
    } else if (isToday) {
      runningBalance = currentBalance;
      points.push({
        date: dateStr,
        dayLabel: label,
        isPast: false,
        isToday: true,
        actualBalance: currentBalance,
        predictedBalance: currentBalance,
        optimisticBalance: currentBalance,
        cautiousBalance: currentBalance,
        expectedIncome: income,
        expectedExpense: expense,
        events: events.length > 0 ? events : undefined
      });
    } else {
      const daysAhead = day - 14;
      runningBalance = runningBalance + income - expense;
      const uncertainty = daysAhead * 380;
      points.push({
        date: dateStr,
        dayLabel: label,
        isPast: false,
        isToday: false,
        predictedBalance: Math.round(runningBalance),
        optimisticBalance: Math.round(runningBalance + uncertainty),
        cautiousBalance: Math.round(runningBalance - uncertainty),
        expectedIncome: income,
        expectedExpense: expense,
        events: events.length > 0 ? events : undefined
      });
    }
  }

  return points;
}