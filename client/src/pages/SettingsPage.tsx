import React, { useState, useEffect } from 'react';
import {
  Settings,
  Key,
  Sparkles,
  ShieldCheck,
  User,
  Palette,
  Database,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Save,
  Trash2,
  Download
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNotes } from '../context/NotesContext';
import { useStudy } from '../context/StudyContext';
import { api } from '../services/api';

export const SettingsPage: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const { theme, toggleTheme, accent, setAccent } = useTheme();
  const { notes } = useNotes();
  const { decks, tasks } = useStudy();

  const [apiKey, setApiKey] = useState(() => localStorage.getItem('notespro_gemini_api_key') || '');
  const [keySaved, setKeySaved] = useState(false);
  const [testingKey, setTestingKey] = useState(false);
  const [keyStatus, setKeyStatus] = useState<string | null>(null);

  const [fullName, setFullName] = useState(user?.fullName || '');
  const [targetExam, setTargetExam] = useState(user?.targetExam || '');
  const [profileSaved, setProfileSaved] = useState(false);

  const handleSaveApiKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem('notespro_gemini_api_key', apiKey.trim());
    } else {
      localStorage.removeItem('notespro_gemini_api_key');
    }
    setKeySaved(true);
    setTimeout(() => setKeySaved(false), 2000);
  };

  const handleTestApiKey = async () => {
    setTestingKey(true);
    setKeyStatus(null);
    try {
      if (apiKey.trim()) {
        localStorage.setItem('notespro_gemini_api_key', apiKey.trim());
      }
      const status = await api.getAIStatus();
      if (status.mode === 'live') {
        setKeyStatus('Key verified! Live Gemini 3.8 Flash is ready.');
      } else {
        setKeyStatus('Running in Smart Demo Mode. Add a valid Gemini key to enable live API.');
      }
    } catch (err: any) {
      setKeyStatus(`Error verifying: ${err.message}`);
    } finally {
      setTestingKey(false);
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ fullName, targetExam });
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2000);
  };

  const handleExportAllData = () => {
    const data = {
      exportDate: new Date().toISOString(),
      user,
      notes,
      decks,
      tasks,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `notespro_ai_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClearCache = () => {
    if (confirm('This will reset your local study notes and restore demo defaults. Proceed?')) {
      localStorage.removeItem('notespro_notes');
      localStorage.removeItem('notespro_decks');
      localStorage.removeItem('notespro_tasks');
      window.location.reload();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Settings & Preferences</h1>
        <p className="text-sm text-slate-400">
          Configure Google Gemini AI credentials, theme styling, user details, and data backup.
        </p>
      </div>

      {/* 1. AI Configuration Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Google Gemini API Configuration</h2>
            <p className="text-xs text-slate-400">
              Unlock unlimited live notes synthesis, flashcard generation, and document Q&A.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-purple-400" />
              <span>Gemini API Key</span>
            </label>
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noreferrer"
              className="text-xs text-purple-400 hover:underline flex items-center gap-1"
            >
              <span>Get Free Key at Google AI Studio</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="AIzaSy..."
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-600 text-xs font-mono focus:outline-none focus:border-purple-500/70"
          />

          <p className="text-[11px] text-slate-500">
            Keys entered here remain securely in your local browser storage or backend environment and are never exposed publicly.
          </p>

          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={handleSaveApiKey}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              {keySaved ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
              <span>{keySaved ? 'Saved Locally' : 'Save Key'}</span>
            </button>

            <button
              onClick={handleTestApiKey}
              disabled={testingKey}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors disabled:opacity-50"
            >
              {testingKey ? 'Verifying...' : 'Test Connection'}
            </button>
          </div>

          {keyStatus && (
            <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-500/30 text-purple-200 text-xs mt-2">
              {keyStatus}
            </div>
          )}
        </div>
      </div>

      {/* 2. User Profile Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-600/20 text-cyan-400 flex items-center justify-center">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Academic Profile</h2>
            <p className="text-xs text-slate-400">Tailor note generation for your degree or target exams.</p>
          </div>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-purple-500/60"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Target Exam or Course</label>
              <input
                type="text"
                value={targetExam}
                onChange={(e) => setTargetExam(e.target.value)}
                placeholder="e.g. GATE 2026, MCAT, B.Tech Finals"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-purple-500/60"
              />
            </div>
          </div>

          <button
            type="submit"
            className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-colors flex items-center gap-1.5"
          >
            {profileSaved ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
            <span>{profileSaved ? 'Profile Updated' : 'Save Profile'}</span>
          </button>
        </form>
      </div>

      {/* 3. Appearance Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-600/20 text-purple-400 flex items-center justify-center">
            <Palette className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Appearance & Theme</h2>
            <p className="text-xs text-slate-400">Customize the visual workspace feel.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-white">Mode: {theme.toUpperCase()}</p>
              <p className="text-[11px] text-slate-400">Toggle dark / light ambient mode</p>
            </div>
            <button
              onClick={toggleTheme}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 text-slate-200 text-xs font-medium hover:bg-slate-700"
            >
              Toggle
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-white">Accent Palette</p>
              <p className="text-[11px] text-slate-400">Purple Nebula, Cyan Aurora, Emerald</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setAccent('purple')}
                className={`w-6 h-6 rounded-full bg-purple-500 border-2 ${
                  accent === 'purple' ? 'border-white' : 'border-transparent'
                }`}
                title="Purple Nebula"
              />
              <button
                onClick={() => setAccent('cyan')}
                className={`w-6 h-6 rounded-full bg-cyan-500 border-2 ${
                  accent === 'cyan' ? 'border-white' : 'border-transparent'
                }`}
                title="Cyan Aurora"
              />
              <button
                onClick={() => setAccent('emerald')}
                className={`w-6 h-6 rounded-full bg-emerald-500 border-2 ${
                  accent === 'emerald' ? 'border-white' : 'border-transparent'
                }`}
                title="Emerald Focus"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 4. Data Backup & Reset */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Data Management & Backup</h2>
            <p className="text-xs text-slate-400">Export complete JSON backup or reset workspace data.</p>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={handleExportAllData}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-2 transition-colors"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Export Full Backup (JSON)</span>
          </button>

          <button
            onClick={handleClearCache}
            className="px-4 py-2.5 rounded-xl bg-rose-950/40 hover:bg-rose-950/60 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-2 transition-colors"
          >
            <Trash2 className="w-4 h-4 text-rose-400" />
            <span>Reset Workspace Cache</span>
          </button>
        </div>
      </div>
    </div>
  );
};
