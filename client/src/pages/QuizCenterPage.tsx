import React, { useState } from 'react';
import {
  GraduationCap,
  Sparkles,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Trophy,
  Clock,
  ArrowRight,
  BookOpen
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useStudy } from '../context/StudyContext';
import { useNotes } from '../context/NotesContext';
import { api } from '../services/api';

export const QuizCenterPage: React.FC = () => {
  const { quizzes, attempts, createQuiz, recordQuizAttempt } = useStudy();
  const { notes } = useNotes();

  const [activeQuizId, setActiveQuizId] = useState<string>(quizzes[0]?.id || '');
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [submittedQuestions, setSubmittedQuestions] = useState<Record<string, boolean>>({});
  const [quizFinished, setQuizFinished] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedNoteId, setSelectedNoteId] = useState(notes[0]?.id || '');
  const [isGenerating, setIsGenerating] = useState(false);

  const activeQuiz = quizzes.find((q) => q.id === activeQuizId) || quizzes[0];
  const questions = activeQuiz?.questions || [];
  const currentQ = questions[currentQIndex];

  const handleSelectOption = (optionIndex: number) => {
    if (!currentQ || submittedQuestions[currentQ.id]) return;
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQ.id]: optionIndex,
    });
  };

  const handleCheckAnswer = () => {
    if (!currentQ || selectedAnswers[currentQ.id] === undefined) return;
    setSubmittedQuestions({
      ...submittedQuestions,
      [currentQ.id]: true,
    });
  };

  const handleNext = () => {
    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex((prev) => prev + 1);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    setQuizFinished(true);

    let score = 0;
    questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctAnswer) {
        score++;
      }
    });

    const percentage = Math.round((score / questions.length) * 100);

    if (activeQuiz) {
      recordQuizAttempt({
        quizId: activeQuiz.id,
        quizTitle: activeQuiz.title,
        score,
        totalQuestions: questions.length,
        percentage,
        userAnswers: selectedAnswers,
      });
    }

    if (percentage >= 70) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQIndex(0);
    setSelectedAnswers({});
    setSubmittedQuestions({});
    setQuizFinished(false);
  };

  const handleGenerateQuiz = async () => {
    const note = notes.find((n) => n.id === selectedNoteId);
    if (!note) return;

    setIsGenerating(true);
    try {
      const res = await api.generateQuiz({
        content: note.content,
        count: 5,
        topic: note.title,
        language: note.language,
      });

      const newQuiz = createQuiz(`${note.title} (Practice Exam)`, note.subject || 'General', res.quiz, note.id);
      setActiveQuizId(newQuiz.id);
      handleRestartQuiz();
      setShowCreateModal(false);
    } catch (err) {
      console.error('Quiz generation failed', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const score = questions.reduce((acc, q) => {
    return acc + (selectedAnswers[q.id] === q.correctAnswer ? 1 : 0);
  }, 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 text-xs font-semibold mb-2 border border-emerald-500/20">
            <GraduationCap className="w-3.5 h-3.5 text-emerald-400" />
            <span>Interactive Assessment & Score Tracking</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Quiz Center</h1>
          <p className="text-sm text-slate-400">
            Verify your mastery with AI-generated test sets and detailed rationales.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-500 hover:from-emerald-500 hover:to-cyan-400 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all flex items-center gap-2 self-start sm:self-auto hover:scale-105 active:scale-95"
        >
          <Sparkles className="w-4 h-4" />
          <span>New AI Quiz</span>
        </button>
      </div>

      {/* Quiz Selection Pills */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2">
        {quizzes.map((quiz) => (
          <button
            key={quiz.id}
            onClick={() => {
              setActiveQuizId(quiz.id);
              handleRestartQuiz();
            }}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border flex items-center gap-2 ${
              activeQuiz?.id === quiz.id
                ? 'bg-emerald-600/20 text-emerald-300 border-emerald-500/50 shadow-md'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            <span>{quiz.title}</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-400">
              {quiz.questions.length} Qs
            </span>
          </button>
        ))}
      </div>

      {questions.length === 0 ? (
        <div className="text-center py-20 rounded-3xl bg-slate-900/40 border border-slate-800 p-8">
          <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white mb-1">No quizzes available</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
            Create your first test set from your saved notes.
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold"
          >
            Generate Quiz
          </button>
        </div>
      ) : quizFinished ? (
        /* Quiz Finished Scoreboard */
        <div className="max-w-2xl mx-auto rounded-3xl bg-slate-900 border border-slate-800 p-8 sm:p-12 text-center space-y-6 animate-in zoom-in-95">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-emerald-500 to-cyan-500 mx-auto flex items-center justify-center text-white shadow-xl shadow-emerald-500/20">
            <Trophy className="w-10 h-10" />
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Quiz Completed!</h2>
            <p className="text-sm text-slate-400 mt-1">{activeQuiz.title}</p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 inline-block">
            <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
              {Math.round((score / questions.length) * 100)}%
            </span>
            <p className="text-xs text-slate-400 mt-2">
              You scored <strong>{score}</strong> out of <strong>{questions.length}</strong> correct.
            </p>
          </div>

          <div className="flex items-center justify-center gap-3">
            <button
              onClick={handleRestartQuiz}
              className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retry Quiz</span>
            </button>
          </div>
        </div>
      ) : currentQ ? (
        /* Active Question Display */
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Progress Header */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs">
            <span className="font-semibold text-slate-300">
              Question {currentQIndex + 1} of {questions.length}
            </span>
            <span className="text-emerald-400 font-mono font-medium">
              Topic: {activeQuiz.topic}
            </span>
          </div>

          {/* Question Box */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-6">
            <h3 className="text-base sm:text-lg font-bold text-white leading-relaxed">
              {currentQ.question}
            </h3>

            {/* Options List */}
            <div className="space-y-3">
              {currentQ.options.map((option, idx) => {
                const isSelected = selectedAnswers[currentQ.id] === idx;
                const isSubmitted = submittedQuestions[currentQ.id];
                const isCorrect = currentQ.correctAnswer === idx;

                let optStyle = 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700';

                if (isSubmitted) {
                  if (isCorrect) {
                    optStyle = 'bg-emerald-950/40 border-emerald-500 text-emerald-200';
                  } else if (isSelected) {
                    optStyle = 'bg-rose-950/40 border-rose-500 text-rose-200';
                  }
                } else if (isSelected) {
                  optStyle = 'bg-purple-600/20 border-purple-500 text-purple-200';
                }

                return (
                  <button
                    key={idx}
                    disabled={isSubmitted}
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center justify-between text-xs sm:text-sm font-medium ${optStyle}`}
                  >
                    <span>{option}</span>
                    {isSubmitted && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 ml-2" />}
                    {isSubmitted && isSelected && !isCorrect && (
                      <XCircle className="w-5 h-5 text-rose-400 flex-shrink-0 ml-2" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation Display */}
            {submittedQuestions[currentQ.id] && (
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 text-xs leading-relaxed space-y-1.5 animate-in fade-in">
                <span className="font-bold text-cyan-300 block">Explanation:</span>
                <p className="text-slate-300">{currentQ.explanation}</p>
              </div>
            )}
          </div>

          {/* Bottom Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setCurrentQIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentQIndex === 0}
              className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white text-xs disabled:opacity-40"
            >
              Previous
            </button>

            {!submittedQuestions[currentQ.id] ? (
              <button
                onClick={handleCheckAnswer}
                disabled={selectedAnswers[currentQ.id] === undefined}
                className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-colors disabled:opacity-40"
              >
                Check Answer
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors flex items-center gap-1.5"
              >
                <span>{currentQIndex === questions.length - 1 ? 'View Final Results' : 'Next Question'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      ) : null}

      {/* Generate Quiz Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-1">Generate Practice Quiz</h3>
            <p className="text-xs text-slate-400 mb-4">
              Select one of your study guides to auto-generate multiple-choice questions with answers & explanations.
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
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleGenerateQuiz}
                disabled={isGenerating}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Synthesizing Exam Questions...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Generate Quiz</span>
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
