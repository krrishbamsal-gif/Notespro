import React, { useState, useEffect } from 'react';
import {
  Layers,
  Sparkles,
  RotateCcw,
  Check,
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  BookOpen,
  Volume2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useStudy } from '../context/StudyContext';
import { useNotes } from '../context/NotesContext';
import { api } from '../services/api';

export const FlashcardsPage: React.FC = () => {
  const { decks, updateCardMastery, createDeck, deleteDeck } = useStudy();
  const { notes } = useNotes();

  const [activeDeckId, setActiveDeckId] = useState<string>(decks[0]?.id || '');
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [selectedNoteId, setSelectedNoteId] = useState<string>(notes[0]?.id || '');
  const [isGenerating, setIsGenerating] = useState(false);

  const activeDeck = decks.find((d) => d.id === activeDeckId) || decks[0];
  const cards = activeDeck?.cards || [];
  const currentCard = cards[currentCardIndex];

  // Reset card state when deck changes
  useEffect(() => {
    setCurrentCardIndex(0);
    setIsFlipped(false);
  }, [activeDeckId]);

  // Keyboard shortcut listener (Space to flip, Left/Right for Next/Prev)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.code === 'Space') {
        e.preventDefault();
        setIsFlipped((prev) => !prev);
      } else if (e.code === 'ArrowRight' && currentCardIndex < cards.length - 1) {
        setIsFlipped(false);
        setCurrentCardIndex((prev) => prev + 1);
      } else if (e.code === 'ArrowLeft' && currentCardIndex > 0) {
        setIsFlipped(false);
        setCurrentCardIndex((prev) => prev - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentCardIndex, cards.length]);

  const handleRateCard = (status: 'learning' | 'reviewing' | 'mastered') => {
    if (!activeDeck || !currentCard) return;

    updateCardMastery(activeDeck.id, currentCard.id, status);

    if (status === 'mastered') {
      confetti({
        particleCount: 25,
        spread: 40,
        origin: { y: 0.8 },
      });
    }

    if (currentCardIndex < cards.length - 1) {
      setIsFlipped(false);
      setCurrentCardIndex((prev) => prev + 1);
    }
  };

  const handleGenerateFromNote = async () => {
    const note = notes.find((n) => n.id === selectedNoteId);
    if (!note) return;

    setIsGenerating(true);
    try {
      const res = await api.generateFlashcards({
        content: note.content,
        count: 8,
        topic: note.title,
        language: note.language,
      });

      const newDeck = createDeck(`${note.title} (Flashcards)`, res.flashcards, note.id);
      setActiveDeckId(newDeck.id);
      setShowGenerateModal(false);
    } catch (err) {
      console.error('Failed to generate flashcards', err);
    } finally {
      setIsGenerating(false);
    }
  };

  // Stats calculation
  const masteredCount = cards.filter((c) => c.masteryStatus === 'mastered').length;
  const reviewingCount = cards.filter((c) => c.masteryStatus === 'reviewing').length;
  const learningCount = cards.filter((c) => c.masteryStatus === 'learning').length;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 text-xs font-semibold mb-2 border border-cyan-500/20">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>Spaced Repetition & Active Recall</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Flashcards Center</h1>
          <p className="text-sm text-slate-400">
            Train your long-term memory with interactive 3D flip card drills.
          </p>
        </div>

        <button
          onClick={() => setShowGenerateModal(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-bold text-xs shadow-lg shadow-purple-600/30 transition-all flex items-center gap-2 self-start sm:self-auto hover:scale-105 active:scale-95"
        >
          <Sparkles className="w-4 h-4" />
          <span>Generate Deck with AI</span>
        </button>
      </div>

      {/* Deck Selector Tabs */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2">
        {decks.map((deck) => (
          <button
            key={deck.id}
            onClick={() => setActiveDeckId(deck.id)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border flex items-center gap-2 ${
              activeDeck?.id === deck.id
                ? 'bg-purple-600/20 text-purple-300 border-purple-500/50 shadow-md'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            <span>{deck.title}</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-400">
              {deck.cards.length}
            </span>
          </button>
        ))}
      </div>

      {cards.length === 0 ? (
        <div className="text-center py-20 rounded-3xl bg-slate-900/40 border border-slate-800 p-8">
          <Layers className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white mb-1">No cards in this deck</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
            Generate flashcards automatically from your saved study notes.
          </p>
          <button
            onClick={() => setShowGenerateModal(true)}
            className="px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-semibold"
          >
            Generate Cards
          </button>
        </div>
      ) : (
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Progress Bar & Counters */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
            <div>
              <span className="text-slate-400 font-medium">Card Progress: </span>
              <span className="font-bold text-white font-mono">
                {currentCardIndex + 1} / {cards.length}
              </span>
            </div>

            <div className="flex items-center gap-4 text-xs font-medium">
              <span className="text-rose-400">🔴 Learning: {learningCount}</span>
              <span className="text-amber-400">🟡 Reviewing: {reviewingCount}</span>
              <span className="text-emerald-400">🟢 Mastered: {masteredCount}</span>
            </div>
          </div>

          {/* Interactive 3D Flip Flashcard */}
          <div className="perspective-1000 w-full min-h-[340px]">
            <div
              onClick={() => setIsFlipped(!isFlipped)}
              className={`relative w-full min-h-[340px] rounded-3xl transition-transform duration-500 cursor-pointer transform-style-preserve-3d shadow-2xl ${
                isFlipped ? 'rotate-y-180' : ''
              }`}
            >
              {/* Front of Card (Question) */}
              <div className="absolute inset-0 backface-hidden p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 flex flex-col justify-between hover:border-purple-500/40 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300">
                    Question · {currentCard.topic || 'Core Concept'}
                  </span>
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    <span>Press Space to Flip</span>
                  </span>
                </div>

                <div className="my-auto py-6">
                  <p className="text-xl sm:text-2xl font-bold text-white leading-relaxed text-center">
                    {currentCard.question}
                  </p>
                </div>

                <div className="text-center text-xs text-purple-400 font-medium">
                  Click card to reveal answer ↻
                </div>
              </div>

              {/* Back of Card (Answer) */}
              <div className="absolute inset-0 backface-hidden rotate-y-180 p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-purple-950/60 to-slate-950 border border-purple-500/40 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                    Answer & Explanation
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    Difficulty: {currentCard.difficulty}
                  </span>
                </div>

                <div className="my-auto py-6">
                  <p className="text-lg sm:text-xl text-slate-200 leading-relaxed text-center font-medium">
                    {currentCard.answer}
                  </p>
                </div>

                <div className="text-center text-xs text-slate-400">
                  How well did you know this?
                </div>
              </div>
            </div>
          </div>

          {/* Rating & Navigation Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (currentCardIndex > 0) {
                    setIsFlipped(false);
                    setCurrentCardIndex((prev) => prev - 1);
                  }
                }}
                disabled={currentCardIndex === 0}
                className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-40"
                title="Previous card (Left Arrow)"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                onClick={() => setIsFlipped(!isFlipped)}
                className="px-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-200 hover:text-white"
              >
                <RotateCcw className="w-4 h-4 inline mr-1.5" />
                <span>Flip Card</span>
              </button>

              <button
                onClick={() => {
                  if (currentCardIndex < cards.length - 1) {
                    setIsFlipped(false);
                    setCurrentCardIndex((prev) => prev + 1);
                  }
                }}
                disabled={currentCardIndex === cards.length - 1}
                className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-40"
                title="Next card (Right Arrow)"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Active Recall Scoring */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => handleRateCard('learning')}
                className="flex-1 sm:flex-none px-4 py-3 rounded-2xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 text-xs font-bold transition-colors"
              >
                Hard / Learning
              </button>
              <button
                onClick={() => handleRateCard('reviewing')}
                className="flex-1 sm:flex-none px-4 py-3 rounded-2xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 text-xs font-bold transition-colors"
              >
                Good / Review
              </button>
              <button
                onClick={() => handleRateCard('mastered')}
                className="flex-1 sm:flex-none px-5 py-3 rounded-2xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Mastered</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Generate Deck Modal */}
      {showGenerateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-1">Generate Flashcard Deck</h3>
            <p className="text-xs text-slate-400 mb-4">
              Select one of your existing study notes to synthesize question-answer active recall pairs.
            </p>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Select Study Note
                </label>
                <select
                  value={selectedNoteId}
                  onChange={(e) => setSelectedNoteId(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none"
                >
                  {notes.map((n) => (
                    <option key={n.id} value={n.id}>
                      {n.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setShowGenerateModal(false)}
                className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleGenerateFromNote}
                disabled={isGenerating}
                className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1.5 disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Generating Cards...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Generate Deck</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
