import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  Sparkles,
  Send,
  BookOpen,
  Copy,
  Check,
  Bot,
  User,
  HelpCircle
} from 'lucide-react';
import { useNotes } from '../context/NotesContext';
import { api } from '../services/api';
import { MarkdownViewer } from '../components/common/MarkdownViewer';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const AIChatPage: React.FC = () => {
  const { notes } = useNotes();
  const [selectedNoteId, setSelectedNoteId] = useState<string>(notes[0]?.id || '');
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const selectedNote = notes.find((n) => n.id === selectedNoteId) || notes[0];

  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `Hello! I am your NotesPro AI Study Assistant. I am currently grounded on your note: **"${selectedNote?.title || 'General Notes'}"**.\n\nAsk me anything: to explain a complex equation, summarize section 2, create sample questions, or find definitions!`,
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || isLoading) return;

    const userMsg: Message = { role: 'user', content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await api.chatWithNotes({
        context: selectedNote ? selectedNote.content : '',
        history: messages,
        message: text,
        language: selectedNote?.language || 'en',
      });

      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: response.reply },
      ]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: `Sorry, I encountered an error: ${err.message}` },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (content: string, idx: number) => {
    navigator.clipboard.writeText(content);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const starterPrompts = [
    'What is the central theorem or governing principle in this note?',
    'Give me a real-world analogy to remember this easily.',
    'What are the 3 most likely exam questions from this document?',
    'Summarize this into 3 concise bullet points in simple terms.',
  ];

  return (
    <div className="h-[calc(100vh-5rem)] flex flex-col space-y-4 animate-in fade-in">
      {/* Header with Note Grounding Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 text-purple-300 text-xs font-semibold mb-1 border border-purple-500/20">
            <MessageSquare className="w-3.5 h-3.5 text-purple-400" />
            <span>Grounded Academic Assistant</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white">AI Chat with Notes</h1>
        </div>

        {/* Note selector */}
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-purple-400" />
          <span className="text-xs text-slate-400">Context:</span>
          <select
            value={selectedNoteId}
            onChange={(e) => {
              setSelectedNoteId(e.target.value);
              const note = notes.find((n) => n.id === e.target.value);
              setMessages([
                {
                  role: 'assistant',
                  content: `Switched context to **"${note?.title || 'Selected Note'}"**. How can I assist with this material?`,
                },
              ]);
            }}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none max-w-xs truncate"
          >
            {notes.map((n) => (
              <option key={n.id} value={n.id}>
                {n.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Messages Thread Container */}
      <div className="flex-1 overflow-y-auto space-y-4 p-4 rounded-3xl bg-slate-950/60 border border-slate-800/80">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex gap-3 max-w-3xl ${
              msg.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
            }`}
          >
            {/* Avatar */}
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-white text-xs font-bold ${
                msg.role === 'user'
                  ? 'bg-gradient-to-tr from-purple-600 to-indigo-600'
                  : 'bg-gradient-to-tr from-cyan-600 to-blue-600'
              }`}
            >
              {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            {/* Bubble */}
            <div
              className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed relative group ${
                msg.role === 'user'
                  ? 'bg-purple-600 text-white'
                  : 'bg-slate-900 border border-slate-800 text-slate-200'
              }`}
            >
              <MarkdownViewer content={msg.content} />

              {msg.role === 'assistant' && (
                <button
                  onClick={() => handleCopy(msg.content, idx)}
                  className="absolute top-2 right-2 p-1 rounded hover:bg-white/10 text-slate-500 hover:text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Copy response"
                >
                  {copiedIdx === idx ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3 max-w-xl mr-auto">
            <div className="w-8 h-8 rounded-xl bg-cyan-600 flex items-center justify-center text-white flex-shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-2 text-xs text-slate-400">
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" />
              <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce delay-100" />
              <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce delay-200" />
              <span>Analyzing document context...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Starter Prompts */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-slate-500 flex items-center gap-1 flex-shrink-0">
          <Sparkles className="w-3 h-3 text-purple-400" /> Starters:
        </span>
        {starterPrompts.map((prompt, i) => (
          <button
            key={i}
            onClick={() => handleSend(prompt)}
            className="px-3 py-1.5 rounded-full bg-slate-900 hover:bg-purple-950/40 text-slate-300 border border-slate-800 hover:border-purple-500/30 whitespace-nowrap transition-colors"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Bar */}
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder={`Ask anything about "${selectedNote?.title || 'your note'}"...`}
          className="flex-1 p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-purple-500/60"
        />
        <button
          onClick={() => handleSend()}
          disabled={!inputMessage.trim() || isLoading}
          className="p-3.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold transition-all disabled:opacity-40"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
