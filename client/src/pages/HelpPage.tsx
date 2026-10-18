import React, { useState } from 'react';
import {
  HelpCircle,
  Sparkles,
  FileText,
  Layers,
  GraduationCap,
  Keyboard,
  ChevronDown,
  Mail,
  ExternalLink
} from 'lucide-react';

export const HelpPage: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How does NotesPro AI generate structured smart notes?',
      a: 'NotesPro AI leverages Google Gemini 2.5 Flash to ingest raw lecture transcripts, uploaded PDF textbooks, or pasted text. It identifies the foundational axioms, filters out rhetorical filler, structures headings and subheadings, extracts formal definitions, and adds high-yield takeaways and exam strategy tips.',
    },
    {
      q: 'How do I use my own Google Gemini API Key?',
      a: 'Navigate to Settings & Preferences from the left sidebar or top profile menu. Paste your free Gemini API key into the input field and click "Save Key". You can obtain an API key with generous free quotas at https://aistudio.google.com/app/apikey. When no key is entered, the app gracefully operates in Smart Demo Mode with realistic academic models.',
    },
    {
      q: 'Can I export notes to PDF, Markdown, and TXT?',
      a: 'Yes! Every note features an "Export" button in both the Notes list and the Note Editor. You can download crisp, print-ready PDFs formatted with high-contrast typography, standard Markdown (.md) compatible with Obsidian and Notion, or raw plain text (.txt).',
    },
    {
      q: 'Does NotesPro AI support Hindi and other languages?',
      a: 'Yes. NotesPro AI features native bilingual synthesis for English and Hindi (including Devanagari script and educational Hinglish). You can summarize English PDFs into Hindi, or vice versa, with accurate technical definitions maintained in parentheses.',
    },
    {
      q: 'How do Flashcard drills and Active Recall work?',
      a: 'You can convert any generated note into an interactive 3D flip card deck with one click. Use your Spacebar to flip between question and answer, and Left/Right arrow keys to navigate. Rating cards as "Mastered" trains your spaced repetition profile and records mastery statistics.',
    },
  ];

  const shortcuts = [
    { keys: ['Ctrl', 'K'], desc: 'Open global search palette across notes and quizzes' },
    { keys: ['Space'], desc: 'Flip flashcard between question and answer' },
    { keys: ['←', '→'], desc: 'Navigate to previous or next flashcard' },
    { keys: ['Esc'], desc: 'Close any open modal or search bar' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 text-purple-300 text-xs font-semibold mb-2 border border-purple-500/20">
          <HelpCircle className="w-3.5 h-3.5 text-purple-400" />
          <span>Documentation & Support</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Help & FAQ</h1>
        <p className="text-sm text-slate-400">
          Frequently asked questions, keyboard shortcuts cheat sheet, and setup guidelines.
        </p>
      </div>

      {/* Keyboard Shortcuts Cheat Sheet */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center gap-2.5 text-white font-bold text-base">
          <Keyboard className="w-5 h-5 text-purple-400" />
          <span>Keyboard Shortcuts</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {shortcuts.map((sc, i) => (
            <div
              key={i}
              className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between"
            >
              <span className="text-xs text-slate-300">{sc.desc}</span>
              <div className="flex items-center gap-1">
                {sc.keys.map((k, kIdx) => (
                  <kbd
                    key={kIdx}
                    className="px-2 py-0.5 rounded bg-slate-800 text-[11px] font-mono text-purple-300 border border-slate-700 font-semibold"
                  >
                    {k}
                  </kbd>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Accordion */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        <h2 className="text-base font-bold text-white mb-2">Frequently Asked Questions</h2>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full text-left p-4 flex items-center justify-between text-xs sm:text-sm font-semibold text-white hover:text-purple-300 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-500 transition-transform ${
                      isOpen ? 'rotate-180 text-purple-400' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 text-xs text-slate-400 leading-relaxed border-t border-slate-800/80 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
