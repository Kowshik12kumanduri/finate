import {
  UserProfile,
  FinancialAccount,
  BudgetCategory,
  RecurringBill,
  Transaction,
  FinancialGoal,
  Recommendation,
  ChatMessage,
  ExpenseCategory
} from '../types/finance';

export const defaultProfile: UserProfile = {
  name: 'Aarav Sharma',
  email: 'aarav.sharma@example.com',
  occupation: 'Software Engineer',
  city: 'Bengaluru, India',
  currency: '₹',
  targetSavingsRate: 35,
  monthlyIncomeBaseline: 65000,
};

export const defaultAccounts: FinancialAccount[] = [
  {
    id: 'acc-1',
    name: 'HDFC Salary Account',
    institution: 'HDFC Bank',
    type: 'Bank Account',
    balanceOrOutstanding: 62400,
    accountNumberMask: '•••• 4192',
    icon: 'Building2',
    color: '#004c8f',
    isDemo: true,
    details: 'Primary salary account. Monthly credit: ₹65,000.',
  },
  {
    id: 'acc-2',
    name: 'SBI Emergency Savings',
    institution: 'State Bank of India',
    type: 'Savings',
    balanceOrOutstanding: 23050,
    accountNumberMask: '•••• 9920',
    icon: 'PiggyBank',
    color: '#280071',
    isDemo: true,
    details: 'Secondary reserve account for emergency buffer.',
  },
  {
    id: 'acc-3',
    name: 'Google Pay UPI / PhonePe',
    institution: 'NPCI UPI Network',
    type: 'UPI Wallet',
    balanceOrOutstanding: 0,
    accountNumberMask: 'aarav@okhdfcbank',
    icon: 'Smartphone',
    color: '#34A853',
    isDemo: true,
    details: 'Linked to HDFC Bank for instantaneous merchant & peer transfers.',
  },
  {
    id: 'acc-4',
    name: 'ICICI Coral Credit Card',
    institution: 'ICICI Bank',
    type: 'Credit Card',
    balanceOrOutstanding: 14200,
    creditLimit: 150000,
    accountNumberMask: '•••• 7714',
    icon: 'CreditCard',
    color: '#F37021',
    isDemo: true,
    details: 'Credit Limit: ₹1,50,000. Next statement due on 22nd Sep.',
  },
  {
    id: 'acc-5',
    name: 'HDFC Personal Loan',
    institution: 'HDFC Bank Retail Loans',
    type: 'Loan / EMI',
    balanceOrOutstanding: 142000,
    interestRate: 11.5,
    remainingTenureMonths: 18,
    accountNumberMask: '•••• 8821',
    icon: 'Landmark',
    color: '#EF4444',
    isDemo: true,
    details: 'Remaining tenure: 18 months @ ₹8,500/month EMI.',
  },
  {
    id: 'acc-6',
    name: 'Groww Mutual Funds & PPF',
    institution: 'Groww AMC / India Post',
    type: 'Investments',
    balanceOrOutstanding: 260000,
    accountNumberMask: '•••• 3301',
    icon: 'TrendingUp',
    color: '#00D09C',
    isDemo: true,
    details: '₹1.85L in Equity SIPs + ₹75,000 in Public Provident Fund (PPF).',
  }
];

