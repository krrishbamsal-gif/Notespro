export interface Note {
  id: string;
  userId: string;
  folderId?: string;
  title: string;
  content: string; // Markdown text
  summary?: string;
  subject?: string;
  tags: string[];
  isPinned: boolean;
  isFavorite: boolean;
  language: 'en' | 'hi';
  style: 'smart' | 'exam' | 'simplified' | 'summary' | 'cornell';
  sourceType: 'manual' | 'pdf' | 'transcript' | 'ai_generator';
  charCount: number;
  keyTakeaways?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Folder {
  id: string;
  userId: string;
  name: string;
  color: string;
  icon?: string;
  noteCount?: number;
}

export interface Flashcard {
  id: string;
  deckId: string;
  question: string;
  answer: string;
  topic?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  masteryStatus: 'learning' | 'reviewing' | 'mastered';
  timesReviewed: number;
  lastReviewedAt?: string;
}

export interface FlashcardDeck {
  id: string;
  userId: string;
  noteId?: string;
  title: string;
  description?: string;
  cards: Flashcard[];
  createdAt: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface Quiz {
  id: string;
  userId: string;
  noteId?: string;
  title: string;
  topic: string;
  questions: QuizQuestion[];
  createdAt: string;
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  quizTitle: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  userAnswers: Record<string, number>;
  completedAt: string;
}

export interface StudyTask {
  id: string;
  userId: string;
  noteId?: string;
  title: string;
  description?: string;
  dueDate?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'in_progress' | 'completed';
  subject?: string;
  createdAt: string;
}

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  targetExam?: string;
  preferredLanguage: 'en' | 'hi';
  theme: 'dark' | 'light';
  customApiKey?: string;
}

export interface AIServiceStatus {
  isConfigured: boolean;
  model: string;
  mode: 'live' | 'demo';
  message: string;
}
