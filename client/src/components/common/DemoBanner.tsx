import React, { useState, useEffect } from 'react';
import { Sparkles, Key, ExternalLink, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';

export const DemoBanner: React.FC = () => {
  const [isDismissed, setIsDismissed] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const [model, setModel] = useState('gemini-3.8-flash');

  useEffect(() => {
    api.getAIStatus().then((status) => {
      setIsLive(status.mode === 'live');
      setModel(status.model || 'gemini-3.8-flash');
    });
  }, []);

  if (isDismissed) return null;

  return (
    <div className={`px-4 py-2 border-b text-xs flex items-center justify-between transition-all ${
      isLive 
        ? 'bg-purple-950/40 border-purple-800/40 text-purple-200' 
        : 'bg-amber-950/40 border-amber-800/40 text-amber-200'
    }`}>
      <div className="flex items-center gap-2 max-w-4xl truncate">
        {isLive ? (
          <>
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold text-emerald-400">Live AI Active:</span>
            <span>Running with official Google {model} intelligence.</span>
          </>
        ) : (
          <>
            <span className="flex h-2 w-2 rounded-full bg-amber-400 animate-ping" />
            <span className="font-semibold text-amber-300">Smart Demo Mode:</span>
            <span className="hidden sm:inline">All features fully functional with synthetic academic models.</span>
            <span>Add your free Google Gemini API key to unlock live cloud AI.</span>
          </>
        )}
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        {!isLive && (
          <Link
            to="/settings"
            className="flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 transition-colors font-medium text-xs"
          >
            <Key className="w-3 h-3" />
            <span>Enter API Key</span>
          </Link>
        )}
        {isLive && (
          <a
            href="https://aistudio.google.com/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 hover:underline text-purple-300 text-xs"
          >
            <span>Google AI Studio</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        )}
        <button
          onClick={() => setIsDismissed(true)}
          className="p-1 hover:bg-white/10 rounded transition-colors text-slate-400 hover:text-white"
          title="Dismiss notification"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