export const defaultBudgets: BudgetCategory[] = [
  {
    id: 'b-1',
    category: 'Housing & Rent',
    monthlyBudget: 15000,
    spent: 15000,
    color: '#6366F1',
    iconName: 'Home',
    status: 'On Track',
    aiAdvice: 'Fixed recurring rent paid promptly on 1st of every month.',
  },
  {
    id: 'b-2',
    category: 'EMI & Debt Repayment',
    monthlyBudget: 8500,
    spent: 8500,
    color: '#EF4444',
    iconName: 'CreditCard',
    status: 'On Track',
    aiAdvice: 'Scheduled auto-debit on 10th Sep. Safe DTI ratio of 13.1%.',
  },
  {
    id: 'b-3',
    category: 'Shopping & E-Commerce',
    monthlyBudget: 6000,
    spent: 7200,
    color: '#EC4899',
    iconName: 'ShoppingBag',
    status: 'Over Budget',
    aiAdvice: 'Exceeded monthly budget by ₹1,200 (+20%). A ₹12,500 gadget purchase was also categorized under electronics review. Recommend pausing non-essential e-commerce purchases for the next 2 weeks.',
  },
  {
    id: 'b-4',
    category: 'Food & Dining',
    monthlyBudget: 8000,
    spent: 6250,
    color: '#F59E0B',
    iconName: 'Utensils',
    status: 'On Track',
    aiAdvice: 'Well within budget with ₹1,750 remaining for the rest of the cycle.',
  },
  {
    id: 'b-5',
    category: 'Transport & Commute',
    monthlyBudget: 5000,
    spent: 4800,
    color: '#3B82F6',
    iconName: 'Car',
    status: 'Near Limit',
    aiAdvice: 'Near limit at 96% utilization due to frequent peak-hour cab bookings. Switching to metro/shared commute can save ~₹1,200/mo.',
  },
  {
    id: 'b-6',
    category: 'Bills & Utilities',
    monthlyBudget: 3500,
    spent: 3348,
    color: '#8B5CF6',
    iconName: 'Zap',
    status: 'On Track',
    aiAdvice: 'Airtel broadband and BESCOM electricity bills accounted for.',
  },
  {
    id: 'b-7',
    category: 'Entertainment & Leisure',
    monthlyBudget: 3000,
    spent: 1850,
    color: '#F97316',
    iconName: 'Film',
    status: 'On Track',
    aiAdvice: 'Healthy buffer remaining; spending paced reasonably.',
  },
  {
    id: 'b-8',
    category: 'Healthcare & Wellness',
    monthlyBudget: 2000,
    spent: 850,
    color: '#06B6D4',
    iconName: 'HeartPulse',
    status: 'On Track',
    aiAdvice: 'Routine pharmacy purchases only; ₹1,150 surplus remaining.',
  }
];

export const defaultBills: RecurringBill[] = [
  {
    id: 'rec-1',
    name: 'House Rent',
    category: 'Housing & Rent',
    amount: 15000,
    dueDate: '01 Sep',
    dueDay: 1,
    frequency: 'Monthly',
    paymentMethod: 'UPI',
    status: 'Paid',
    reminderEnabled: true,
    isAutoDebit: false,
    billerName: 'Landlord UPI (suresh.landlord@okaxis)',
  },
  {
    id: 'rec-2',
    name: 'Airtel Fiber Broadband',
    category: 'Bills & Utilities',
    amount: 999,
    dueDate: '05 Sep',
    dueDay: 5,
    frequency: 'Monthly',
    paymentMethod: 'UPI',
    status: 'Upcoming',
    reminderEnabled: true,
    isAutoDebit: true,
    billerName: 'Airtel Broadband BBPS',
  },
  {
    id: 'rec-3',
    name: 'BESCOM Electricity Bill',
    category: 'Bills & Utilities',
    amount: 1850,
    dueDate: '08 Sep',
    dueDay: 8,
    frequency: 'Monthly',
    paymentMethod: 'UPI',
    status: 'Upcoming',
    reminderEnabled: true,
    isAutoDebit: false,
    billerName: 'Bangalore Electricity Supply Co.',
  },
  {
    id: 'rec-4',
    name: 'HDFC Personal Loan EMI',
    category: 'EMI & Debt Repayment',
    amount: 8500,
    dueDate: '10 Sep',
    dueDay: 10,
    frequency: 'Monthly',
    paymentMethod: 'Auto-Debit EMI',
    status: 'Upcoming',
    reminderEnabled: true,
    isAutoDebit: true,
    billerName: 'HDFC Bank Loan A/c *8821',
  },
  {
    id: 'rec-5',
    name: 'Digital OTT & Music Bundle',
    category: 'Entertainment & Leisure',
    amount: 499,
    dueDate: '15 Sep',
    dueDay: 15,
    frequency: 'Monthly',
    paymentMethod: 'Credit Card',
    status: 'Upcoming',
    reminderEnabled: true,
    isAutoDebit: true,
    billerName: 'Netflix / Spotify Recurring',
  },
  {
    id: 'rec-6',
    name: 'Groww Nifty 50 Index Fund SIP',
    category: 'Investments & Savings',
    amount: 5000,
    dueDate: '03 Sep',
    dueDay: 3,
    frequency: 'Monthly',
    paymentMethod: 'NetBanking',
    status: 'Upcoming',
    reminderEnabled: true,
    isAutoDebit: true,
    billerName: 'UTI Nifty 50 Index Fund SIP',
  }
];

