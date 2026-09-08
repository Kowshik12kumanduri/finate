import { TaxRegimeComparison } from '../types/finance';

export function calculateIndianTax(
  grossAnnualSalary: number = 780000,
  claimed80C: number = 150000,
  claimed80D: number = 25000,
  claimedHRA: number = 120000
): TaxRegimeComparison {
  // Old Regime Calculations
  const oldStandardDeduction = 50000;
  const old80C = Math.min(150000, claimed80C);
  const old80D = Math.min(50000, claimed80D);
  const oldHra = Math.min(180000, claimedHRA);

  const oldTotalDeductions = oldStandardDeduction + old80C + old80D + oldHra;
  const oldNetTaxable = Math.max(0, grossAnnualSalary - oldTotalDeductions);

  let oldBaseTax = 0;
  if (oldNetTaxable <= 250000) {
    oldBaseTax = 0;
  } else if (oldNetTaxable <= 500000) {
    oldBaseTax = (oldNetTaxable - 250000) * 0.05;
  } else if (oldNetTaxable <= 1000000) {
    oldBaseTax = 12500 + (oldNetTaxable - 500000) * 0.20;
  } else {
    oldBaseTax = 112500 + (oldNetTaxable - 1000000) * 0.30;
  }

  // Section 87A rebate for Old Regime: if taxable <= 5L, rebate up to 12500
  if (oldNetTaxable <= 500000) {
    oldBaseTax = 0;
  }

  const oldCess = oldBaseTax * 0.04;
  const oldTotalTax = Math.round(oldBaseTax + oldCess);
  const oldEffectiveRate = grossAnnualSalary > 0 ? (oldTotalTax / grossAnnualSalary) * 100 : 0;

  // New Regime Calculations (Budget FY 2025-26 & 2026-27 update)
  const newStandardDeduction = 75000;
  const newNetTaxable = Math.max(0, grossAnnualSalary - newStandardDeduction);

  let newBaseTax = 0;
  if (newNetTaxable <= 300000) {
    newBaseTax = 0;
  } else if (newNetTaxable <= 700000) {
    newBaseTax = (newNetTaxable - 300000) * 0.05;
  } else if (newNetTaxable <= 1000000) {
    newBaseTax = 20000 + (newNetTaxable - 700000) * 0.10;
  } else if (newNetTaxable <= 1200000) {
    newBaseTax = 50000 + (newNetTaxable - 1000000) * 0.15;
  } else if (newNetTaxable <= 1500000) {
    newBaseTax = 80000 + (newNetTaxable - 1200000) * 0.20;
  } else {
    newBaseTax = 140000 + (newNetTaxable - 1500000) * 0.30;
  }

  // Section 87A rebate for New Regime: if taxable <= 7L, base tax is zero
  if (newNetTaxable <= 700000) {
    newBaseTax = 0;
  }

  const newCess = newBaseTax * 0.04;
  const newTotalTax = Math.round(newBaseTax + newCess);
  const newEffectiveRate = grossAnnualSalary > 0 ? (newTotalTax / grossAnnualSalary) * 100 : 0;

  const diff = oldTotalTax - newTotalTax;
  let betterRegime: 'Old Regime' | 'New Regime' | 'Equivalent' = 'Equivalent';
  if (diff > 500) betterRegime = 'New Regime';
  else if (diff < -500) betterRegime = 'Old Regime';

  const savings = Math.abs(diff);

  const recommendations: string[] = [];
  if (betterRegime === 'New Regime') {
    recommendations.push(
      `Switching to the **New Tax Regime** saves you **₹${savings.toLocaleString('en-IN')} annually** thanks to the enhanced ₹75,000 standard deduction and wider 5% & 10% tax brackets.`
    );
    recommendations.push(
      'You are no longer required to lock capital into tax-saving lock-in instruments (ELSS, PPF) solely for tax saving, allowing greater flexibility in high-growth equity funds.'
    );
  } else if (betterRegime === 'Old Regime') {
    recommendations.push(
      `Staying in the **Old Tax Regime** saves you **₹${savings.toLocaleString('en-IN')} annually** due to substantial combined deductions across HRA (₹${claimedHRA.toLocaleString('en-IN')}) and Section 80C.`
    );
    recommendations.push(
      'Ensure you submit valid rent receipts and your landlord PAN to your payroll team to preserve your HRA exemption.'
    );
  } else {
    recommendations.push('Both regimes result in virtually identical tax liability. The New Regime offers less documentation overhead.');
  }

  return {
    grossAnnualSalary,
    oldRegime: {
      grossTotalIncome: grossAnnualSalary,
      standardDeduction: oldStandardDeduction,
      section80C: old80C,
      section80D: old80D,
      hraExemption: oldHra,
      netTaxableIncome: oldNetTaxable,
      calculatedTax: Math.round(oldBaseTax),
      cess: Math.round(oldCess),
      totalTaxPayable: oldTotalTax,
      effectiveRate: Math.round(oldEffectiveRate * 10) / 10
    },
    newRegime: {
      grossTotalIncome: grossAnnualSalary,
      standardDeduction: newStandardDeduction,
      netTaxableIncome: newNetTaxable,
      calculatedTax: Math.round(newBaseTax),
      cess: Math.round(newCess),
      totalTaxPayable: newTotalTax,
      effectiveRate: Math.round(newEffectiveRate * 10) / 10
    },
    betterRegime,
    annualTaxSavings: savings,
    recommendations
  };
}