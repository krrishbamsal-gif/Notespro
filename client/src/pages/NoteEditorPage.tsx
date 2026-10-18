import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Save,
  Download,
  Sparkles,
  ArrowLeft,
  Pin,
  Star,
  Eye,
  Edit3,
  Layers,
  GraduationCap,
  MessageSquare,
  HelpCircle,
  Check,
  CheckCircle2,
  Trash2
} from 'lucide-react';
import { useNotes } from '../context/NotesContext';
import { useStudy } from '../context/StudyContext';
import { api } from '../services/api';
import { MarkdownViewer } from '../components/common/MarkdownViewer';
import { ExportModal } from '../components/common/ExportModal';

export const NoteEditorPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { notes, createNote, updateNote, deleteNote, togglePin, toggleFavorite } = useNotes();
  const { createDeck, createQuiz } = useStudy();

  const isNew = id === 'new' || !id;
  const existingNote = !isNew ? notes.find((n) => n.id === id) : null;

  const [title, setTitle] = useState(existingNote?.title || 'Untitled Study Guide');
  const [content, setContent] = useState(existingNote?.content || '# New Study Guide\n\nStart typing markdown notes or ask AI to assist...\n');
  const [subject, setSubject] = useState(existingNote?.subject || 'General');
  const [tagsInput, setTagsInput] = useState(existingNote?.tags.join(', ') || '');
  const [mode, setMode] = useState<'split' | 'edit' | 'preview'>('split');
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'dirty'>('saved');

  // AI Assistant sidebar inside editor
  const [aiSidebarOpen, setAiSidebarOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  const [showExportModal, setShowExportModal] = useState(false);

  // Auto-save logic
  useEffect(() => {
    if (!existingNote && !isNew) return;

    setSaveStatus('dirty');
    const timer = setTimeout(() => {
      setSaveStatus('saving');
      const tags = tagsInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      if (isNew) {
        // Only auto create if title or content changed from placeholder
        if (content.length > 50) {
          const created = createNote({
            userId: 'usr-demo-999',
            title,
            content,
            subject,
            tags,
            isPinned: false,
            isFavorite: false,
            language: 'en',
            style: 'smart',
            sourceType: 'manual',
            charCount: content.length,
          });
          navigate(`/notes/${created.id}`, { replace: true });
        }
      } else if (existingNote) {
        updateNote(existingNote.id, {
          title,
          content,
          subject,
          tags,
          charCount: content.length,
        });
      }
      setSaveStatus('saved');
    }, 1200);

    return () => clearTimeout(timer);
  }, [title, content, subject, tagsInput]);

  const handleAIAction = async (action: 'simplify' | 'mcq' | 'flashcards' | 'hindi') => {
    setAiLoading(true);
    setAiResponse(null);
    setAiSidebarOpen(true);

    try {
      if (action === 'simplify') {
        const res = await api.simplify({ text: content.slice(0, 4000), level: 'eli5' });
        setAiResponse(res.simplified);
      } else if (action === 'hindi') {
        const res = await api.simplify({ text: content.slice(0, 4000), level: 'hindi' });
        setAiResponse(res.simplified);
      } else if (action === 'mcq') {
        const res = await api.generateQuiz({ content: content.slice(0, 5000), count: 3, topic: title });
        createQuiz(title, subject, res.quiz, existingNote?.id);
        setAiResponse(`Created 3 Practice Questions and saved them to your Quiz Center!`);
      } else if (action === 'flashcards') {
        const res = await api.generateFlashcards({ content: content.slice(0, 5000), count: 5, topic: title });
        createDeck(title, res.flashcards, existingNote?.id);
        setAiResponse(`Generated 5 flashcards and saved deck to Flashcards Center!`);
      }
    } catch (err: any) {
      setAiResponse(`AI Assistant error: ${err.message}`);
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-5rem)] flex flex-col space-y-4 animate-in fade-in">
      {/* Editor Top Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800 gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/notes')}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors"
            title="Back to notes"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Note Title..."
              className="bg-transparent text-lg sm:text-xl font-extrabold text-white focus:outline-none placeholder-slate-600 w-full max-w-sm sm:max-w-md"
            />
            <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
              <span className="flex items-center gap-1">
                {saveStatus === 'saved' ? (
                  <>
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>Auto-Saved</span>
                  </>
                ) : (
                  <>
                    <div className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                    <span>Saving changes...</span>
                  </>
                )}
              </span>
              <span>·</span>
              <span>{content.length.toLocaleString()} characters</span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Mode Switcher */}
          <div className="flex p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400">
            <button
              onClick={() => setMode('edit')}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                mode === 'edit' ? 'bg-purple-600/30 text-purple-300 font-medium' : 'hover:text-white'
              }`}
            >
              Write
            </button>
            <button
              onClick={() => setMode('split')}
              className={`hidden md:block px-2.5 py-1 rounded-lg transition-colors ${
                mode === 'split' ? 'bg-purple-600/30 text-purple-300 font-medium' : 'hover:text-white'
              }`}
            >
              Split View
            </button>
            <button
              onClick={() => setMode('preview')}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                mode === 'preview' ? 'bg-purple-600/30 text-purple-300 font-medium' : 'hover:text-white'
              }`}
            >
              Preview
            </button>
          </div>

          {/* AI Copilot Toggle */}
          <button
            onClick={() => setAiSidebarOpen(!aiSidebarOpen)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
              aiSidebarOpen
                ? 'bg-purple-600 text-white border-purple-500'
                : 'bg-purple-600/10 text-purple-300 border-purple-500/30 hover:bg-purple-600/20'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">AI Assistant</span>
          </button>

          {/* Export Button */}
          <button
            onClick={() => setShowExportModal(true)}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800"
            title="Export Note"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Editor Body */}
      <div className="flex-1 flex gap-4 min-h-0 relative">
        {/* Main Editor Panes */}
        <div className={`flex-1 flex gap-4 min-h-0 ${mode === 'split' ? 'grid grid-cols-1 md:grid-cols-2' : ''}`}>
          {/* Write Pane */}
          {(mode === 'edit' || mode === 'split') && (
            <div className="h-full flex flex-col rounded-2xl bg-slate-950 border border-slate-800/80 p-4 overflow-hidden">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write in standard Markdown (# Heading, - Bullets, **Bold**, > Quotes)..."
                className="w-full h-full bg-transparent text-slate-200 placeholder-slate-600 font-mono text-xs sm:text-sm focus:outline-none resize-none leading-relaxed overflow-y-auto"
              />
            </div>
          )}

          {/* Preview Pane */}
          {(mode === 'preview' || mode === 'split') && (
            <div className="h-full rounded-2xl bg-slate-900/40 border border-slate-800/80 p-6 overflow-y-auto">
              <MarkdownViewer content={content} />
            </div>
          )}
        </div>

        {/* AI Assistant Sidebar Drawer */}
        {aiSidebarOpen && (
          <div className="w-80 rounded-2xl bg-slate-900 border border-purple-500/30 p-4 flex flex-col justify-between shadow-2xl flex-shrink-0 animate-in slide-in-from-right duration-200">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2 text-purple-300 font-bold text-xs">
                  <Sparkles className="w-4 h-4" />
                  <span>Study Copilot</span>
                </div>
                <button
                  onClick={() => setAiSidebarOpen(false)}
                  className="text-xs text-slate-500 hover:text-slate-300"
                >
                  ✕
                </button>
              </div>

              {/* Quick Prompt Buttons */}
              <div className="space-y-2">
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Quick AI Actions
                </p>

                <button
                  onClick={() => handleAIAction('simplify')}
                  disabled={aiLoading}
                  className="w-full text-left p-2.5 rounded-xl bg-slate-950 hover:bg-purple-950/40 border border-slate-800 hover:border-purple-500/30 text-xs text-slate-300 transition-colors flex items-center justify-between"
                >
                  <span>💡 Simplify Concept (ELI5)</span>
                </button>

                <button
                  onClick={() => handleAIAction('hindi')}
                  disabled={aiLoading}
                  className="w-full text-left p-2.5 rounded-xl bg-slate-950 hover:bg-purple-950/40 border border-slate-800 hover:border-purple-500/30 text-xs text-slate-300 transition-colors flex items-center justify-between"
                >
                  <span>🇮🇳 Explain in Simple Hindi</span>
                </button>

                <button
                  onClick={() => handleAIAction('flashcards')}
                  disabled={aiLoading}
                  className="w-full text-left p-2.5 rounded-xl bg-slate-950 hover:bg-cyan-950/40 border border-slate-800 hover:border-cyan-500/30 text-xs text-slate-300 transition-colors flex items-center justify-between"
                >
                  <span>🗂️ Generate 5 Flashcards</span>
                </button>

                <button
                  onClick={() => handleAIAction('mcq')}
                  disabled={aiLoading}
                  className="w-full text-left p-2.5 rounded-xl bg-slate-950 hover:bg-emerald-950/40 border border-slate-800 hover:border-emerald-500/30 text-xs text-slate-300 transition-colors flex items-center justify-between"
                >
                  <span>🎓 Generate Exam Practice MCQs</span>
                </button>
              </div>

              {/* AI Output Result Box */}
              {aiLoading ? (
                <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/30 text-center text-xs text-purple-300 space-y-2">
                  <div className="w-5 h-5 border-2 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto" />
                  <p>Analyzing note content...</p>
                </div>
              ) : aiResponse ? (
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 max-h-56 overflow-y-auto space-y-2">
                  <p className="font-semibold text-purple-300">AI Response:</p>
                  <div className="whitespace-pre-wrap leading-relaxed text-[11px]">{aiResponse}</div>
                </div>
              ) : null}
            </div>

            <div className="pt-3 border-t border-slate-800 text-[10px] text-slate-500 text-center">
              NotesPro Copilot powered by Gemini
            </div>
          </div>
        )}
      </div>

      {showExportModal && (
        <ExportModal
          isOpen={showExportModal}
          onClose={() => setShowExportModal(false)}
          note={{
            id: existingNote?.id || 'temp',
            userId: 'usr-demo-999',
            title,
            content,
            tags: tagsInput.split(',').map((t) => t.trim()),
            isPinned: existingNote?.isPinned || false,
            isFavorite: existingNote?.isFavorite || false,
            language: existingNote?.language || 'en',
            style: existingNote?.style || 'smart',
            sourceType: existingNote?.sourceType || 'manual',
            charCount: content.length,
            createdAt: existingNote?.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }}
        />
      )}
    </div>
  );
};
