import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  FileText,
  UploadCloud,
  Check,
  Languages,
  BookOpen,
  GraduationCap,
  Save,
  Download,
  Layers,
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import { api } from '../services/api';
import { useNotes } from '../context/NotesContext';
import { useStudy } from '../context/StudyContext';
import { MarkdownViewer } from '../components/common/MarkdownViewer';
import { ExportModal } from '../components/common/ExportModal';

export const AINotesGeneratorPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'text' | 'document' | 'transcript'>('text');
  const [inputText, setInputText] = useState('');
  const [topic, setTopic] = useState('');
  const [subject, setSubject] = useState('General');
  const [style, setStyle] = useState<'smart' | 'exam' | 'simplified' | 'summary' | 'cornell'>('smart');
  const [language, setLanguage] = useState<'en' | 'hi'>('en');

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedMarkdown, setGeneratedMarkdown] = useState<string | null>(null);
  const [generatedTitle, setGeneratedTitle] = useState<string>('');
  const [keyTakeaways, setKeyTakeaways] = useState<string[]>([]);
  const [isSaved, setIsSaved] = useState(false);
  const [createdNoteId, setCreatedNoteId] = useState<string | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { createNote } = useNotes();
  const { createDeck, createQuiz } = useStudy();
  const navigate = useNavigate();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
      setIsGenerating(true);
      setErrorMsg(null);
      try {
        const extracted = await api.extractPdf(file);
        setInputText(extracted.text);
        if (!topic) setTopic(extracted.title);
      } catch (err: any) {
        setErrorMsg(err.message || 'Failed to parse PDF.');
      } finally {
        setIsGenerating(false);
      }
    } else {
      // Text file
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setInputText(text);
        if (!topic) setTopic(file.name.replace(/\.[^/.]+$/, ''));
      };
      reader.readAsText(file);
    }
  };

  const handleGenerate = async () => {
    if (!inputText.trim()) {
      setErrorMsg('Please paste text, a transcript, or upload a document first.');
      return;
    }

    setIsGenerating(true);
    setErrorMsg(null);
    setIsSaved(false);

    try {
      const result = await api.generateNotes({
        content: inputText,
        topic: topic || 'Master Study Notes',
        style,
        language,
      });

      setGeneratedMarkdown(result.markdown);
      setGeneratedTitle(result.title);
      setKeyTakeaways(result.keyTakeaways || []);

      // Auto-save the note immediately to the user's workspace
      const newNote = createNote({
        userId: 'usr-demo-999',
        title: result.title,
        content: result.markdown,
        subject: subject || 'General',
        tags: [subject, style, language === 'hi' ? 'Hindi' : 'English'],
        isPinned: false,
        isFavorite: false,
        language,
        style,
        sourceType: activeTab === 'document' ? 'pdf' : activeTab === 'transcript' ? 'transcript' : 'ai_generator',
        charCount: result.markdown.length,
        keyTakeaways: result.keyTakeaways,
      });

      setCreatedNoteId(newNote.id);
      setIsSaved(true);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to generate study notes.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleMakeFlashcards = async () => {
    if (!generatedMarkdown) return;
    setIsGenerating(true);
    try {
      const res = await api.generateFlashcards({
        content: generatedMarkdown,
        count: 6,
        topic: generatedTitle,
        language,
      });
      createDeck(generatedTitle, res.flashcards, createdNoteId || undefined);
      navigate('/flashcards');
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleMakeQuiz = async () => {
    if (!generatedMarkdown) return;
    setIsGenerating(true);
    try {
      const res = await api.generateQuiz({
        content: generatedMarkdown,
        count: 4,
        topic: generatedTitle,
        language,
      });
      createQuiz(generatedTitle, subject, res.quiz, createdNoteId || undefined);
      navigate('/quiz');
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 text-purple-300 text-xs font-semibold mb-2 border border-purple-500/20">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>AI Knowledge Synthesizer</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">AI Notes Generator</h1>
          <p className="text-sm text-slate-400">
            Convert lecture recordings, research text, or uploaded PDFs into structured academic notes.
          </p>
        </div>

        {generatedMarkdown && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowExportModal(true)}
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-4 h-4 text-purple-400" />
              <span>Export</span>
            </button>
            {createdNoteId && (
              <button
                onClick={() => navigate(`/notes/${createdNoteId}`)}
                className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <span>Open in Editor</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Generator Configuration Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Inputs (5 cols on lg) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Input Method Tabs */}
          <div className="flex p-1 rounded-2xl bg-slate-900 border border-slate-800 text-xs font-medium">
            <button
              onClick={() => setActiveTab('text')}
              className={`flex-1 py-2 rounded-xl transition-all ${
                activeTab === 'text'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Pasted Text
            </button>
            <button
              onClick={() => setActiveTab('document')}
              className={`flex-1 py-2 rounded-xl transition-all ${
                activeTab === 'document'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Upload Document
            </button>
            <button
              onClick={() => setActiveTab('transcript')}
              className={`flex-1 py-2 rounded-xl transition-all ${
                activeTab === 'transcript'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Transcript
            </button>
          </div>

          {/* Topic & Subject Meta */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Topic / Concept</label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Backpropagation, Action Potential"
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-purple-500/60"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Subject / Course</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Computer Science, Medicine"
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-purple-500/60"
              />
            </div>
          </div>

          {/* Style & Language */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Note Style</label>
              <select
                value={style}
                onChange={(e: any) => setStyle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-purple-500/60"
              >
                <option value="smart">Comprehensive Smart Notes</option>
                <option value="exam">Exam Prep & High-Yield</option>
                <option value="cornell">Cornell 3-Column Notes</option>
                <option value="simplified">ELI5 / Intuitive Analogy</option>
                <option value="summary">Concise Summary</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Output Language</label>
              <select
                value={language}
                onChange={(e: any) => setLanguage(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-purple-500/60"
              >
                <option value="en">English (Academic)</option>
                <option value="hi">Hindi (हिंदी नोट्स)</option>
              </select>
            </div>
          </div>

          {/* Main Input Box based on tab */}
          {activeTab === 'document' ? (
            <div className="p-8 rounded-2xl border-2 border-dashed border-slate-800 hover:border-purple-500/50 bg-slate-900/40 text-center transition-colors">
              <UploadCloud className="w-10 h-10 text-purple-400 mx-auto mb-3 animate-bounce" />
              <p className="text-sm font-semibold text-white mb-1">Upload PDF or Text Document</p>
              <p className="text-xs text-slate-400 mb-4">Drag and drop file or click to browse (up to 15MB)</p>
              <label className="inline-block px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold cursor-pointer transition-colors">
                <span>Select File</span>
                <input
                  type="file"
                  accept=".pdf,.txt,.md"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
              {inputText && (
                <div className="mt-4 p-2.5 rounded-xl bg-purple-950/40 text-purple-300 text-xs font-medium">
                  Document loaded ({inputText.length.toLocaleString()} characters)
                </div>
              )}
            </div>
          ) : (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {activeTab === 'transcript' ? 'Paste Lecture Transcript or Audio Notes' : 'Source Text / Study Content'}
              </label>
              <textarea
                rows={9}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={
                  activeTab === 'transcript'
                    ? "Professor: Today we're going to examine gradient descent and how the learning rate affects convergence..."
                    : "Paste chapter text, research excerpt, textbook notes, or syllabus content here..."
                }
                className="w-full p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-slate-200 placeholder-slate-500 text-xs focus:outline-none focus:border-purple-500/60 font-mono leading-relaxed resize-none"
              />
            </div>
          )}

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !inputText.trim()}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-bold text-sm shadow-xl shadow-purple-600/30 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Synthesizing Academic Notes...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Smart Notes</span>
              </>
            )}
          </button>
        </div>

        {/* Right Output Preview (7 cols on lg) */}
        <div className="lg:col-span-7">
          <div className="rounded-3xl bg-slate-900/60 border border-slate-800 p-6 min-h-[500px] flex flex-col justify-between">
            {generatedMarkdown ? (
              <div className="space-y-6">
                {/* Status Bar */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-semibold text-emerald-400">
                      {isSaved ? 'Auto-Saved to My Notes' : 'Ready'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleMakeFlashcards}
                      disabled={isGenerating}
                      className="px-3 py-1.5 rounded-lg bg-cyan-500/15 text-cyan-300 hover:bg-cyan-500/25 border border-cyan-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      title="Convert this note into Flashcards"
                    >
                      <Layers className="w-3.5 h-3.5" />
                      <span>Make Flashcards</span>
                    </button>
                    <button
                      onClick={handleMakeQuiz}
                      disabled={isGenerating}
                      className="px-3 py-1.5 rounded-lg bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      title="Create Practice Quiz from this note"
                    >
                      <GraduationCap className="w-3.5 h-3.5" />
                      <span>Make Quiz</span>
                    </button>
                  </div>
                </div>

                {/* Markdown Viewer */}
                <div className="max-h-[600px] overflow-y-auto pr-2">
                  <MarkdownViewer content={generatedMarkdown} />
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-slate-500 space-y-3">
                <div className="w-14 h-14 rounded-3xl bg-slate-800/80 flex items-center justify-center text-slate-400">
                  <BookOpen className="w-7 h-7" />
                </div>
                <h3 className="text-base font-bold text-slate-300">No Notes Generated Yet</h3>
                <p className="text-xs max-w-sm leading-relaxed">
                  Paste your text or upload a document on the left, then click <strong>Generate Smart Notes</strong>.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Export Modal */}
      {showExportModal && (
        <ExportModal
          isOpen={showExportModal}
          onClose={() => setShowExportModal(false)}
          note={{
            id: createdNoteId || 'temp',
            userId: 'usr-demo-999',
            title: generatedTitle || 'AI Study Notes',
            content: generatedMarkdown || '',
            tags: [subject],
            isPinned: false,
            isFavorite: false,
            language,
            style,
            sourceType: 'ai_generator',
            charCount: generatedMarkdown ? generatedMarkdown.length : 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }}
        />
      )}
    </div>
  );
};
