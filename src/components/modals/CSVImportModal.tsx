import React, { useState } from 'react';
import { X, UploadCloud, FileText, CheckCircle2, AlertTriangle, Download } from 'lucide-react';
import { useFinance } from '../../context/FinancialContext';
import { parseCSVBankStatement } from '../../services/csvParser';
import { Transaction } from '../../types/finance';

export const CSVImportModal: React.FC = () => {
  const { isCSVImportModalOpen, setIsCSVImportModalOpen, addTransaction, addToast, formatAmount } = useFinance();

  const [parsedTxs, setParsedTxs] = useState<Transaction[]>([]);
  const [parseErrors, setParseErrors] = useState<string[]>([]);
  const [fileName, setFileName] = useState<string>('');

  if (!isCSVImportModalOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = event => {
      const content = event.target?.result as string;
      const { transactions, errors } = parseCSVBankStatement(content);
      setParsedTxs(transactions);
      setParseErrors(errors);
    };
    reader.readAsText(file);
  };

  const handleConfirmImport = () => {
    if (parsedTxs.length === 0) return;
    for (const tx of parsedTxs) {
      addTransaction(tx);
    }
    addToast('success', 'Import Complete', `Imported ${parsedTxs.length} transactions from ${fileName}.`);
    setParsedTxs([]);
    setFileName('');
    setIsCSVImportModalOpen(false);
  };

  const downloadSampleTemplate = () => {
    const sample = `Date,Description,Category,Amount,PaymentMethod
2026-09-02,Starbucks Reserve Coffee,Food & Dining,450,UPI
2026-09-03,Flipkart Big Billion Electronics,Shopping & E-Commerce,14500,Credit Card
2026-09-04,Uber City Ride,Transport & Commute,320,UPI
2026-09-05,Cult.Fit Gym Membership,Healthcare & Wellness,1800,Credit Card
2026-09-06,Tech Freelance Retainer,Income & Salary,25000,NetBanking`;

    const blob = new Blob([sample], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'finsight_sample_bank_statement.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6 relative animate-in fade-in zoom-in-95 max-h-[90vh] flex flex-col">
        <button
          onClick={() => setIsCSVImportModalOpen(false)}
          className="absolute top-4 right-4 p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <UploadCloud className="w-5 h-5 text-indigo-400" />
          <h2 className="text-base font-bold text-white">Import CSV Bank / UPI Statement</h2>
        </div>

        <div className="space-y-4 flex-1 overflow-y-auto pr-1">
          {/* Drag & Drop Area */}
          <div className="border-2 border-dashed border-slate-700 hover:border-indigo-500 rounded-2xl p-6 text-center transition bg-slate-950/50 relative cursor-pointer group">
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
            <FileText className="w-10 h-10 text-slate-500 group-hover:text-indigo-400 mx-auto mb-2 transition" />
            <div className="text-xs font-bold text-white mb-1">
              {fileName ? fileName : 'Click or drag bank CSV statement here'}
            </div>
            <p className="text-[11px] text-slate-400">
              Supports HDFC, SBI, ICICI, Axis, and standard (Date, Description, Category, Amount, Method) formats
            </p>
          </div>

          {/* Template Download Bar */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div className="text-xs">
              <span className="font-bold text-white block">Need a test statement template?</span>
              <span className="text-[11px] text-slate-400">Download our sample CSV with pre-populated test data</span>
            </div>
            <button
              onClick={downloadSampleTemplate}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <Download className="w-3.5 h-3.5 text-indigo-400" />
              Download Template
            </button>
          </div>

          {/* Parse Errors */}
          {parseErrors.length > 0 && (
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" /> CSV Parsing Notes
              </div>
              {parseErrors.slice(0, 3).map((err, idx) => (
                <p key={idx} className="text-[11px]">{err}</p>
              ))}
            </div>
          )}

          {/* Preview Table */}
          {parsedTxs.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-white">Parsed Transactions ({parsedTxs.length})</span>
                <span className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Ready to Import
                </span>
              </div>

              <div className="max-h-56 overflow-y-auto rounded-xl border border-slate-800">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 text-[10px] font-mono uppercase">
                    <tr>
                      <th className="p-2.5">Date</th>
                      <th className="p-2.5">Description</th>
                      <th className="p-2.5">Category</th>
                      <th className="p-2.5 text-right">Amount</th>
                      <th className="p-2.5">Risk Flag</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 bg-slate-900/40">
                    {parsedTxs.map((t, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/40">
                        <td className="p-2.5 font-mono text-[11px] text-slate-400">{t.date}</td>
                        <td className="p-2.5 text-slate-200 font-medium truncate max-w-[140px]">{t.description}</td>
                        <td className="p-2.5 text-slate-400 text-[11px]">{t.category}</td>
                        <td className="p-2.5 text-right font-mono font-bold text-white">{formatAmount(t.amount)}</td>
                        <td className="p-2.5">
                          {t.riskStatus !== 'Normal' ? (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                              {t.riskStatus}
                            </span>
                          ) : (
                            <span className="text-[10px] text-emerald-400 font-semibold">Normal</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3 mt-4">
          <button
            onClick={() => setIsCSVImportModalOpen(false)}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition"
          >
            Close
          </button>
          <button
            disabled={parsedTxs.length === 0}
            onClick={handleConfirmImport}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold shadow-lg shadow-indigo-600/20 transition active:scale-95"
          >
            Import {parsedTxs.length} Transactions
          </button>
        </div>
      </div>
    </div>
  );
};