export const defaultTransactions: Transaction[] = [
  {
    id: 'tx-unusual-1',
    date: '2026-08-30',
    time: '02:45 AM',
    description: 'Online Purchase – High-End Electronics Store',
    category: 'Shopping & E-Commerce',
    amount: 12500,
    type: 'expense',
    paymentMethod: 'Credit Card',
    upiIdOrMerchant: 'ElectroHub Online Bangalore',
    accountMask: '•••• 7714',
    riskStatus: 'Potentially Unusual',
    riskLevel: 'High',
    riskReason: [
      'Amount (₹12,500) is 3.4x higher than your typical shopping transaction median (₹3,600).',
      'Merchant category (Luxury Electronics) is uncommon for this account profile.',
      'Transaction timestamp (02:45 AM) deviates significantly from your daytime active hours (8:00 AM - 11:30 PM).'
    ],
    notes: 'Auto-flagged by FinSight Anomaly Detector. Potentially unusual – please review.'
  },
  {
    id: 'tx-1',
    date: '2026-09-01',
    time: '09:00 AM',
    description: 'Monthly Salary Credit – TechCorp Solutions Pvt Ltd',
    category: 'Income & Salary',
    amount: 65000,
    type: 'income',
    paymentMethod: 'NetBanking',
    upiIdOrMerchant: 'TechCorp Solutions ACH',
    accountMask: '•••• 4192',
    riskStatus: 'Normal',
    riskLevel: 'Low'
  },
  {
    id: 'tx-2',
    date: '2026-09-01',
    time: '11:15 AM',
    description: 'House Rent Transfer (September)',
    category: 'Housing & Rent',
    amount: 15000,
    type: 'expense',
    paymentMethod: 'UPI',
    upiIdOrMerchant: 'suresh.landlord@okaxis',
    accountMask: '•••• 4192',
    riskStatus: 'Normal',
    riskLevel: 'Low',
    isRecurring: true
  },
  {
    id: 'tx-3',
    date: '2026-08-29',
    time: '08:40 PM',
    description: 'Swiggy Gourmet Dinner with Friends',
    category: 'Food & Dining',
    amount: 1450,
    type: 'expense',
    paymentMethod: 'UPI',
    upiIdOrMerchant: 'swiggy@icici',
    riskStatus: 'Normal',
    riskLevel: 'Low'
  },
  {
    id: 'tx-4',
    date: '2026-08-28',
    time: '06:15 PM',
    description: 'Zepto 10-min Grocery & Daily Essentials',
    category: 'Food & Dining',
    amount: 980,
    type: 'expense',
    paymentMethod: 'UPI',
    upiIdOrMerchant: 'zepto.kirana@hdfcbank',
    riskStatus: 'Normal',
    riskLevel: 'Low'
  },
  {
    id: 'tx-5',
    date: '2026-08-27',
    time: '07:30 PM',
    description: 'Uber Premier Office Commute (Surge Pricing)',
    category: 'Transport & Commute',
    amount: 650,
    type: 'expense',
    paymentMethod: 'UPI',
    upiIdOrMerchant: 'uber.payments@axisbank',
    riskStatus: 'Normal',
    riskLevel: 'Low'
  },
  {
    id: 'tx-6',
    date: '2026-08-26',
    time: '03:20 PM',
    description: 'Amazon India – Ergonomic Desk Mat & Cables',
    category: 'Shopping & E-Commerce',
    amount: 1850,
    type: 'expense',
    paymentMethod: 'Credit Card',
    upiIdOrMerchant: 'amazon.seller.in',
    riskStatus: 'Normal',
    riskLevel: 'Low'
  },
  {
    id: 'tx-7',
    date: '2026-08-25',
    time: '01:10 PM',
    description: 'Subway Sandwich & Cold Pressed Juice',
    category: 'Food & Dining',
    amount: 420,
    type: 'expense',
    paymentMethod: 'UPI',
    upiIdOrMerchant: 'subway.blr@okaxis',
    riskStatus: 'Normal',
    riskLevel: 'Low'
  },
  {
    id: 'tx-8',
    date: '2026-08-24',
    time: '09:15 PM',
    description: 'PVR INOX Gold Class Movie Tickets',
    category: 'Entertainment & Leisure',
    amount: 1100,
    type: 'expense',
    paymentMethod: 'Debit Card',
    upiIdOrMerchant: 'pvrcinemas@hdfcbank',
    riskStatus: 'Normal',
    riskLevel: 'Low'
  },
  {
    id: 'tx-9',
    date: '2026-08-22',
    time: '10:00 AM',
    description: 'Apollo Pharmacy – Multivitamins & First Aid',
    category: 'Healthcare & Wellness',
    amount: 850,
    type: 'expense',
    paymentMethod: 'UPI',
    upiIdOrMerchant: 'apollopharmacy@icici',
    riskStatus: 'Normal',
    riskLevel: 'Low'
  },
  {
    id: 'tx-10',
    date: '2026-08-20',
    time: '08:30 AM',
    description: 'Namma Metro Smart Card Auto-Recharge',
    category: 'Transport & Commute',
    amount: 500,
    type: 'expense',
    paymentMethod: 'UPI',
    upiIdOrMerchant: 'bmrcl.metro@sbi',
    riskStatus: 'Normal',
    riskLevel: 'Low'
  },
  {
    id: 'tx-11',
    date: '2026-08-18',
    time: '04:45 PM',
    description: 'Zomato Office Lunch Treat',
    category: 'Food & Dining',
    amount: 720,
    type: 'expense',
    paymentMethod: 'UPI',
    upiIdOrMerchant: 'zomato.order@hdfcbank',
    riskStatus: 'Normal',
    riskLevel: 'Low'
  },
  {
    id: 'tx-12',
    date: '2026-08-15',
    time: '06:00 PM',
    description: 'Myntra Independence Day Apparel Sale',
    category: 'Shopping & E-Commerce',
    amount: 3200,
    type: 'expense',
    paymentMethod: 'Credit Card',
    upiIdOrMerchant: 'myntra.fashion@icici',
    riskStatus: 'Normal',
    riskLevel: 'Low'
  },
  {
    id: 'tx-13',
    date: '2026-08-10',
    time: '11:00 AM',
    description: 'HDFC Personal Loan Monthly EMI Auto-Debit',
    category: 'EMI & Debt Repayment',
    amount: 8500,
    type: 'expense',
    paymentMethod: 'Auto-Debit EMI',
    upiIdOrMerchant: 'HDFC Bank Loan CMS',
    riskStatus: 'Normal',
    riskLevel: 'Low',
    isRecurring: true
  },
  {
    id: 'tx-14',
    date: '2026-08-08',
    time: '02:00 PM',
    description: 'BESCOM Electricity Bill Payment',
    category: 'Bills & Utilities',
    amount: 1850,
    type: 'expense',
    paymentMethod: 'UPI',
    upiIdOrMerchant: 'bescom.billdesk@sbi',
    riskStatus: 'Normal',
    riskLevel: 'Low',
    isRecurring: true
  },
  {
    id: 'tx-15',
    date: '2026-08-05',
    time: '05:00 PM',
    description: 'Airtel Broadband Monthly Invoice',
    category: 'Bills & Utilities',
    amount: 999,
    type: 'expense',
    paymentMethod: 'UPI',
    upiIdOrMerchant: 'airtel.broadband@axisbank',
    riskStatus: 'Normal',
    riskLevel: 'Low',
    isRecurring: true
  },
  {
    id: 'tx-16',
    date: '2026-08-03',
    time: '10:30 AM',
    description: 'Groww Mutual Fund Monthly SIP Debit',
    category: 'Investments & Savings',
    amount: 5000,
    type: 'expense',
    paymentMethod: 'NetBanking',
    upiIdOrMerchant: 'BSE Star MF / Groww',
    riskStatus: 'Normal',
    riskLevel: 'Low',
    isRecurring: true
  },
  {
    id: 'tx-17',
    date: '2026-08-01',
    time: '09:00 AM',
    description: 'Monthly Salary Credit – TechCorp Solutions Pvt Ltd',
    category: 'Income & Salary',
    amount: 65000,
    type: 'income',
    paymentMethod: 'NetBanking',
    upiIdOrMerchant: 'TechCorp Solutions ACH',
    riskStatus: 'Normal',
    riskLevel: 'Low'
  }
];

