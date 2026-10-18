import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Layers,
  Search,
  Grid,
  List,
  Pin,
  Star,
  Trash2,
  Download,
  Plus,
  Clock,
  Filter,
  Folder as FolderIcon
} from 'lucide-react';
import { useNotes } from '../context/NotesContext';
import { ExportModal } from '../components/common/ExportModal';
import { Note } from '../types';

export const MyNotesPage: React.FC = () => {
  const { notes, folders, activeFolderId, setActiveFolderId, togglePin, toggleFavorite, deleteNote } = useNotes();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [search, setSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [filterFavorites, setFilterFavorites] = useState(false);
  const [filterPinned, setFilterPinned] = useState(false);
  const [exportNote, setExportNote] = useState<Note | null>(null);

  const navigate = useNavigate();

  // Extract all unique tags
  const allTags = Array.from(new Set(notes.flatMap((n) => n.tags || [])));

  // Filter notes
  const filteredNotes = notes.filter((n) => {
    if (activeFolderId && n.folderId !== activeFolderId) return false;
    if (filterFavorites && !n.isFavorite) return false;
    if (filterPinned && !n.isPinned) return false;
    if (selectedTag && !n.tags.includes(selectedTag)) return false;

    if (search.trim()) {
      const q = search.toLowerCase();
      const matchTitle = n.title.toLowerCase().includes(q);
      const matchContent = n.content.toLowerCase().includes(q);
      const matchSubject = n.subject?.toLowerCase().includes(q);
      const matchTags = n.tags.some((t) => t.toLowerCase().includes(q));
      if (!matchTitle && !matchContent && !matchSubject && !matchTags) return false;
    }

    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">My Study Notes</h1>
          <p className="text-sm text-slate-400">
            Manage, organize, export, and search through your synthesized notes library.
          </p>
        </div>

        <button
          onClick={() => navigate('/notes/new')}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 transition-all flex items-center gap-1.5 self-start sm:self-auto hover:scale-105 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>New Note</span>
        </button>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search notes by title, topic, or keyword..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 placeholder-slate-500 text-xs focus:outline-none focus:border-purple-500/60"
          />
        </div>

        {/* Filter Pills & View Mode */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setFilterPinned(!filterPinned)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition-colors ${
              filterPinned
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            <Pin className="w-3.5 h-3.5" />
            <span>Pinned</span>
          </button>

          <button
            onClick={() => setFilterFavorites(!filterFavorites)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition-colors ${
              filterFavorites
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            <Star className="w-3.5 h-3.5 fill-current" />
            <span>Favorites</span>
          </button>

          <div className="h-6 w-px bg-slate-800 mx-1 hidden sm:block" />

          {/* View Mode Toggle */}
          <div className="flex p-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-400">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded transition-colors ${
                viewMode === 'grid' ? 'bg-purple-600/30 text-purple-300' : 'hover:text-white'
              }`}
              title="Grid View"
            >
              <Grid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded transition-colors ${
                viewMode === 'list' ? 'bg-purple-600/30 text-purple-300' : 'hover:text-white'
              }`}
              title="List View"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Tags Filter Row */}
      {allTags.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="text-slate-500 flex items-center gap-1 flex-shrink-0">
            <Filter className="w-3 h-3" /> Tags:
          </span>
          <button
            onClick={() => setSelectedTag(null)}
            className={`px-2.5 py-1 rounded-full whitespace-nowrap transition-colors ${
              selectedTag === null
                ? 'bg-purple-600 text-white font-medium'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            All
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
              className={`px-2.5 py-1 rounded-full whitespace-nowrap transition-colors ${
                selectedTag === tag
                  ? 'bg-purple-600 text-white font-medium'
                  : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>
      )}

      {/* Notes Display */}
      {filteredNotes.length === 0 ? (
        <div className="text-center py-20 rounded-3xl bg-slate-900/40 border border-slate-800/80 p-8">
          <Layers className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white mb-1">No notes match your filter</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
            Try clearing the search query or generate new smart notes from lecture text.
          </p>
          <button
            onClick={() => navigate('/generate')}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold"
          >
            Generate AI Note
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotes.map((note) => (
            <div
              key={note.id}
              onClick={() => navigate(`/notes/${note.id}`)}
              className="glass-card p-6 rounded-3xl cursor-pointer transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300">
                    {note.subject || 'General'}
                  </span>

                  <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => togglePin(note.id)}
                      className={`p-1.5 rounded-lg hover:bg-white/10 transition-colors ${
                        note.isPinned ? 'text-amber-400' : 'text-slate-600 hover:text-slate-300'
                      }`}
                      title={note.isPinned ? 'Unpin' : 'Pin'}
                    >
                      <Pin className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => toggleFavorite(note.id)}
                      className={`p-1.5 rounded-lg hover:bg-white/10 transition-colors ${
                        note.isFavorite ? 'text-rose-400' : 'text-slate-600 hover:text-slate-300'
                      }`}
                      title="Favorite"
                    >
                      <Star className="w-3.5 h-3.5 fill-current" />
                    </button>
                  </div>
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors line-clamp-2 mb-2">
                  {note.title}
                </h3>

                <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed mb-4">
                  {note.content.replace(/[#*`[\]()]/g, '').slice(0, 160)}...
                </p>

                {note.tags.length > 0 && (
                  <div className="flex items-center gap-1.5 flex-wrap mb-4">
                    {note.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="text-[10px] px-2 py-0.5 rounded bg-slate-900 text-slate-400 font-mono">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{new Date(note.updatedAt).toLocaleDateString()}</span>
                </div>

                <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => setExportNote(note)}
                    className="p-1 rounded text-slate-400 hover:text-white"
                    title="Export"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this note?')) {
                        deleteNote(note.id);
                      }
                    }}
                    className="p-1 rounded text-slate-500 hover:text-rose-400"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List View */
        <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden divide-y divide-slate-800/80">
          {filteredNotes.map((note) => (
            <div
              key={note.id}
              onClick={() => navigate(`/notes/${note.id}`)}
              className="p-4 flex items-center justify-between gap-4 hover:bg-slate-800/50 cursor-pointer transition-colors group"
            >
              <div className="flex items-center gap-3.5 flex-1 truncate">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(note.id);
                  }}
                  className={`p-1 rounded ${
                    note.isFavorite ? 'text-rose-400' : 'text-slate-600 hover:text-slate-400'
                  }`}
                >
                  <Star className="w-4 h-4 fill-current" />
                </button>

                <div className="truncate">
                  <h4 className="text-sm font-semibold text-white group-hover:text-purple-300 truncate">
                    {note.title}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                    <span className="font-medium text-slate-400">{note.subject || 'General'}</span>
                    <span>·</span>
                    <span>{new Date(note.updatedAt).toLocaleDateString()}</span>
                    <span>·</span>
                    <span>{note.charCount.toLocaleString()} chars</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => setExportNote(note)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                  title="Export"
                >
                  <Download className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    if (confirm('Delete this note?')) deleteNote(note.id);
                  }}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {exportNote && (
        <ExportModal
          isOpen={Boolean(exportNote)}
          onClose={() => setExportNote(null)}
          note={exportNote}
        />
      )}
    </div>
  );
};
