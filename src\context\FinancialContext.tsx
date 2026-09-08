import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  UserProfile,
  FinancialAccount,
  BudgetCategory,
  RecurringBill,
  Transaction,
  FinancialGoal,
  Recommendation,
  ChatMessage,
  FinancialHealthScore,
  DailyForecastPoint,
  CurrencyCode
} from '../types/finance';
import {
  defaultProfile,
  defaultAccounts,
  defaultBudgets,
  defaultBills,
  defaultTransactions,
  defaultGoals,
  defaultRecommendations,
  defaultChatMessages
} from '../data/defaultData';
import { calculateHealthScore, generateCashFlowForecast, formatMoney } from '../services/rulesEngine';
import { askFinSightAdvisor } from '../services/geminiService';

export interface ToastMessage {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message: string;
}

interface FinancialContextType {
  // Navigation
  activeTab: string;
  setActiveTab: (tab: string) => void;

  // Profile & Currency
  profile: UserProfile;
  setProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  currency: CurrencyCode;
  setCurrency: (c: CurrencyCode) => void;
  formatAmount: (amount: number, options?: { compact?: boolean; showSign?: boolean }) => string;

  // API Config
  apiKey: string;
  setApiKey: (k: string) => void;
  apiProvider: 'gemini' | 'openai';
  setApiProvider: (p: 'gemini' | 'openai') => void;
  voiceTtsEnabled: boolean;
  setVoiceTtsEnabled: (v: boolean) => void;

  // Core Data
  accounts: FinancialAccount[];
  budgets: BudgetCategory[];
  recurringBills: RecurringBill[];
  transactions: Transaction[];
  goals: FinancialGoal[];
  recommendations: Recommendation[];
  chatMessages: ChatMessage[];
  healthScore: FinancialHealthScore;
  cashFlowForecast: DailyForecastPoint[];

  // Computed Totals
  totalLiquidBalance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  netSavings: number;
  savingsRate: number;
  unresolvedAnomaliesCount: number;

