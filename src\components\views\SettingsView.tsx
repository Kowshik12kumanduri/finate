import React, { useState } from 'react';
import {
  Settings,
  User,
  Key,
  Globe,
  RotateCcw,
  Volume2,
  Download,
  Upload,
  CheckCircle2,
  ShieldAlert
} from 'lucide-react';
import { useFinance } from '../../context/FinancialContext';
import { CurrencyCode } from '../../types/finance';
import { currencyExchangeRates } from '../../data/defaultData';

export const SettingsView: React.FC = () => {
  const {
    profile,
    setProfile,
    currency,
    setCurrency,
    apiKey,
    setApiKey,
    apiProvider,
    setApiProvider,
    voiceTtsEnabled,
    setVoiceTtsEnabled,
    resetToDemoData,
    exportDataJSON,
    importDataJSON,
    addToast
  } = useFinance();

  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [occupation, setOccupation] = useState(profile.occupation);
  const [city, setCity] = useState(profile.city);
  const [income, setIncome] = useState(String(profile.monthlyIncomeBaseline));
  const [keyInput, setKeyInput] = useState(apiKey);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setProfile(prev => ({
      ...prev,
      name,
      email,
      occupation,
      city,
      monthlyIncomeBaseline: parseFloat(income) || 65000
    }));
    setApiKey(keyInput);
    addToast('success', 'Profile Updated', 'Your profile and API settings have been saved.');
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const content = ev.target?.result as string;
      importDataJSON(content);
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <Settings className="w-6 h-6 text-indigo-400" />
          <h1 className="text-2xl font-black text-white tracking-tight">Settings & Financial Governance</h1>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Manage local persistent profile, dual AI keys, base currency, and backup snapshots
        </p>
      </div>

      <form onSubmit={handleSaveProfile} className="space-y-6">
        {/* Profile Details Card */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 font-bold text-sm text-white">
            <User className="w-4 h-4 text-indigo-400" />
            <span>Personal Profile & Location</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Profession / Occupation
              </label>
              <input
                type="text"
                value={occupation}
                onChange={e => setOccupation(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                City / Region
              </label>
              <input
                type="text"
                value={city}
                onChange={e => setCity(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Monthly Net Salary Baseline (₹)
              </label>
              <input
                type="number"
                value={income}
                onChange={e => setIncome(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Primary Currency
              </label>
              <select
                value={currency}
                onChange={e => setCurrency(e.target.value as CurrencyCode)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
              >
                {(Object.keys(currencyExchangeRates) as CurrencyCode[]).map(c => (
                  <option key={c} value={c}>
                    {currencyExchangeRates[c].name} ({currencyExchangeRates[c].symbol})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* AI & Speech Settings */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 font-bold text-sm text-white">
            <Key className="w-4 h-4 text-amber-400" />
            <span>AI Copilot & LLM Configuration</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                AI Provider
              </label>
              <div className="grid grid-cols-2 p-1 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setApiProvider('gemini')}
                  className={`py-2 rounded-lg transition ${
                    apiProvider === 'gemini' ? 'bg-indigo-600 text-white' : 'text-slate-400'
                  }`}
                >
                  Google Gemini
                </button>
                <button
                  type="button"
                  onClick={() => setApiProvider('openai')}
                  className={`py-2 rounded-lg transition ${
                    apiProvider === 'openai' ? 'bg-indigo-600 text-white' : 'text-slate-400'
                  }`}
                >
                  OpenAI
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                API Key (Optional – Offline Fallback Active)
              </label>
              <input
                type="password"
                value={keyInput}
                onChange={e => setKeyInput(e.target.value)}
                placeholder="Enter Gemini or OpenAI API Key"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <input
              type="checkbox"
              id="voiceToggle"
              checked={voiceTtsEnabled}
              onChange={e => setVoiceTtsEnabled(e.target.checked)}
              className="rounded bg-slate-950 border-slate-700 text-indigo-600 focus:ring-0"
            />
            <label htmlFor="voiceToggle" className="text-xs text-slate-300 select-none">
              Enable Text-to-Speech (TTS) Voice Read-Aloud for AI Financial Answers
            </label>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/20 transition active:scale-95"
          >
            Save All Preferences
          </button>
        </div>
      </form>

      {/* Data Backup, Restore & Reset Section */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-white">Local Data Governance & Cloud Backup</h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            type="button"
            onClick={exportDataJSON}
            className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition text-left space-y-1"
          >
            <Download className="w-5 h-5 text-indigo-400" />
            <div className="text-xs font-bold text-white">Export Backup JSON</div>
            <p className="text-[11px] text-slate-400">Download complete ledger snapshot</p>
          </button>

          <label className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition text-left space-y-1 cursor-pointer block">
            <input
              type="file"
              accept=".json"
              onChange={handleFileImport}
              className="hidden"
            />
            <Upload className="w-5 h-5 text-emerald-400" />
            <div className="text-xs font-bold text-white">Restore Backup JSON</div>
            <p className="text-[11px] text-slate-400">Upload existing snapshot</p>
          </label>

          <button
            type="button"
            onClick={resetToDemoData}
            className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-rose-500/40 transition text-left space-y-1 group"
          >
            <RotateCcw className="w-5 h-5 text-rose-400 group-hover:rotate-180 transition-transform duration-500" />
            <div className="text-xs font-bold text-rose-300">Reset Demo Data</div>
            <p className="text-[11px] text-slate-400">Restore original Aarav Sharma dataset</p>
          </button>
        </div>
      </div>
    </div>
  );
};