export const defaultGoals: FinancialGoal[] = [
  {
    id: 'goal-1',
    name: 'Emergency Buffer (4 Months Living Expenses)',
    targetAmount: 170000,
    currentAmount: 85450,
    targetDate: '2027-03-31',
    monthlyContribution: 5000,
    category: 'Emergency Fund',
    icon: 'ShieldCheck',
    color: '#10B981'
  },
  {
    id: 'goal-2',
    name: 'Apartment Down Payment (Bengaluru)',
    targetAmount: 1500000,
    currentAmount: 260000,
    targetDate: '2028-12-31',
    monthlyContribution: 15000,
    category: 'Down Payment',
    icon: 'Building2',
    color: '#6366F1'
  },
  {
    id: 'goal-3',
    name: 'Japan Autumn Vacation',
    targetAmount: 200000,
    currentAmount: 60000,
    targetDate: '2027-10-15',
    monthlyContribution: 10000,
    category: 'Vacation',
    icon: 'Plane',
    color: '#F59E0B'
  },
  {
    id: 'goal-4',
    name: 'FIRE Retirement Corpus Milestone',
    targetAmount: 10000000,
    currentAmount: 260000,
    targetDate: '2042-01-01',
    monthlyContribution: 25000,
    category: 'Retirement',
    icon: 'Flame',
    color: '#EC4899'
  }
];