  // Actions
  addTransaction: (tx: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
  resolveAnomaly: (txId: string, status: 'Resolved Safe' | 'Normal') => void;
  updateBudget: (id: string, newBudget: number) => void;
  addAccount: (acc: Omit<FinancialAccount, 'id'>) => void;
  deleteAccount: (id: string) => void;
  addRecurringBill: (bill: Omit<RecurringBill, 'id'>) => void;
  toggleBillPaid: (id: string) => void;
  addGoal: (goal: Omit<FinancialGoal, 'id'>) => void;
  updateGoalProgress: (id: string, addAmount: number) => void;
  sendChatMessage: (text: string) => Promise<void>;
  clearChat: () => void;
  resetToDemoData: () => void;
  exportDataJSON: () => void;
  importDataJSON: (json: string) => boolean;

  // Modals & Drawers
  isAddTxModalOpen: boolean;
  setIsAddTxModalOpen: (v: boolean) => void;
  isCSVImportModalOpen: boolean;
  setIsCSVImportModalOpen: (v: boolean) => void;
  isAddAccountModalOpen: boolean;
  setIsAddAccountModalOpen: (v: boolean) => void;
  isAddBillModalOpen: boolean;
  setIsAddBillModalOpen: (v: boolean) => void;
  isExplainModalOpen: boolean;
  setIsExplainModalOpen: (v: boolean) => void;
  isDisputeModalOpen: boolean;
  setIsDisputeModalOpen: (v: boolean) => void;
  disputeTx: Transaction | null;
  openDisputeModal: (tx: Transaction) => void;

  // Toast
  toasts: ToastMessage[];
  addToast: (type: ToastMessage['type'], title: string, message: string) => void;
  removeToast: (id: string) => void;
}

const FinancialContext = createContext<FinancialContextType | undefined>(undefined);

const STORAGE_KEY = 'finsight_ai_data_v2';

export const FinancialProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Currency & Profile
  const [currency, setCurrency] = useState<CurrencyCode>('INR');
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);

  // API Config
  const [apiKey, setApiKey] = useState<string>('');
  const [apiProvider, setApiProvider] = useState<'gemini' | 'openai'>('gemini');
  const [voiceTtsEnabled, setVoiceTtsEnabled] = useState<boolean>(false);

  // Entities
  const [accounts, setAccounts] = useState<FinancialAccount[]>(defaultAccounts);
  const [budgets, setBudgets] = useState<BudgetCategory[]>(defaultBudgets);
  const [recurringBills, setRecurringBills] = useState<RecurringBill[]>(defaultBills);
  const [transactions, setTransactions] = useState<Transaction[]>(defaultTransactions);
  const [goals, setGoals] = useState<FinancialGoal[]>(defaultGoals);
  const [recommendations, setRecommendations] = useState<Recommendation[]>(defaultRecommendations);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(defaultChatMessages);

  // Modals
  const [isAddTxModalOpen, setIsAddTxModalOpen] = useState<boolean>(false);
  const [isCSVImportModalOpen, setIsCSVImportModalOpen] = useState<boolean>(false);
  const [isAddAccountModalOpen, setIsAddAccountModalOpen] = useState<boolean>(false);
  const [isAddBillModalOpen, setIsAddBillModalOpen] = useState<boolean>(false);
  const [isExplainModalOpen, setIsExplainModalOpen] = useState<boolean>(false);
  const [isDisputeModalOpen, setIsDisputeModalOpen] = useState<boolean>(false);
  const [disputeTx, setDisputeTx] = useState<Transaction | null>(null);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // 1. Load LocalStorage on initial mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.profile) setProfile(parsed.profile);
        if (parsed.currency) setCurrency(parsed.currency);
        if (parsed.apiKey) setApiKey(parsed.apiKey);
        if (parsed.apiProvider) setApiProvider(parsed.apiProvider);
        if (parsed.voiceTtsEnabled !== undefined) setVoiceTtsEnabled(parsed.voiceTtsEnabled);
        if (parsed.accounts) setAccounts(parsed.accounts);
        if (parsed.budgets) setBudgets(parsed.budgets);
        if (parsed.recurringBills) setRecurringBills(parsed.recurringBills);
        if (parsed.transactions) setTransactions(parsed.transactions);
        if (parsed.goals) setGoals(parsed.goals);
        if (parsed.chatMessages) setChatMessages(parsed.chatMessages);
      }
    } catch (err) {
      console.warn('Could not restore from localStorage:', err);
    }
  }, []);

  // 2. Persist to LocalStorage whenever state changes
  useEffect(() => {
    try {
      const payload = {
        profile,
        currency,
        apiKey,
        apiProvider,
        voiceTtsEnabled,
        accounts,
        budgets,
        recurringBills,
        transactions,
        goals,
        chatMessages
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (err) {
      console.warn('Failed to save to localStorage:', err);
    }
  }, [profile, currency, apiKey, apiProvider, voiceTtsEnabled, accounts, budgets, recurringBills, transactions, goals, chatMessages]);

  const addToast = (type: ToastMessage['type'], title: string, message: string) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts(prev => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Computed Liquid Balance across checking and savings
  const totalLiquidBalance = useMemo(() => {
    return accounts
      .filter(a => a.type === 'Bank Account' || a.type === 'Savings' || a.type === 'UPI Wallet')
      .reduce((sum, a) => sum + a.balanceOrOutstanding, 0);
  }, [accounts]);

  const monthlyIncome = profile.monthlyIncomeBaseline || 65000;

  const monthlyExpenses = useMemo(() => {
    return transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);

  const netSavings = Math.max(0, monthlyIncome - monthlyExpenses);
  const savingsRate = monthlyIncome > 0 ? (netSavings / monthlyIncome) * 100 : 0;

  const unresolvedAnomaliesCount = useMemo(() => {
    return transactions.filter(t => t.riskStatus === 'Potentially Unusual' || t.riskStatus === 'Flagged Suspicious').length;
  }, [transactions]);

  // Compute Health Score dynamically
  const healthScore = useMemo(() => {
    return calculateHealthScore(transactions, budgets, recurringBills, totalLiquidBalance, monthlyIncome);
  }, [transactions, budgets, recurringBills, totalLiquidBalance, monthlyIncome]);

  // Compute Rolling Cash Flow Forecast dynamically
  const cashFlowForecast = useMemo(() => {
    return generateCashFlowForecast(recurringBills, totalLiquidBalance, monthlyIncome);
  }, [recurringBills, totalLiquidBalance, monthlyIncome]);

  const formatAmount = (amount: number, options?: { compact?: boolean; showSign?: boolean }) => {
    return formatMoney(amount, currency, options);
  };

  // Mutators
  const addTransaction = (newTx: Omit<Transaction, 'id'>) => {
    const tx: Transaction = {
      ...newTx,
      id: `tx-${Date.now()}`
    };

    setTransactions(prev => [tx, ...prev]);

    // Update corresponding budget spent amount if expense
    if (tx.type === 'expense') {
      setBudgets(prev =>
        prev.map(b => {
          if (b.category === tx.category) {
            const newSpent = b.spent + tx.amount;
            return {
              ...b,
              spent: newSpent,
              status: newSpent > b.monthlyBudget ? 'Over Budget' : newSpent > b.monthlyBudget * 0.9 ? 'Near Limit' : 'On Track'
            };
          }
          return b;
        })
      );

      // Deduct from primary bank account
      setAccounts(prev =>
        prev.map(a => {
          if (a.id === 'acc-1') {
            return { ...a, balanceOrOutstanding: Math.max(0, a.balanceOrOutstanding - tx.amount) };
          }
          return a;
        })
      );
    } else {
      // Income credited to primary account
      setAccounts(prev =>
        prev.map(a => {
          if (a.id === 'acc-1') {
            return { ...a, balanceOrOutstanding: a.balanceOrOutstanding + tx.amount };
          }
          return a;
        })
      );
    }

    addToast('success', 'Transaction Recorded', `${tx.description} (${formatAmount(tx.amount)}) added successfully.`);
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
    addToast('info', 'Transaction Removed', 'The transaction has been deleted from your ledger.');
  };

  const resolveAnomaly = (txId: string, status: 'Resolved Safe' | 'Normal') => {
    setTransactions(prev =>
      prev.map(t => {
        if (t.id === txId) {
          return {
            ...t,
            riskStatus: status,
            notes: `Resolved by user as: ${status} on ${new Date().toLocaleDateString()}`
          };
        }
        return t;
      })
    );
    addToast('success', 'Alert Resolved', 'The transaction flag has been marked as verified and safe.');
  };

  const updateBudget = (id: string, newBudget: number) => {
    setBudgets(prev =>
      prev.map(b => {
        if (b.id === id) {
          return {
            ...b,
            monthlyBudget: newBudget,
            status: b.spent > newBudget ? 'Over Budget' : b.spent > newBudget * 0.9 ? 'Near Limit' : 'On Track'
          };
        }
        return b;
      })
    );
    addToast('success', 'Budget Updated', 'Your monthly budget allocation has been adjusted.');
  };

  const addAccount = (newAcc: Omit<FinancialAccount, 'id'>) => {
    const acc: FinancialAccount = {
      ...newAcc,
      id: `acc-${Date.now()}`
    };
    setAccounts(prev => [...prev, acc]);
    addToast('success', 'Account Linked', `${acc.name} added to your portfolio.`);
  };

  const deleteAccount = (id: string) => {
    setAccounts(prev => prev.filter(a => a.id !== id));
    addToast('info', 'Account Removed', 'The account has been unlinked.');
  };

  const addRecurringBill = (newBill: Omit<RecurringBill, 'id'>) => {
    const bill: RecurringBill = {
      ...newBill,
      id: `rec-${Date.now()}`
    };
    setRecurringBills(prev => [...prev, bill]);
    addToast('success', 'Scheduled Bill Added', `${bill.name} set up for monthly tracking.`);
  };

  const toggleBillPaid = (id: string) => {
    setRecurringBills(prev =>
      prev.map(b => {
        if (b.id === id) {
          const nextStatus = b.status === 'Paid' ? 'Upcoming' : 'Paid';
          return { ...b, status: nextStatus };
        }
        return b;
      })
    );
    addToast('success', 'Bill Status Updated', 'The payment record has been marked.');
  };

  const addGoal = (newGoal: Omit<FinancialGoal, 'id'>) => {
    const g: FinancialGoal = {
      ...newGoal,
      id: `goal-${Date.now()}`
    };
    setGoals(prev => [...prev, g]);
    addToast('success', 'Milestone Created', `New goal: ${g.name} added.`);
  };

  const updateGoalProgress = (id: string, addAmount: number) => {
    setGoals(prev =>
      prev.map(g => {
        if (g.id === id) {
          const nextAmt = Math.min(g.targetAmount, g.currentAmount + addAmount);
          return { ...g, currentAmount: nextAmt };
        }
        return g;
      })
    );
    addToast('success', 'Contribution Added', `Added ${formatAmount(addAmount)} toward goal!`);
  };

  const sendChatMessage = async (userText: string) => {
    const userMsg: ChatMessage = {
      id: `msg-user-${Date.now()}`,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      text: userText
    };

    setChatMessages(prev => [...prev, userMsg]);

    const contextPayload = {
      healthScore,
      transactions,
      budgets,
      recurring: recurringBills,
      totalBalance: totalLiquidBalance,
      monthlyIncome
    };

    const advisorReplyText = await askFinSightAdvisor(userText, contextPayload, apiKey, apiProvider);

    const advisorMsg: ChatMessage = {
      id: `msg-adv-${Date.now()}`,
      sender: 'advisor',
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      text: advisorReplyText
    };

    setChatMessages(prev => [...prev, advisorMsg]);

    // Optional Speech Synthesis read-aloud
    if (voiceTtsEnabled && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        const plainText = advisorReplyText.replace(/[#*•_`]/g, '');
        const utterance = new SpeechSynthesisUtterance(plainText.slice(0, 250));
        utterance.rate = 1.0;
        window.speechSynthesis.speak(utterance);
      } catch (e) {
        console.warn('Speech synthesis error:', e);
      }
    }
  };

  const clearChat = () => {
    setChatMessages(defaultChatMessages);
    addToast('info', 'Chat Cleared', 'Conversation history has been reset.');
  };

  const resetToDemoData = () => {
    setProfile(defaultProfile);
    setAccounts(defaultAccounts);
    setBudgets(defaultBudgets);
    setRecurringBills(defaultBills);
    setTransactions(defaultTransactions);
    setGoals(defaultGoals);
    setRecommendations(defaultRecommendations);
    setChatMessages(defaultChatMessages);
    setCurrency('INR');
    localStorage.removeItem(STORAGE_KEY);
    addToast('success', 'Demo Reset', 'All records restored to original Aarav Sharma portfolio state.');
  };

  const exportDataJSON = () => {
    const payload = {
      exportTimestamp: new Date().toISOString(),
      profile,
      currency,
      accounts,
      budgets,
      recurringBills,
      transactions,
      goals,
      chatMessages
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `finsight-ai-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    addToast('success', 'Backup Exported', 'Downloaded complete FinSight AI snapshot.');
  };

  const importDataJSON = (json: string): boolean => {
    try {
      const data = JSON.parse(json);
      if (data.profile) setProfile(data.profile);
      if (data.currency) setCurrency(data.currency);
      if (data.accounts) setAccounts(data.accounts);
      if (data.budgets) setBudgets(data.budgets);
      if (data.recurringBills) setRecurringBills(data.recurringBills);
      if (data.transactions) setTransactions(data.transactions);
      if (data.goals) setGoals(data.goals);
      addToast('success', 'Data Restored', 'Imported financial profile successfully!');
      return true;
    } catch {
      addToast('error', 'Import Failed', 'Invalid JSON backup format.');
      return false;
    }
  };

  const openDisputeModal = (tx: Transaction) => {
    setDisputeTx(tx);
    setIsDisputeModalOpen(true);
  };

  return (
    <FinancialContext.Provider
      value={{
        activeTab,
        setActiveTab,
        profile,
        setProfile,
        currency,
        setCurrency,
        formatAmount,
        apiKey,
        setApiKey,
        apiProvider,
        setApiProvider,
        voiceTtsEnabled,
        setVoiceTtsEnabled,
        accounts,
        budgets,
        recurringBills,
        transactions,
        goals,
        recommendations,
        chatMessages,
        healthScore,
        cashFlowForecast,
        totalLiquidBalance,
        monthlyIncome,
        monthlyExpenses,
        netSavings,
        savingsRate,
        unresolvedAnomaliesCount,
        addTransaction,
        deleteTransaction,
        resolveAnomaly,
        updateBudget,
        addAccount,
        deleteAccount,
        addRecurringBill,
        toggleBillPaid,
        addGoal,
        updateGoalProgress,
        sendChatMessage,
        clearChat,
        resetToDemoData,
        exportDataJSON,
        importDataJSON,
        isAddTxModalOpen,
        setIsAddTxModalOpen,
        isCSVImportModalOpen,
        setIsCSVImportModalOpen,
        isAddAccountModalOpen,
        setIsAddAccountModalOpen,
        isAddBillModalOpen,
        setIsAddBillModalOpen,
        isExplainModalOpen,
        setIsExplainModalOpen,
        isDisputeModalOpen,
        setIsDisputeModalOpen,
        disputeTx,
        openDisputeModal,
        toasts,
        addToast,
        removeToast
      }}
    >
      {children}
    </FinancialContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinancialContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinancialProvider');
  }
  return context;
};