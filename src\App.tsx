import React, { useState } from 'react';
import { FinancialProvider, useFinance } from './context/FinancialContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { ToastContainer } from './components/layout/Toast';

// Views
import { DashboardView } from './components/views/DashboardView';
import { FinancialHealthView } from './components/views/FinancialHealthView';
import { SpendingAnalysisView } from './components/views/SpendingAnalysisView';
import { BudgetEngineView } from './components/views/BudgetEngineView';
import { CashFlowForecastView } from './components/views/CashFlowForecastView';
import { ScenarioSimulatorView } from './components/views/ScenarioSimulatorView';
import { GoalPlannerView } from './components/views/GoalPlannerView';
import { RiskAlertsView } from './components/views/RiskAlertsView';
import { AIAdvisorView } from './components/views/AIAdvisorView';
import { RecommendationsView } from './components/views/RecommendationsView';
import { TaxOptimizerView } from './components/views/TaxOptimizerView';
import { LoanOptimizerView } from './components/views/LoanOptimizerView';
import { RecurringBillsView } from './components/views/RecurringBillsView';
import { AccountsOverviewView } from './components/views/AccountsOverviewView';
import { TransactionsView } from './components/views/TransactionsView';
import { ReportsView } from './components/views/ReportsView';
import { SettingsView } from './components/views/SettingsView';

// Modals
import { AddTransactionModal } from './components/modals/AddTransactionModal';
import { CSVImportModal } from './components/modals/CSVImportModal';
import { AddAccountModal } from './components/modals/AddAccountModal';
import { AddBillModal } from './components/modals/AddBillModal';
import { DisputeLetterModal } from './components/modals/DisputeLetterModal';
import { ExplainableHealthModal } from './components/modals/ExplainableHealthModal';

const AppContent: React.FC = () => {
  const { activeTab } = useFinance();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'health':
        return <FinancialHealthView />;
      case 'spending':
        return <SpendingAnalysisView />;
      case 'budget':
        return <BudgetEngineView />;
      case 'cashflow':
        return <CashFlowForecastView />;
      case 'scenarios':
        return <ScenarioSimulatorView />;
      case 'goals':
        return <GoalPlannerView />;
      case 'risk-alerts':
        return <RiskAlertsView />;
      case 'advisor':
        return <AIAdvisorView />;
      case 'recommendations':
        return <RecommendationsView />;
      case 'tax-optimizer':
        return <TaxOptimizerView />;
      case 'loan-optimizer':
        return <LoanOptimizerView />;
      case 'recurring':
        return <RecurringBillsView />;
      case 'overview':
        return <AccountsOverviewView />;
      case 'transactions':
        return <TransactionsView />;
      case 'reports':
        return <ReportsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      {/* Sidebar Navigation */}
      <Sidebar mobileOpen={mobileMenuOpen} setMobileOpen={setMobileMenuOpen} />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-72 flex flex-col min-h-screen">
        <Header onOpenMobileMenu={() => setMobileMenuOpen(true)} />

        <main className="flex-1 p-4 lg:p-8 max-w-7xl w-full mx-auto animate-in fade-in duration-150">
          {renderActiveView()}
        </main>
      </div>

      {/* Global Modals */}
      <AddTransactionModal />
      <CSVImportModal />
      <AddAccountModal />
      <AddBillModal />
      <DisputeLetterModal />
      <ExplainableHealthModal />

      {/* Toast Notifications */}
      <ToastContainer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <FinancialProvider>
      <AppContent />
    </FinancialProvider>
  );
};

export default App;