export const defaultRecommendations: Recommendation[] = [
  {
    id: 'rec-1',
    type: 'Spending Insight',
    title: 'Transport Commute Expenses Surge (+18%)',
    summary: 'Your transport spending increased by 18% compared with the previous month (₹4,800 vs ₹4,050 average).',
    whyExplanation: [
      'Frequent peak-hour surge pricing on app cabs (7 ride occurrences)',
      'Commute budget is currently at 96% utilization with 10 days remaining in the billing cycle',
      'Potential monthly savings: ₹1,200 by combining metro transit on 3 weekdays'
    ],
    impactAmountRupees: 1200,
    impactLevel: 'Medium',
    actionLabel: 'Review Commute Breakdown',
    actionTab: 'spending',
    category: 'Transport & Commute'
  },
  {
    id: 'rec-2',
    type: 'Savings Opportunity',
    title: 'Idle Cash Sweep Opportunity (Earn +₹4,800/yr)',
    summary: 'You have ₹62,400 in your low-yield checking account (earning ~2.7%). Sweeping ₹35,000 into a liquid auto-sweep or arbitrage fund generates higher post-tax yields.',
    whyExplanation: [
      'Current checking balance is well above your required 15-day operational buffer (₹25,000)',
      'Safe liquid funds currently yield 6.8%–7.1% with instant T+0 redemption up to ₹50,000',
      'Keeps your money liquid while improving overall financial health score by +4 points'
    ],
    impactAmountRupees: 4800,
    impactLevel: 'High',
    actionLabel: 'Explore Liquid Funds Plan',
    actionTab: 'health',
    category: 'Investments & Savings'
  },
  {
    id: 'rec-3',
    type: 'Cash-Flow Warning',
    title: 'Upcoming Concentrated Outflows (Sep 5 – Sep 10)',
    summary: 'Fixed obligations totaling ₹11,349 are scheduled across the next 10 days (Broadband, BESCOM Electricity, and HDFC EMI).',
    whyExplanation: [
      'Sep 5: Airtel Broadband (₹999)',
      'Sep 8: BESCOM Electricity (₹1,850)',
      'Sep 10: HDFC Personal Loan EMI (₹8,500)',
      'Expected buffer remains positive (₹74,101), but timely payment reminders are advised'
    ],
    impactAmountRupees: 11349,
    impactLevel: 'Medium',
    actionLabel: 'View Payment Timeline',
    actionTab: 'recurring',
    category: 'Bills & Utilities'
  },
  {
    id: 'rec-4',
    type: 'Transaction Review',
    title: 'Potentially Unusual Purchase Detected (₹12,500)',
    summary: 'A ₹12,500 transaction at ElectroHub Online on Aug 30 differs significantly from your normal spending profile.',
    whyExplanation: [
      'Amount is 3.4x greater than your typical shopping transaction median',
      'Merchant category (Luxury Electronics) has not appeared in your 6-month history',
      'Transaction timestamp (2:45 AM) is outside your active shopping hours',
      'Note: This is flagged for your awareness and is not confirmed fraud'
    ],
    impactAmountRupees: 12500,
    impactLevel: 'High',
    actionLabel: 'Review Anomaly Details',
    actionTab: 'risk-alerts',
    category: 'Shopping & E-Commerce'
  }
];

