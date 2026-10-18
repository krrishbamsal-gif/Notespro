import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Sparkles,
  FileText,
  Layers,
  GraduationCap,
  MessageSquare,
  CalendarCheck,
  Settings,
  HelpCircle,
  FolderPlus,
  Pin,
  ChevronDown,
  Folder as FolderIcon,
  X
} from 'lucide-react';
import { useNotes } from '../../context/NotesContext';

interface SidebarProps {
  isOpen: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { notes, folders, activeFolderId, setActiveFolderId, createFolder } = useNotes();
  const [newFolderInput, setNewFolderInput] = useState(false);
  const [folderName, setFolderName] = useState('');
  const [foldersExpanded, setFoldersExpanded] = useState(true);

  const pinnedNotes = notes.filter((n) => n.isPinned);

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/generate', label: 'AI Notes Generator', icon: Sparkles, badge: 'AI' },
    { to: '/pdf-summarizer', label: 'PDF Summarizer', icon: FileText },
    { to: '/notes', label: 'My Notes', icon: Layers, count: notes.length },
    { to: '/flashcards', label: 'Flashcards', icon: Layers },
    { to: '/quiz', label: 'Quiz Center', icon: GraduationCap },
    { to: '/chat', label: 'AI Chat with Notes', icon: MessageSquare },
    { to: '/planner', label: 'Study Planner', icon: CalendarCheck },
  ];

  const bottomItems = [
    { to: '/settings', label: 'Settings & API Key', icon: Settings },
    { to: '/help', label: 'Help & Docs', icon: HelpCircle },
  ];

  const handleAddFolder = (e: React.FormEvent) => {
    e.preventDefault();
    if (folderName.trim()) {
      createFolder(folderName.trim());
      setFolderName('');
      setNewFolderInput(false);
    }
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-30 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed md:sticky top-0 left-0 h-screen w-64 bg-slate-950 border-r border-slate-800/80 z-40 flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Logo and close button */}
        <div className="h-16 px-5 border-b border-slate-800/80 flex items-center justify-between">
          <NavLink to="/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-purple-600/30 group-hover:scale-105 transition-transform">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-base bg-gradient-to-r from-white via-slate-100 to-purple-200 bg-clip-text text-transparent">
                NotesPro
              </span>
              <span className="ml-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                AI
              </span>
            </div>
          </NavLink>

          {onClose && (
            <button
              onClick={onClose}
              className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Scrollable Navigation */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {/* Main Links */}
          <div className="space-y-1">
            <p className="px-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Study Tools
            </p>
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all group ${
                      isActive
                        ? 'bg-purple-600/15 text-purple-300 border border-purple-500/30 font-semibold'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80'
                    }`
                  }
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 transition-colors group-hover:text-purple-400" />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      {item.badge}
                    </span>
                  )}
                  {item.count !== undefined && (
                    <span className="text-[11px] text-slate-500 px-1.5 py-0.5 rounded bg-slate-900">
                      {item.count}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </div>

          {/* Folders Section */}
          <div className="space-y-1">
            <div className="flex items-center justify-between px-3 mb-1">
              <button
                onClick={() => setFoldersExpanded(!foldersExpanded)}
                className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 uppercase tracking-wider hover:text-slate-300"
              >
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform ${
                    foldersExpanded ? '' : '-rotate-90'
                  }`}
                />
                <span>Folders</span>
              </button>
              <button
                onClick={() => setNewFolderInput(!newFolderInput)}
                className="p-1 text-slate-400 hover:text-purple-300 rounded hover:bg-slate-900 transition-colors"
                title="Create Folder"
              >
                <FolderPlus className="w-3.5 h-3.5" />
              </button>
            </div>

            {newFolderInput && (
              <form onSubmit={handleAddFolder} className="px-3 mb-2">
                <input
                  type="text"
                  placeholder="Folder name..."
                  value={folderName}
                  onChange={(e) => setFolderName(e.target.value)}
                  autoFocus
                  className="w-full text-xs px-2.5 py-1.5 rounded-lg bg-slate-900 border border-purple-500/40 text-slate-200 focus:outline-none"
                />
              </form>
            )}

            {foldersExpanded && (
              <div className="space-y-0.5">
                <button
                  onClick={() => setActiveFolderId(null)}
                  className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs transition-colors ${
                    activeFolderId === null
                      ? 'text-purple-300 font-medium bg-purple-500/10'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <FolderIcon className="w-3.5 h-3.5 text-slate-500" />
                    <span>All Notes</span>
                  </div>
                  <span className="text-[10px] text-slate-500">{notes.length}</span>
                </button>

                {folders.map((folder) => {
                  const count = notes.filter((n) => n.folderId === folder.id).length;
                  const isActive = activeFolderId === folder.id;
                  return (
                    <button
                      key={folder.id}
                      onClick={() => setActiveFolderId(folder.id)}
                      className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs transition-colors ${
                        isActive
                          ? 'text-purple-300 font-medium bg-purple-500/10'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span
                          className="w-2 h-2 rounded-full flex-shrink-0"
                          style={{ backgroundColor: folder.color }}
                        />
                        <span className="truncate">{folder.name}</span>
                      </div>
                      <span className="text-[10px] text-slate-500">{count}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Pinned Notes shortcut */}
          {pinnedNotes.length > 0 && (
            <div className="space-y-1">
              <p className="px-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Pin className="w-3 h-3 text-amber-400" />
                <span>Pinned Notes</span>
              </p>
              <div className="space-y-0.5">
                {pinnedNotes.map((note) => (
                  <NavLink
                    key={note.id}
                    to={`/notes/${note.id}`}
                    onClick={onClose}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-900 truncate"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    <span className="truncate">{note.title}</span>
                  </NavLink>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bottom items */}
        <div className="p-3 border-t border-slate-800/80 space-y-1">
          {bottomItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-purple-600/15 text-purple-300 font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      </aside>
    </>
  );
};
