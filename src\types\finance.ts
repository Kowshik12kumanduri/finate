export type CurrencyCode = 'INR' | 'USD' | 'EUR' | 'GBP' | 'AED' | 'SGD';

export interface UserProfile {
  name: string;
  email: string;
  occupation: string;
  city: string;
  currency: string;
  targetSavingsRate: number; // percentage, e.g. 35
  monthlyIncomeBaseline: number;
}

export type HealthStatus = 'Excellent' | 'Good' | 'Fair' | 'Critical';

export interface PillarDetail {
  name: string;
  score: number; // 0-100
  weight: number; // percentage
  status: 'Excellent' | 'Good' | 'Fair' | 'Critical';
  summary: string;
  positiveDrivers: string[];
  riskFlags: string[];
  recommendation: string;
}

export interface FinancialHealthScore {
  overall: number; // 0-100
  statusText: string;
  description: string;
  pillars: {
    spendingBehavior: PillarDetail;
    savingsConsistency: PillarDetail;
    debtBurden: PillarDetail;
    cashFlowStability: PillarDetail;
    emergencyFund: PillarDetail;
    recurringExpenses: PillarDetail;
  };
  keyPositives: string[];
  keyRisks: string[];
}

export type ExpenseCategory =
  | 'Housing & Rent'
  | 'EMI & Debt Repayment'
  | 'Shopping & E-Commerce'
  | 'Food & Dining'
  | 'Transport & Commute'
  | 'Bills & Utilities'
  | 'Entertainment & Leisure'
  | 'Healthcare & Wellness'
  | 'Education & Learning'
  | 'Investments & Savings'
  | 'Income & Salary'
  | 'Other';

export type PaymentMethod = 'UPI' | 'Credit Card' | 'Debit Card' | 'NetBanking' | 'Auto-Debit EMI' | 'Cash' | 'Wallet';

export type RiskStatus = 'Normal' | 'Potentially Unusual' | 'Flagged Suspicious' | 'Resolved Safe';
export type RiskLevel = 'Low' | 'Medium' | 'High' | 'Critical';

export interface Transaction {
  id: string;
  date: string; // YYYY-MM-DD
  time?: string;
  description: string;
  category: ExpenseCategory;
  amount: number;
  type: 'income' | 'expense';
  paymentMethod: PaymentMethod;
  upiIdOrMerchant?: string;
  accountMask?: string;
  riskStatus: RiskStatus;
  riskLevel: RiskLevel;
  riskReason?: string[];
  notes?: string;
  isRecurring?: boolean;
}

export interface BudgetCategory {
  id: string;
  category: ExpenseCategory;
  monthlyBudget: number;
  spent: number;
  color: string;
  iconName: string;
  status: 'On Track' | 'Near Limit' | 'Over Budget';
  aiAdvice: string;
}

export interface RecurringBill {
  id: string;
  name: string;
  category: ExpenseCategory;
  amount: number;
  dueDate: string; // e.g. "05 Sep"
  dueDay: number; // 1-31
  frequency: 'Monthly' | 'Quarterly' | 'Yearly';
  paymentMethod: PaymentMethod;
  status: 'Paid' | 'Upcoming' | 'Overdue';
  reminderEnabled: boolean;
  isAutoDebit: boolean;
  billerName: string;
}

export type AccountType = 'Bank Account' | 'Savings' | 'UPI Wallet' | 'Credit Card' | 'Loan / EMI' | 'Investments';

export interface FinancialAccount {
  id: string;
  name: string;
  institution: string;
  type: AccountType;
  balanceOrOutstanding: number;
  accountNumberMask: string;
  icon: string;
  color: string;
  isDemo: boolean;
  details: string;
  creditLimit?: number;
  interestRate?: number;
  remainingTenureMonths?: number;
}

export interface FinancialGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string; // YYYY-MM-DD
  monthlyContribution: number;
  category: 'Emergency Fund' | 'Down Payment' | 'Vacation' | 'Retirement' | 'Vehicle' | 'Custom';
  icon: string;
  color: string;
}

export interface Recommendation {
  id: string;
  type: 'Spending Insight' | 'Savings Opportunity' | 'Cash-Flow Warning' | 'Transaction Review' | 'Tax Optimization';
  title: string;
  summary: string;
  whyExplanation: string[];
  impactAmountRupees: number;
  impactLevel: 'High' | 'Medium' | 'Low';
  actionLabel: string;
  actionTab: string;
  category: ExpenseCategory;
}

export interface DailyForecastPoint {
  date: string;
  dayLabel: string;
  isPast: boolean;
  isToday: boolean;
  actualBalance?: number;
  predictedBalance: number;
  optimisticBalance: number;
  cautiousBalance: number;
  expectedIncome: number;
  expectedExpense: number;
  events?: string[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'advisor';
  timestamp: string;
  text: string;
  suggestedPrompts?: string[];
  isStreaming?: boolean;
}

export interface ScenarioParameters {
  incomeChangePercent: number; // -50 to +50
  inflationPercent: number; // 0 to 15
  majorExpenseAmount: number; // e.g. 50000
  newMonthlyEmi: number; // e.g. 12000
  jobLossMonths: number; // 0 to 12
  marketReturnPercent: number; // -10 to +25
}

export interface MonteCarloSimulationRun {
  runId: number;
  balances: number[]; // 12 months
  survived: boolean;
  minimumBalance: number;
}

export interface MonteCarloSummary {
  survivalRatePercent: number;
  medianEndingBalance: number;
  tenthPercentileBalance: number;
  ninetiethPercentileBalance: number;
  bankruptcyRiskPercent: number;
  runwayMonthsUnderJobLoss: number;
}

export interface TaxRegimeComparison {
  grossAnnualSalary: number;
  oldRegime: {
    grossTotalIncome: number;
    standardDeduction: number;
    section80C: number;
    section80D: number;
    hraExemption: number;
    netTaxableIncome: number;
    calculatedTax: number;
    cess: number;
    totalTaxPayable: number;
    effectiveRate: number;
  };
  newRegime: {
    grossTotalIncome: number;
    standardDeduction: number;
    netTaxableIncome: number;
    calculatedTax: number;
    cess: number;
    totalTaxPayable: number;
    effectiveRate: number;
  };
  betterRegime: 'Old Regime' | 'New Regime' | 'Equivalent';
  annualTaxSavings: number;
  recommendations: string[];
}