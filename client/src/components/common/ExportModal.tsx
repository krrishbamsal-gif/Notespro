import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import { Download, FileText, Copy, Check, X, Printer } from 'lucide-react';
import { Note } from '../../types';

interface ExportModalProps {
  note: Note;
  isOpen: boolean;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ note, isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);

  if (!isOpen) return null;

  const handleCopyMarkdown = async () => {
    try {
      await navigator.clipboard.writeText(note.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const handleDownloadMarkdown = () => {
    const blob = new Blob([note.content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${note.title.replace(/[^a-zA-Z0-9_-]/g, '_')}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadTxt = () => {
    const plainText = note.content.replace(/[*_#`[\]()]/g, '');
    const blob = new Blob([plainText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${note.title.replace(/[^a-zA-Z0-9_-]/g, '_')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadPdf = async () => {
    setIsExportingPdf(true);
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: 'a4',
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 40;
      const maxLineWidth = pageWidth - margin * 2;

      // Header Banner
      doc.setFillColor(124, 58, 237);
      doc.rect(0, 0, pageWidth, 24, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(10);
      doc.text('NotesPro AI — Smart Study Notes Guide', margin, 16);

      // Title
      doc.setTextColor(30, 41, 59);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(20);
      const splitTitle = doc.splitTextToSize(note.title, maxLineWidth);
      doc.text(splitTitle, margin, 60);

      // Metadata
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(100, 116, 139);
      doc.text(
        `Subject: ${note.subject || 'General'}  |  Language: ${note.language.toUpperCase()}  |  Date: ${new Date(
          note.updatedAt
        ).toLocaleDateString()}`,
        margin,
        90
      );

      // Separator Line
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(1);
      doc.line(margin, 105, pageWidth - margin, 105);

      // Body text
      doc.setTextColor(51, 65, 85);
      doc.setFontSize(11);
      
      const cleanContent = note.content
        .replace(/^#+\s+/gm, '')
        .replace(/\*\*(.*?)\*\*/g, '$1')
        .replace(/`([^`]+)`/g, '$1');

      const splitBody = doc.splitTextToSize(cleanContent, maxLineWidth);

      let cursorY = 125;
      const pageHeight = doc.internal.pageSize.getHeight();

      for (let i = 0; i < splitBody.length; i++) {
        if (cursorY > pageHeight - 50) {
          doc.addPage();
          cursorY = 50;
        }
        doc.text(splitBody[i], margin, cursorY);
        cursorY += 15;
      }

      // Save PDF
      doc.save(`${note.title.replace(/[^a-zA-Z0-9_-]/g, '_')}.pdf`);
    } catch (err) {
      console.error('PDF export failed:', err);
      // Fallback to browser print dialog
      window.print();
    } finally {
      setIsExportingPdf(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div
        className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-9 h-9 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center">
            <Download className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Export Study Note</h3>
            <p className="text-xs text-slate-400 truncate max-w-xs">{note.title}</p>
          </div>
        </div>

        <div className="space-y-3 my-6">
          {/* PDF Export */}
          <button
            onClick={handleDownloadPdf}
            disabled={isExportingPdf}
            className="w-full flex items-center justify-between p-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 hover:border-purple-500/50 transition-all group text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center font-bold text-xs">
                PDF
              </div>
              <div>
                <p className="text-sm font-semibold text-white group-hover:text-purple-300">
                  {isExportingPdf ? 'Generating PDF...' : 'Download as PDF'}
                </p>
                <p className="text-xs text-slate-400">Formatted study sheet ready for printing</p>
              </div>
            </div>
            <Printer className="w-4 h-4 text-slate-500 group-hover:text-purple-400" />
          </button>

          {/* Markdown (.md) */}
          <button
            onClick={handleDownloadMarkdown}
            className="w-full flex items-center justify-between p-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 hover:border-purple-500/50 transition-all group text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold text-xs">
                MD
              </div>
              <div>
                <p className="text-sm font-semibold text-white group-hover:text-purple-300">
                  Download as Markdown
                </p>
                <p className="text-xs text-slate-400">Compatible with Obsidian, Notion, GitHub</p>
              </div>
            </div>
            <FileText className="w-4 h-4 text-slate-500 group-hover:text-purple-400" />
          </button>

          {/* Plain Text (.txt) */}
          <button
            onClick={handleDownloadTxt}
            className="w-full flex items-center justify-between p-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 hover:border-purple-500/50 transition-all group text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold text-xs">
                TXT
              </div>
              <div>
                <p className="text-sm font-semibold text-white group-hover:text-cyan-300">
                  Download as Plain Text
                </p>
                <p className="text-xs text-slate-400">Lightweight raw text document</p>
              </div>
            </div>
            <FileText className="w-4 h-4 text-slate-500 group-hover:text-cyan-400" />
          </button>
        </div>

        {/* Copy to Clipboard */}
        <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={handleCopyMarkdown}
            className="flex items-center gap-2 text-xs text-slate-300 hover:text-white transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-purple-400" />}
            <span>{copied ? 'Copied to Clipboard!' : 'Copy raw markdown'}</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