export const defaultChatMessages: ChatMessage[] = [
  {
    id: 'msg-welcome',
    sender: 'advisor',
    timestamp: '1:30 PM',
    text: `Hello Aarav! I'm **FinSight AI Advisor**, your predictive financial intelligence companion.

I have analyzed your **August–September 2026** cash flow, spending categories, and upcoming obligations.

**Quick Snapshot:**
• **Financial Health Score:** 78/100 (Good – Room for Improvement)
• **Current Balance:** ₹85,450
• **Net Monthly Savings:** ₹22,250 (34.2% rate)
• **Pending Alert:** 1 potentially unusual transaction flagged for review (₹12,500)

How can I assist your financial planning today?`,
    suggestedPrompts: [
      'How am I doing financially?',
      'Why did my financial health score decrease?',
      'Where am I spending the most?',
      'Can I afford my upcoming expenses?',
      'How can I improve my savings?',
      'What transactions should I review?',
      'Simulate: What if I lose my job for 3 months?',
      'Calculate my FIRE retirement number'
    ]
  }
];

export const categoryColors: Record<ExpenseCategory, string> = {
  'Housing & Rent': '#6366F1',
  'EMI & Debt Repayment': '#EF4444',
  'Shopping & E-Commerce': '#EC4899',
  'Food & Dining': '#F59E0B',
  'Transport & Commute': '#3B82F6',
  'Bills & Utilities': '#8B5CF6',
  'Entertainment & Leisure': '#F97316',
  'Healthcare & Wellness': '#06B6D4',
  'Education & Learning': '#10B981',
  'Investments & Savings': '#14B8A6',
  'Income & Salary': '#22C55E',
  'Other': '#64748B'
};

export const currencyExchangeRates: Record<string, { symbol: string; rate: number; name: string }> = {
  INR: { symbol: '₹', rate: 1.0, name: 'Indian Rupee' },
  USD: { symbol: '$', rate: 0.012, name: 'US Dollar' },
  EUR: { symbol: '€', rate: 0.011, name: 'Euro' },
  GBP: { symbol: '£', rate: 0.0095, name: 'British Pound' },
  AED: { symbol: 'AED ', rate: 0.044, name: 'UAE Dirham' },
  SGD: { symbol: 'S$', rate: 0.016, name: 'Singapore Dollar' },
};