import { Transaction, ExpenseCategory, PaymentMethod } from '../types/finance';

export function parseCSVBankStatement(csvContent: string): { transactions: Transaction[]; errors: string[] } {
  const lines = csvContent.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);
  const transactions: Transaction[] = [];
  const errors: string[] = [];

  if (lines.length === 0) {
    return { transactions, errors: ['CSV file is empty.'] };
  }

  // Detect header line
  let startIndex = 0;
  const firstLine = lines[0].toLowerCase();
  if (firstLine.includes('date') || firstLine.includes('amount') || firstLine.includes('description') || firstLine.includes('narration')) {
    startIndex = 1;
  }

  for (let i = startIndex; i < lines.length; i++) {
    const rawLine = lines[i];
    // Split by comma ignoring commas inside quotes
    const cells = splitCSVLine(rawLine);

    if (cells.length < 3) {
      errors.push(`Line ${i + 1}: Insufficient columns (${cells.length} found, minimum 3 required).`);
      continue;
    }

    const dateStr = cells[0] || '2026-09-01';
    const descStr = cells[1] || 'Imported Transaction';
    const categoryCandidate = cells[2] || '';
    const amountCandidate = cells[3] || cells[2];
    const paymentCandidate = cells[4] || 'UPI';

    const parsedAmount = Math.abs(parseFloat(amountCandidate.replace(/[^0-9.-]/g, '')) || 500);
    const category = categorizeMerchant(descStr, categoryCandidate);
    const paymentMethod = mapPaymentMethod(paymentCandidate);
    const isIncome = descStr.toLowerCase().includes('salary') || descStr.toLowerCase().includes('credit') || category === 'Income & Salary';

    // Anomaly detection rules
    const isPotentiallyUnusual = !isIncome && parsedAmount >= 12000;
    const isSuspicious = !isIncome && parsedAmount >= 25000;

    transactions.push({
      id: `csv-tx-${Date.now()}-${i}`,
      date: normalizeDate(dateStr),
      time: '12:00 PM',
      description: descStr,
      category,
      amount: parsedAmount,
      type: isIncome ? 'income' : 'expense',
      paymentMethod,
      upiIdOrMerchant: descStr.slice(0, 30),
      riskStatus: isSuspicious ? 'Flagged Suspicious' : isPotentiallyUnusual ? 'Potentially Unusual' : 'Normal',
      riskLevel: isSuspicious ? 'High' : isPotentiallyUnusual ? 'Medium' : 'Low',
      riskReason: isSuspicious
        ? [`Transaction amount ₹${parsedAmount.toLocaleString('en-IN')} is extremely high for this profile.`]
        : isPotentiallyUnusual
        ? [`Imported transaction exceeds ₹10,000 threshold. Flagged for review.`]
        : undefined
    });
  }

  return { transactions, errors };
}

function splitCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"' || char === "'") {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result.map(s => s.replace(/^["']|["']$/g, ''));
}

function normalizeDate(d: string): string {
  if (/^\d{4}-\d{2}-\d{2}$/.test(d)) return d;
  try {
    const parsed = new Date(d);
    if (!isNaN(parsed.getTime())) {
      return parsed.toISOString().split('T')[0];
    }
  } catch {
    // fallback
  }
  return '2026-09-01';
}

function categorizeMerchant(desc: string, cand: string): ExpenseCategory {
  const low = desc.toLowerCase();
  if (low.includes('salary') || low.includes('payroll') || low.includes('dividend')) return 'Income & Salary';
  if (low.includes('rent') || low.includes('landlord')) return 'Housing & Rent';
  if (low.includes('loan') || low.includes('emi') || low.includes('hdfc loan')) return 'EMI & Debt Repayment';
  if (low.includes('swiggy') || low.includes('zomato') || low.includes('restaurant') || low.includes('food') || low.includes('cafe')) return 'Food & Dining';
  if (low.includes('uber') || low.includes('ola') || low.includes('metro') || low.includes('fuel') || low.includes('petrol')) return 'Transport & Commute';
  if (low.includes('amazon') || low.includes('flipkart') || low.includes('myntra') || low.includes('mall') || low.includes('store')) return 'Shopping & E-Commerce';
  if (low.includes('airtel') || low.includes('electricity') || low.includes('bescom') || low.includes('water') || low.includes('broadband')) return 'Bills & Utilities';
  if (low.includes('netflix') || low.includes('spotify') || low.includes('cinema') || low.includes('pvr') || low.includes('theatre')) return 'Entertainment & Leisure';
  if (low.includes('apollo') || low.includes('pharmacy') || low.includes('hospital') || low.includes('clinic') || low.includes('doctor')) return 'Healthcare & Wellness';
  if (low.includes('sip') || low.includes('mutual fund') || low.includes('groww') || low.includes('zerodha') || low.includes('ppf')) return 'Investments & Savings';

  if (cand && cand.length > 2) {
    return cand as ExpenseCategory;
  }
  return 'Shopping & E-Commerce';
}

function mapPaymentMethod(p: string): PaymentMethod {
  const low = p.toLowerCase();
  if (low.includes('credit')) return 'Credit Card';
  if (low.includes('debit')) return 'Debit Card';
  if (low.includes('emi') || low.includes('auto')) return 'Auto-Debit EMI';
  if (low.includes('netbanking')) return 'NetBanking';
  if (low.includes('cash')) return 'Cash';
  if (low.includes('wallet')) return 'Wallet';
  return 'UPI';
}