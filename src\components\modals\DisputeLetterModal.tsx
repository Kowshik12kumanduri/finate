import React, { useState } from 'react';
import { X, FileText, Copy, Printer, Check, ShieldAlert } from 'lucide-react';
import { useFinance } from '../../context/FinancialContext';

export const DisputeLetterModal: React.FC = () => {
  const { isDisputeModalOpen, setIsDisputeModalOpen, disputeTx, profile, formatAmount, addToast } = useFinance();
  const [copied, setCopied] = useState(false);

  if (!isDisputeModalOpen || !disputeTx) return null;

  const letterText = `FORMAL NOTICE OF TRANSACTION DISPUTE & CHARGEBACK REQUEST

To:
The Card Operations & Dispute Department
${disputeTx.paymentMethod === 'Credit Card' ? 'ICICI Bank Credit Cards Division' : 'HDFC Bank Customer Grievance Cell'}
Customer Care & Grievance Department

Date: ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}

Subject: Immediate Dispute and Unauthorized Chargeback Request for ${formatAmount(disputeTx.amount)}

Dear Grievance Officer,

I am writing to formally dispute the following debit recorded against my account:

1. Account Holder Name: ${profile.name}
2. Registered Email: ${profile.email}
3. Associated Account / Mask: ${disputeTx.accountMask || '•••• 7714'}
4. Transaction Date & Time: ${disputeTx.date} at ${disputeTx.time || '02:45 AM'}
5. Transaction Amount: ${formatAmount(disputeTx.amount)} (INR ${disputeTx.amount})
6. Merchant Description: ${disputeTx.description} (${disputeTx.upiIdOrMerchant || 'ElectroHub Online Bangalore'})
7. System Dispute Reference ID: FINSIGHT-DISP-${disputeTx.id.toUpperCase()}

REASON FOR DISPUTE:
FinSight AI Anomaly Detection System has flagged this charge with High Fraud Risk due to:
- Deviation from historical daytime spending hours (${disputeTx.time || '02:45 AM'} transaction).
- Amount is 3.4x higher than standard median shopping expenditure.
- The transaction was either not authorized by myself or merchant failed to deliver requested goods.

RELIEF REQUESTED:
Under Reserve Bank of India (RBI) circular on Limiting Liability of Customers in Unauthorized Electronic Banking Transactions (DBR.No.Leg.BC.78/09.07.005/2017-18):
1. Immediately place a temporary shadow credit for the disputed amount of ${formatAmount(disputeTx.amount)}.
2. Initiate a retrieval request / chargeback claim with the acquiring bank.
3. Block any interest charges or finance fees associated with this transaction.

Thank you for your prompt investigation and resolution.

Sincerely,
${profile.name}
${profile.city}
Generated via FinSight AI Risk Protection Shield`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(letterText);
    setCopied(true);
    addToast('success', 'Copied to Clipboard', 'Formal dispute notice copied. Paste directly into bank email or portal.');
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6 relative animate-in fade-in zoom-in-95 max-h-[90vh] flex flex-col">
        <button
          onClick={() => setIsDisputeModalOpen(false)}
          className="absolute top-4 right-4 p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 mb-3">
          <ShieldAlert className="w-5 h-5 text-rose-400" />
          <div>
            <h2 className="text-base font-bold text-white">Bank Dispute & Chargeback Letter Generator</h2>
            <p className="text-[11px] text-slate-400">RBI Compliance Ready Formal Chargeback Notice</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pr-1 my-3 rounded-xl bg-slate-950 border border-slate-800 p-4 font-mono text-[11px] leading-relaxed text-slate-200 whitespace-pre-wrap selection:bg-rose-500/30">
          {letterText}
        </div>

        <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
          <span className="text-[11px] text-slate-400 flex items-center gap-1">
            <FileText className="w-3.5 h-3.5 text-indigo-400" />
            Ready for netbanking portal or email submission
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <Printer className="w-3.5 h-3.5" />
              Print Letter
            </button>
            <button
              onClick={copyToClipboard}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-1.5 transition shadow-lg shadow-rose-600/20 active:scale-95"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied Notice' : 'Copy Letter Text'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};