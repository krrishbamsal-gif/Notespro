import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, FileText, Layers, GraduationCap, X, ArrowRight } from 'lucide-react';
import { useNotes } from '../../context/NotesContext';
import { useStudy } from '../../context/StudyContext';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const { notes } = useNotes();
  const { decks, quizzes } = useStudy();
  const navigate = useNavigate();

  // Listen for Ctrl+K or Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.toLowerCase().trim();

  const filteredNotes = q
    ? notes.filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          n.content.toLowerCase().includes(q) ||
          n.tags.some((t) => t.toLowerCase().includes(q)) ||
          (n.subject && n.subject.toLowerCase().includes(q))
      )
    : notes.slice(0, 4);

  const filteredDecks = q
    ? decks.filter((d) => d.title.toLowerCase().includes(q) || (d.description && d.description.toLowerCase().includes(q)))
    : decks.slice(0, 2);

  const filteredQuizzes = q
    ? quizzes.filter((qz) => qz.title.toLowerCase().includes(q) || qz.topic.toLowerCase().includes(q))
    : quizzes.slice(0, 2);

  const handleSelectNote = (id: string) => {
    onClose();
    navigate(`/notes/${id}`);
  };

  const handleSelectDeck = () => {
    onClose();
    navigate('/flashcards');
  };

  const handleSelectQuiz = () => {
    onClose();
    navigate('/quiz');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div
        className="w-full max-w-2xl rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-800">
          <Search className="w-5 h-5 text-purple-400 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search notes, formulas, concepts, flashcards..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full bg-transparent text-white placeholder-slate-500 text-sm sm:text-base focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Notes Section */}
          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-purple-400" />
              <span>Notes ({filteredNotes.length})</span>
            </h4>
            {filteredNotes.length === 0 ? (
              <p className="text-xs text-slate-500 pl-2">No matching notes found.</p>
            ) : (
              <div className="space-y-1">
                {filteredNotes.map((note) => (
                  <button
                    key={note.id}
                    onClick={() => handleSelectNote(note.id)}
                    className="w-full text-left p-2.5 rounded-xl hover:bg-slate-800/80 border border-transparent hover:border-slate-700/60 transition-all flex items-center justify-between group"
                  >
                    <div className="truncate mr-3">
                      <p className="text-sm font-medium text-slate-200 group-hover:text-purple-300 truncate">
                        {note.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        {note.subject && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                            {note.subject}
                          </span>
                        )}
                        <span className="text-[10px] text-slate-500">
                          {new Date(note.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Flashcards Section */}
          {filteredDecks.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                <span>Flashcard Decks ({filteredDecks.length})</span>
              </h4>
              <div className="space-y-1">
                {filteredDecks.map((deck) => (
                  <button
                    key={deck.id}
                    onClick={handleSelectDeck}
                    className="w-full text-left p-2.5 rounded-xl hover:bg-slate-800/80 border border-transparent hover:border-slate-700/60 transition-all flex items-center justify-between group"
                  >
                    <div className="truncate mr-3">
                      <p className="text-sm font-medium text-slate-200 group-hover:text-cyan-300 truncate">
                        {deck.title}
                      </p>
                      <p className="text-xs text-slate-500 truncate mt-0.5">
                        {deck.cards.length} cards · {deck.description || 'Active recall drill'}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quizzes Section */}
          {filteredQuizzes.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-emerald-400" />
                <span>Quizzes ({filteredQuizzes.length})</span>
              </h4>
              <div className="space-y-1">
                {filteredQuizzes.map((qz) => (
                  <button
                    key={qz.id}
                    onClick={handleSelectQuiz}
                    className="w-full text-left p-2.5 rounded-xl hover:bg-slate-800/80 border border-transparent hover:border-slate-700/60 transition-all flex items-center justify-between group"
                  >
                    <div className="truncate mr-3">
                      <p className="text-sm font-medium text-slate-200 group-hover:text-emerald-300 truncate">
                        {qz.title}
                      </p>
                      <p className="text-xs text-slate-500 truncate mt-0.5">
                        {qz.questions.length} questions · Topic: {qz.topic}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer shortcuts info */}
        <div className="px-4 py-2.5 border-t border-slate-800 bg-slate-950/60 text-xs text-slate-500 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span>Navigation: <kbd className="bg-slate-800 px-1 rounded text-[10px]">↑</kbd> <kbd className="bg-slate-800 px-1 rounded text-[10px]">↓</kbd></span>
            <span>Close: <kbd className="bg-slate-800 px-1.5 rounded text-[10px]">Esc</kbd></span>
          </div>
          <span>NotesPro AI Search Engine</span>
        </div>
      </div>
    </div>
  );
};
