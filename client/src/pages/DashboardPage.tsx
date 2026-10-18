import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  FileText,
  Layers,
  GraduationCap,
  CalendarCheck,
  TrendingUp,
  Clock,
  Pin,
  Star,
  ArrowRight,
  Flame,
  Plus
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotes } from '../context/NotesContext';
import { useStudy } from '../context/StudyContext';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { notes, togglePin, toggleFavorite } = useNotes();
  const { decks, quizzes, tasks } = useStudy();
  const navigate = useNavigate();

  const totalCards = decks.reduce((acc, d) => acc + d.cards.length, 0);
  const masteredCards = decks.reduce(
    (acc, d) => acc + d.cards.filter((c) => c.masteryStatus === 'mastered').length,
    0
  );

  const pendingTasks = tasks.filter((t) => t.status !== 'completed');

  const recentNotes = [...notes]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 4);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Welcome Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden p-6 sm:p-8 bg-gradient-to-r from-purple-900/60 via-indigo-900/40 to-slate-900 border border-purple-500/30 shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-semibold border border-purple-500/30">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>5 Day Study Streak Active! 🔥</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Welcome back, {user?.fullName?.split(' ')[0] || 'Scholar'} 👋
            </h1>
            <p className="text-sm text-slate-300 max-w-xl">
              Ready to learn? Transform documents into smart structured notes, run active recall flashcard drills, or generate exam practice tests.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <Link
              to="/generate"
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs sm:text-sm shadow-xl shadow-purple-600/30 transition-all flex items-center gap-2 hover:scale-105 active:scale-95"
            >
              <Sparkles className="w-4 h-4" />
              <span>Generate AI Notes</span>
            </Link>

            <Link
              to="/pdf-summarizer"
              className="px-5 py-3 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 font-semibold text-xs sm:text-sm border border-slate-700/80 hover:border-purple-500/40 transition-all flex items-center gap-2"
            >
              <FileText className="w-4 h-4 text-cyan-400" />
              <span>Summarize PDF</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="glass-card p-5 rounded-2xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-400">Total Notes</span>
            <div className="w-8 h-8 rounded-xl bg-purple-500/15 text-purple-400 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white">{notes.length}</div>
          <p className="text-[11px] text-purple-400 mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> Persistent & searchable
          </p>
        </div>

        <div className="glass-card p-5 rounded-2xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-400">Flashcards Mastered</span>
            <div className="w-8 h-8 rounded-xl bg-cyan-500/15 text-cyan-400 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white">
            {masteredCards} <span className="text-xs text-slate-500 font-normal">/ {totalCards}</span>
          </div>
          <p className="text-[11px] text-cyan-400 mt-1">
            {totalCards > 0 ? Math.round((masteredCards / totalCards) * 100) : 0}% mastery score
          </p>
        </div>

        <div className="glass-card p-5 rounded-2xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-400">Quizzes Available</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
              <GraduationCap className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white">{quizzes.length}</div>
          <p className="text-[11px] text-emerald-400 mt-1">Interactive exam drills</p>
        </div>

        <div className="glass-card p-5 rounded-2xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-400">Pending Tasks</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center">
              <CalendarCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white">{pendingTasks.length}</div>
          <p className="text-[11px] text-amber-400 mt-1">Next due in 24 hours</p>
        </div>
      </div>

      {/* Main Content Layout: Left 2 Cols (Recent Notes), Right 1 Col (Study Planner + Quick Drills) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Recent Notes */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">Recent Study Notes</h2>
              <p className="text-xs text-slate-400">Jump back into your synthesis and revision sheets</p>
            </div>
            <Link
              to="/notes"
              className="text-xs text-purple-400 hover:text-purple-300 font-medium flex items-center gap-1 group"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {recentNotes.map((note) => (
              <div
                key={note.id}
                onClick={() => navigate(`/notes/${note.id}`)}
                className="glass-card p-5 rounded-2xl cursor-pointer transition-all duration-200 hover:-translate-y-1 relative group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300">
                      {note.subject || 'Study Guide'}
                    </span>
                    <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => togglePin(note.id)}
                        className={`p-1 rounded hover:bg-white/10 transition-colors ${
                          note.isPinned ? 'text-amber-400' : 'text-slate-600 hover:text-slate-400'
                        }`}
                        title="Pin note"
                      >
                        <Pin className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => toggleFavorite(note.id)}
                        className={`p-1 rounded hover:bg-white/10 transition-colors ${
                          note.isFavorite ? 'text-rose-400' : 'text-slate-600 hover:text-slate-400'
                        }`}
                        title="Favorite"
                      >
                        <Star className="w-3.5 h-3.5 fill-current" />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors line-clamp-2 mb-2">
                    {note.title}
                  </h3>

                  <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed mb-4">
                    {note.content.replace(/[#*`[\]()]/g, '').slice(0, 160)}...
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-[11px] text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3 h-3" />
                    <span>{new Date(note.updatedAt).toLocaleDateString()}</span>
                  </div>
                  <span className="font-mono">{note.language.toUpperCase()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Upcoming Tasks & Flashcard Quick Drill */}
        <div className="space-y-6">
          {/* Study Planner preview */}
          <div className="glass-card p-5 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CalendarCheck className="w-4 h-4 text-purple-400" />
                <h3 className="text-sm font-bold text-white">Study Planner</h3>
              </div>
              <Link to="/planner" className="text-xs text-purple-400 hover:underline">
                View Board
              </Link>
            </div>

            <div className="space-y-2.5">
              {pendingTasks.slice(0, 3).map((task) => (
                <div
                  key={task.id}
                  className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/80 flex items-start justify-between gap-3"
                >
                  <div className="truncate">
                    <p className="text-xs font-semibold text-slate-200 truncate">{task.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-[10px] px-1.5 py-0.2 rounded font-medium ${
                        task.priority === 'high' ? 'bg-rose-500/20 text-rose-300' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {task.priority}
                      </span>
                      {task.dueDate && (
                        <span className="text-[10px] text-slate-500">Due {task.dueDate}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Flashcard Quick Launch */}
          <div className="rounded-2xl p-5 bg-gradient-to-br from-indigo-950/60 to-purple-950/60 border border-indigo-500/30 text-white relative overflow-hidden">
            <div className="relative z-10 space-y-3">
              <div className="flex items-center gap-2 text-cyan-300 text-xs font-semibold">
                <Layers className="w-4 h-4" />
                <span>Daily Active Recall Drill</span>
              </div>
              <h4 className="text-base font-bold">Ready for a 2-minute memory sprint?</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Test yourself on key formulas and definitions before your exam.
              </p>
              <button
                onClick={() => navigate('/flashcards')}
                className="w-full py-2.5 rounded-xl bg-white text-slate-950 font-bold text-xs hover:bg-purple-100 transition-colors shadow-lg"
              >
                Start Flashcard Session
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
