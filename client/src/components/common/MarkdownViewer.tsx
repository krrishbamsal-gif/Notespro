import React, { useMemo } from 'react';
import { marked } from 'marked';

interface MarkdownViewerProps {
  content: string;
  className?: string;
}

export const MarkdownViewer: React.FC<MarkdownViewerProps> = ({ content, className = '' }) => {
  const renderedHtml = useMemo(() => {
    if (!content) return '';

    // Convert GitHub alert syntax into styled callout blocks
    let processed = content
      .replace(/>\s*\[!NOTE\]\s*\n((?:>.*\n?)*)/gi, (_m, inner) => {
        const cleaned = inner.replace(/^>\s?/gm, '');
        return `<div class="my-4 p-4 rounded-xl bg-purple-950/40 border border-purple-500/30 text-purple-200">
          <div class="font-semibold text-purple-400 flex items-center gap-1.5 mb-1 text-sm">💡 NOTE</div>
          <div class="text-sm leading-relaxed">${cleaned}</div>
        </div>\n`;
      })
      .replace(/>\s*\[!IMPORTANT\]\s*\n((?:>.*\n?)*)/gi, (_m, inner) => {
        const cleaned = inner.replace(/^>\s?/gm, '');
        return `<div class="my-4 p-4 rounded-xl bg-amber-950/40 border border-amber-500/30 text-amber-200">
          <div class="font-semibold text-amber-400 flex items-center gap-1.5 mb-1 text-sm">⚠️ IMPORTANT</div>
          <div class="text-sm leading-relaxed">${cleaned}</div>
        </div>\n`;
      })
      .replace(/>\s*\[!TIP\]\s*\n((?:>.*\n?)*)/gi, (_m, inner) => {
        const cleaned = inner.replace(/^>\s?/gm, '');
        return `<div class="my-4 p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-200">
          <div class="font-semibold text-emerald-400 flex items-center gap-1.5 mb-1 text-sm">✨ PRO TIP</div>
          <div class="text-sm leading-relaxed">${cleaned}</div>
        </div>\n`;
      });

    return marked.parse(processed, {
      breaks: true,
      gfm: true,
    }) as string;
  }, [content]);

  return (
    <div
      className={`prose prose-invert max-w-none 
        prose-headings:font-bold prose-headings:tracking-tight
        prose-h1:text-2xl sm:prose-h1:text-3xl prose-h1:text-white prose-h1:border-b prose-h1:border-slate-800 prose-h1:pb-3 prose-h1:mb-6
        prose-h2:text-xl sm:prose-h2:text-2xl prose-h2:text-purple-300 prose-h2:mt-8 prose-h2:mb-4
        prose-h3:text-lg sm:prose-h3:text-xl prose-h3:text-cyan-300 prose-h3:mt-6 prose-h3:mb-3
        prose-p:text-slate-300 prose-p:leading-relaxed prose-p:mb-4
        prose-strong:text-white prose-strong:font-semibold
        prose-ul:list-disc prose-ul:pl-6 prose-ul:my-4 prose-li:my-1.5 prose-li:text-slate-300
        prose-ol:list-decimal prose-ol:pl-6 prose-ol:my-4 prose-li:my-1.5 prose-li:text-slate-300
        prose-blockquote:border-l-4 prose-blockquote:border-purple-500 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-slate-400
        prose-code:text-purple-300 prose-code:bg-slate-900/80 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:text-sm prose-code:font-mono
        prose-pre:bg-slate-900/90 prose-pre:border prose-pre:border-slate-800 prose-pre:rounded-xl prose-pre:p-4
        prose-hr:border-slate-800 prose-hr:my-8
        prose-table:w-full prose-table:border-collapse prose-table:my-4
        prose-th:border prose-th:border-slate-800 prose-th:bg-slate-900 prose-th:p-2.5 prose-th:text-left prose-th:text-white
        prose-td:border prose-td:border-slate-800 prose-td:p-2.5 prose-td:text-slate-300
        ${className}
      `}
      dangerouslySetInnerHTML={{ __html: renderedHtml }}
    />
  );
};
