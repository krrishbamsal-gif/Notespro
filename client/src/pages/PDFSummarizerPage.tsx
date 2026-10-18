import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  UploadCloud,
  Sparkles,
  Download,
  BookOpen,
  Layers,
  GraduationCap,
  ArrowRight,
  AlertCircle,
  FileCheck
} from 'lucide-react';
import { api } from '../services/api';
import { useNotes } from '../context/NotesContext';
import { MarkdownViewer } from '../components/common/MarkdownViewer';
import { ExportModal } from '../components/common/ExportModal';

export const PDFSummarizerPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [extractedData, setExtractedData] = useState<{
    text: string;
    numPages: number;
    charCount: number;
    title: string;
  } | null>(null);

  const [length, setLength] = useState<'brief' | 'standard' | 'in-depth'>('standard');
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const [activeView, setActiveView] = useState<'summary' | 'extracted'>('summary');

  const [isProcessing, setIsProcessing] = useState(false);
  const [summaryMarkdown, setSummaryMarkdown] = useState<string | null>(null);
  const [summaryTitle, setSummaryTitle] = useState('');
  const [keyTakeaways, setKeyTakeaways] = useState<string[]>([]);
  const [savedNoteId, setSavedNoteId] = useState<string | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { createNote } = useNotes();
  const navigate = useNavigate();

  const handleFileChange = async (selectedFile: File) => {
    if (!selectedFile) return;
    setFile(selectedFile);
    setIsProcessing(true);
    setErrorMsg(null);
    setSummaryMarkdown(null);

    try {
      const result = await api.extractPdf(selectedFile);
      setExtractedData(result);
      setSummaryTitle(`${result.title} — Executive Summary`);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to extract text from PDF.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSummarize = async () => {
    if (!extractedData) return;
    setIsProcessing(true);
    setErrorMsg(null);

    try {
      const res = await api.summarize({
        content: extractedData.text,
        topic: extractedData.title,
        length,
        language,
      });

      setSummaryMarkdown(res.markdown);
      setKeyTakeaways(res.keyTakeaways || []);

      // Auto save note
      const newNote = createNote({
        userId: 'usr-demo-999',
        title: res.title,
        content: res.markdown,
        subject: 'PDF Summary',
        tags: ['PDF', 'Summary', language === 'hi' ? 'Hindi' : 'English'],
        isPinned: false,
        isFavorite: false,
        language,
        style: 'summary',
        sourceType: 'pdf',
        charCount: res.markdown.length,
        keyTakeaways: res.keyTakeaways,
      });

      setSavedNoteId(newNote.id);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to generate PDF summary.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 text-xs font-semibold mb-2 border border-cyan-500/20">
            <FileText className="w-3.5 h-3.5 text-cyan-400" />
            <span>Document Intelligence</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">PDF Summarizer</h1>
          <p className="text-sm text-slate-400">
            Upload syllabi, research papers, or book chapters to distill high-density summaries & key takeaways.
          </p>
        </div>

        {summaryMarkdown && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowExportModal(true)}
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-4 h-4 text-cyan-400" />
              <span>Export</span>
            </button>
            {savedNoteId && (
              <button
                onClick={() => navigate(`/notes/${savedNoteId}`)}
                className="px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Upload & Options */}
        <div className="lg:col-span-5 space-y-6">
          {/* PDF Drag & Drop Box */}
          <div
            className={`p-8 rounded-3xl border-2 border-dashed transition-all text-center ${
              extractedData
                ? 'border-emerald-500/50 bg-emerald-950/15'
                : 'border-slate-800 hover:border-cyan-500/50 bg-slate-900/40'
            }`}
          >
            {extractedData ? (
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
                  <FileCheck className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white truncate max-w-xs mx-auto">
                    {extractedData.title}.pdf
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">
                    {extractedData.numPages} Page(s) · {extractedData.charCount.toLocaleString()} Characters Extracted
                  </p>
                </div>
                <label className="inline-block mt-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium cursor-pointer transition-colors">
                  <span>Change File</span>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
                    className="hidden"
                  />
                </label>
              </div>
            ) : (
              <div>
                <UploadCloud className="w-12 h-12 text-cyan-400 mx-auto mb-3 animate-bounce" />
                <h4 className="text-sm font-bold text-white mb-1">Drag and drop your PDF here</h4>
                <p className="text-xs text-slate-400 mb-4">Supported formats: .pdf (up to 15MB)</p>
                <label className="inline-block px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold cursor-pointer transition-all shadow-lg shadow-cyan-600/20">
                  <span>Browse PDF</span>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
                    className="hidden"
                  />
                </label>
              </div>
            )}
          </div>

          {/* Configuration Controls */}
          {extractedData && (
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Summary Configuration
              </h3>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                  Summary Density
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['brief', 'standard', 'in-depth'] as const).map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => setLength(lvl)}
                      className={`py-2 px-2 rounded-xl text-xs font-medium capitalize border transition-all ${
                        length === lvl
                          ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                  Summary Language
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setLanguage('en')}
                    className={`py-2 px-3 rounded-xl text-xs font-medium border transition-all ${
                      language === 'en'
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => setLanguage('hi')}
                    className={`py-2 px-3 rounded-xl text-xs font-medium border transition-all ${
                      language === 'hi'
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    हिंदी (Hindi)
                  </button>
                </div>
              </div>

              <button
                onClick={handleSummarize}
                disabled={isProcessing}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-cyan-600/20 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Analyzing PDF Content...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate AI Summary</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Output / Extracted Text Viewer */}
        <div className="lg:col-span-7">
          <div className="rounded-3xl bg-slate-900/60 border border-slate-800 p-6 min-h-[500px] flex flex-col justify-between">
            {extractedData ? (
              <div className="space-y-4">
                {/* View switcher tabs */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setActiveView('summary')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                        activeView === 'summary'
                          ? 'bg-cyan-500/20 text-cyan-300'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      AI Summary Preview
                    </button>
                    <button
                      onClick={() => setActiveView('extracted')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                        activeView === 'extracted'
                          ? 'bg-cyan-500/20 text-cyan-300'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Original Extracted Text
                    </button>
                  </div>

                  {summaryMarkdown && (
                    <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      Auto-Saved to My Notes
                    </span>
                  )}
                </div>

                {activeView === 'summary' ? (
                  summaryMarkdown ? (
                    <div className="max-h-[600px] overflow-y-auto pr-2">
                      <MarkdownViewer content={summaryMarkdown} />
                    </div>
                  ) : (
                    <div className="text-center py-20 text-slate-500 space-y-3">
                      <BookOpen className="w-12 h-12 text-slate-600 mx-auto" />
                      <p className="text-sm font-semibold text-slate-300">Ready to synthesize</p>
                      <p className="text-xs max-w-sm mx-auto">
                        Click "Generate AI Summary" on the left to produce structured takeaways.
                      </p>
                    </div>
                  )
                ) : (
                  <div className="max-h-[600px] overflow-y-auto p-4 rounded-xl bg-slate-950 font-mono text-xs text-slate-300 whitespace-pre-wrap leading-relaxed border border-slate-800">
                    {extractedData.text}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-slate-500 space-y-3">
                <FileText className="w-14 h-14 text-slate-600" />
                <h3 className="text-base font-bold text-slate-300">No PDF Uploaded</h3>
                <p className="text-xs max-w-sm leading-relaxed">
                  Upload a PDF document to view extracted content and generate an intelligent summary.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {showExportModal && summaryMarkdown && (
        <ExportModal
          isOpen={showExportModal}
          onClose={() => setShowExportModal(false)}
          note={{
            id: savedNoteId || 'temp',
            userId: 'usr-demo-999',
            title: summaryTitle,
            content: summaryMarkdown,
            tags: ['PDF', 'Summary'],
            isPinned: false,
            isFavorite: false,
            language,
            style: 'summary',
            sourceType: 'pdf',
            charCount: summaryMarkdown.length,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }}
        />
      )}
    </div>
  );
};
