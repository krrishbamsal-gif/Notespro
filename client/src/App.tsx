import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { NotesProvider } from './context/NotesContext';
import { StudyProvider } from './context/StudyContext';

import { AppLayout } from './components/layout/AppLayout';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { AINotesGeneratorPage } from './pages/AINotesGeneratorPage';
import { PDFSummarizerPage } from './pages/PDFSummarizerPage';
import { MyNotesPage } from './pages/MyNotesPage';
import { NoteEditorPage } from './pages/NoteEditorPage';
import { FlashcardsPage } from './pages/FlashcardsPage';
import { QuizCenterPage } from './pages/QuizCenterPage';
import { AIChatPage } from './pages/AIChatPage';
import { StudyPlannerPage } from './pages/StudyPlannerPage';
import { SettingsPage } from './pages/SettingsPage';
import { HelpPage } from './pages/HelpPage';

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NotesProvider>
          <StudyProvider>
            <BrowserRouter>
              <Routes>
                {/* Public Marketing and Authentication Routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Authenticated Dashboard Experience */}
                <Route element={<AppLayout />}>
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/generate" element={<AINotesGeneratorPage />} />
                  <Route path="/pdf-summarizer" element={<PDFSummarizerPage />} />
                  <Route path="/notes" element={<MyNotesPage />} />
                  <Route path="/notes/:id" element={<NoteEditorPage />} />
                  <Route path="/flashcards" element={<FlashcardsPage />} />
                  <Route path="/quiz" element={<QuizCenterPage />} />
                  <Route path="/chat" element={<AIChatPage />} />
                  <Route path="/planner" element={<StudyPlannerPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                  <Route path="/help" element={<HelpPage />} />
                </Route>

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </BrowserRouter>
          </StudyProvider>
        </NotesProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
