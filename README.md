# NotesPro AI — Smart AI Notes Maker 🚀

NotesPro AI is a production-ready, full-stack AI-powered study assistant that transforms PDFs, textbooks, messy lecture transcripts, and raw notes into structured, easy-to-understand study materials, interactive 3D flashcards, and exam preparation quizzes.

Designed with a premium SaaS aesthetic inspired by Notion, Linear, and modern productivity suites, with support for **English** and **Hindi**.

---

## 🌟 Key Features

### 1. 🤖 AI Notes Generator
- **Multi-Input Synthesis:** Paste raw text, lecture transcripts, or upload documents.
- **Smart Note Formats:** Comprehensive Smart Notes, Exam Prep Mode (high-yield questions, MCQs), Cornell 3-Column Notes, and ELI5 (Explain Like I'm 5) intuitive analogies.
- **Bilingual Intelligence:** Instant generation in clear academic English or clean educational Hindi.

### 2. 📄 PDF Summarizer & Text Extraction
- In-memory PDF text extraction using `pdf-parse` (up to 15MB).
- Side-by-side or tabbed view of original extracted document text vs. AI-synthesized summary.
- Density controls (Brief Executive Summary, Standard, or In-Depth Breakdown).

### 3. 🗂️ Interactive 3D Flashcards Center
- Instant active-recall flashcard deck generation from any saved note or topic.
- 3D flipping card animations with full keyboard shortcuts (**Space** to flip, **←** / **→** arrows to navigate).
- Spaced repetition tracking (**Learning 🔴**, **Reviewing 🟡**, **Mastered 🟢**).

### 4. 🎓 Quiz Center & Exam Prep
- Multiple-choice exam drills with question explanations for correct and incorrect options.
- Live score calculation and celebratory confetti animation upon completion.
- Quiz attempt history and retry mechanisms.

### 5. 💬 AI Chat with Document Grounding
- Chat directly with your uploaded notes and textbooks.
- Answers are strictly grounded in document context with citations and takeaways.
- Pre-built starter prompts for fast conceptual querying.

### 6. 📝 Rich Markdown Note Editor
- Split-screen live preview with GitHub-style alert callouts (`[!NOTE]`, `[!IMPORTANT]`, `[!TIP]`).
- Auto-save engine with status indicators.
- Embedded AI Copilot sidebar: "Simplify Concept", "Explain in Hindi", "Generate 5 MCQs", or "Generate Flashcards".

### 7. 📤 Complete Export Options
- **Download as PDF:** Print-ready, professionally styled academic layout.
- **Download as Markdown (.md):** 100% compatible with Obsidian, Notion, GitHub.
- **Download as Plain Text (.txt):** Clean, unformatted text.
- One-click clipboard copy.

### 8. 📅 Study Planner
- Kanban-style task roadmap (**To Study**, **In Progress**, **Completed**).
- Priority badges (Low, Medium, High), due dates, and study streak motivation tracker.

### 9. 🎨 Premium UI/UX & Theming
- Dark & Light mode toggle with ambient purple, cyan, and emerald gradient accents.
- Global command palette search modal (**Ctrl + K** / **Cmd + K**).
- Glassmorphism, smooth animations powered by **Framer Motion**, and **Lucide React** icons.

---

## 🏗️ Architecture & Tech Stack

```
AI NOTE/
├── client/                     # Frontend (React 19 + Vite + TypeScript)
│   ├── src/
│   │   ├── components/         # Reusable UI & Layout Components
│   │   │   ├── common/         # Header, Sidebar, SearchModal, ExportModal, DemoBanner, MarkdownViewer
│   │   │   └── layout/         # AppLayout
│   │   ├── context/            # AuthContext, ThemeContext, NotesContext, StudyContext
│   │   ├── pages/              # Landing, Login, Register, Dashboard, Generator, Summarizer,
│   │   │                       # Notes, Editor, Flashcards, Quiz, Chat, Planner, Settings, Help
│   │   ├── services/           # api.ts (backend client with offline fallback)
│   │   └── types/              # Comprehensive TypeScript interfaces
│   └── tailwind.config.js      # Custom theme, gradients, and 3D perspectives
│
├── server/                     # Backend (Node.js + Express + TypeScript)
│   ├── src/
│   │   ├── routes/             # aiRoutes.ts, pdfRoutes.ts
│   │   ├── services/           # aiService.ts (Google Gemini 2.5 Flash + Demo Engine), pdfService.ts
│   │   └── index.ts            # Server entrypoint with CORS, Multer, Error handlers
│   └── .env.example            # Backend environment template
│
└── database/
    └── schema.sql              # Supabase / PostgreSQL schema with RLS policies & triggers
```

---

## ⚡ Quick Start Guide

### Prerequisites
- Node.js 18+ (tested on Node v24)
- npm 9+

### 1. Start Backend Server
```bash
cd server
npm install
npm run dev
```
The server will start on `http://localhost:5000`.

### 2. Start Frontend Client
In a new terminal:
```bash
cd client
npm install
npm run dev
```
The client will launch on `http://localhost:5173`.

---

## 🔑 AI Key & Configuration

NotesPro AI supports both **Live Cloud AI Mode** and **Smart Demo Mode**:

1. **Smart Demo Mode (Default):**
   - Works immediately out of the box without requiring an API key.
   - Generates realistic, high-quality study materials, flashcards, quizzes, and chat replies.
   - Displays a banner clearly informing users of demo status.

2. **Enabling Live Google Gemini AI:**
   - Get a free Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey).
   - **Option A:** Enter the key in the in-app **Settings & Preferences** page (persisted securely in local storage).
   - **Option B:** Add it to `server/.env`:
     ```env
     PORT=5000
     GEMINI_API_KEY=AIzaSyYourActualKeyHere
     ```
   - Restart the server. The live indicator badge will turn green (`Live AI Active`).

---

## 🗄️ Database Setup (Supabase / PostgreSQL)

A complete database schema migration is included in `database/schema.sql`:
- **Tables:** `profiles`, `notes`, `folders`, `documents`, `flashcard_decks`, `flashcards`, `quizzes`, `quiz_attempts`, `study_tasks`, `user_preferences`.
- **Row Level Security (RLS):** All tables enforce strict tenant isolation so users can only access their own records.
- **Triggers:** Automatic `updated_at` timestamps on row mutation.

To apply:
1. Open your Supabase Dashboard -> **SQL Editor**.
2. Paste the contents of `database/schema.sql` and click **Run**.

---

## 🚀 Production Build

```bash
# Build Client
cd client
npm run build

# Build Server
cd server
npm run build
```

---

## 📜 License
MIT License. Built with ❤️ for students, educators, and lifelong learners worldwide.
