import React, { createContext, useContext, useState, useEffect } from 'react';
import { FlashcardDeck, Flashcard, Quiz, QuizAttempt, StudyTask } from '../types';

interface StudyContextType {
  decks: FlashcardDeck[];
  quizzes: Quiz[];
  attempts: QuizAttempt[];
  tasks: StudyTask[];
  createDeck: (title: string, cards: Omit<Flashcard, 'id' | 'deckId' | 'masteryStatus' | 'timesReviewed'>[], noteId?: string) => FlashcardDeck;
  updateCardMastery: (deckId: string, cardId: string, status: 'learning' | 'reviewing' | 'mastered') => void;
  deleteDeck: (deckId: string) => void;
  createQuiz: (title: string, topic: string, questions: Quiz['questions'], noteId?: string) => Quiz;
  recordQuizAttempt: (attempt: Omit<QuizAttempt, 'id' | 'completedAt'>) => void;
  createTask: (task: Omit<StudyTask, 'id' | 'createdAt'>) => StudyTask;
  updateTaskStatus: (taskId: string, status: StudyTask['status']) => void;
  deleteTask: (taskId: string) => void;
}

const StudyContext = createContext<StudyContextType | undefined>(undefined);

const INITIAL_DECKS: FlashcardDeck[] = [
  {
    id: 'deck-1',
    userId: 'usr-demo-999',
    title: 'Deep Learning & Attention Mechanisms',
    description: 'Key formulas, Q-K-V concepts, and Transformer architecture principles',
    createdAt: new Date().toISOString(),
    cards: [
      {
        id: 'c1',
        deckId: 'deck-1',
        question: 'What is the attention scaling factor in Scaled Dot-Product Attention?',
        answer: '1 / sqrt(d_k), which prevents dot products from growing excessively large and pushing the softmax function into regions with tiny gradients.',
        difficulty: 'medium',
        masteryStatus: 'mastered',
        timesReviewed: 3,
      },
      {
        id: 'c2',
        deckId: 'deck-1',
        question: 'Why are Positional Encodings required in Transformers?',
        answer: 'Because the self-attention operation is permutation-invariant and has no inherent sense of token sequence order.',
        difficulty: 'easy',
        masteryStatus: 'reviewing',
        timesReviewed: 2,
      },
      {
        id: 'c3',
        deckId: 'deck-1',
        question: 'What role does the Query (Q) vector play in attention?',
        answer: 'The Query vector represents the current token actively searching for relevant contextual information across other tokens.',
        difficulty: 'medium',
        masteryStatus: 'learning',
        timesReviewed: 1,
      },
      {
        id: 'c4',
        deckId: 'deck-1',
        question: 'What is the computational complexity of standard self-attention relative to sequence length N?',
        answer: 'O(N^2) quadratic time and memory complexity due to computing all-to-all token dot products.',
        difficulty: 'hard',
        masteryStatus: 'learning',
        timesReviewed: 1,
      }
    ]
  },
  {
    id: 'deck-2',
    userId: 'usr-demo-999',
    title: 'Neurobiology: Action Potentials (NEET/Finals)',
    description: 'Membrane potential, ion channels, and phases of nerve impulse transmission',
    createdAt: new Date().toISOString(),
    cards: [
      {
        id: 'c5',
        deckId: 'deck-2',
        question: 'What is the typical resting membrane potential of a neuron?',
        answer: '-70 mV, maintained predominantly by the Na+/K+ ATPase pump and K+ leak channels.',
        difficulty: 'easy',
        masteryStatus: 'mastered',
        timesReviewed: 4,
      },
      {
        id: 'c6',
        deckId: 'deck-2',
        question: 'Which ion influx drives the rapid depolarization phase of an action potential?',
        answer: 'Rapid influx of Na+ (Sodium) ions through voltage-gated sodium channels opening at threshold (-55 mV).',
        difficulty: 'medium',
        masteryStatus: 'mastered',
        timesReviewed: 3,
      },
      {
        id: 'c7',
        deckId: 'deck-2',
        question: 'What is Saltatory Conduction?',
        answer: 'The rapid jumping of action potentials from one Node of Ranvier to the next along a myelinated axon.',
        difficulty: 'medium',
        masteryStatus: 'reviewing',
        timesReviewed: 2,
      }
    ]
  }
];

const INITIAL_QUIZZES: Quiz[] = [
  {
    id: 'quiz-1',
    userId: 'usr-demo-999',
    title: 'Transformer Architecture Mastery Test',
    topic: 'Artificial Intelligence',
    createdAt: new Date().toISOString(),
    questions: [
      {
        id: 'q1',
        question: 'In Scaled Dot-Product Attention, why is the matrix product QK^T divided by sqrt(d_k)?',
        options: [
          'To reduce dimensionality of vectors',
          'To prevent softmax gradients from becoming extremely small (vanishing gradient)',
          'To enforce causal masking on decoder steps',
          'To convert vectors to unit norm'
        ],
        correctAnswer: 1,
        explanation: 'For large values of d_k, dot products grow large in magnitude, pushing the softmax function into regions with extremely small gradients. Dividing by sqrt(d_k) counteracts this effect.'
      },
      {
        id: 'q2',
        question: 'Which mechanism allows Transformers to process sequences without recurrent connections?',
        options: [
          'Backpropagation through time (BPTT)',
          'Positional Encodings added to input embeddings',
          'Convolutional kernel stride of 2',
          'Hidden Markov States'
        ],
        correctAnswer: 1,
        explanation: 'Because attention contains no recurrence, positional encodings are injected directly into the input embeddings to provide token order information.'
      },
      {
        id: 'q3',
        question: 'What is the primary advantage of Multi-Head Attention over Single-Head Attention?',
        options: [
          'It eliminates the need for feed-forward layers',
          'It jointly attends to information from different representation subspaces at different positions',
          'It reduces the total number of matrix multiplications',
          'It avoids using the softmax activation'
        ],
        correctAnswer: 1,
        explanation: 'Multi-Head Attention gives the model the ability to focus on different types of relations (e.g. syntactic, coreference, thematic) simultaneously.'
      }
    ]
  }
];

const INITIAL_TASKS: StudyTask[] = [
  {
    id: 'task-1',
    userId: 'usr-demo-999',
    title: 'Review Transformer Multi-Head Attention equations',
    description: 'Work through matrix multiplication dimensions and derivations',
    dueDate: new Date(Date.now() + 86400000 * 2).toISOString().slice(0, 10),
    priority: 'high',
    status: 'in_progress',
    subject: 'Artificial Intelligence',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-2',
    userId: 'usr-demo-999',
    title: 'Complete 10 Neurobiology flashcards drill',
    description: 'Focus on sodium-potassium pump ratios and threshold voltages',
    dueDate: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
    priority: 'medium',
    status: 'todo',
    subject: 'Neuroscience',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-3',
    userId: 'usr-demo-999',
    title: 'Summarize Monetary Policy research paper',
    description: 'Extract central bank interest rate transmission mechanisms into smart notes',
    dueDate: new Date(Date.now() - 86400000).toISOString().slice(0, 10),
    priority: 'low',
    status: 'completed',
    subject: 'Economics',
    createdAt: new Date().toISOString(),
  }
];

export const StudyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [decks, setDecks] = useState<FlashcardDeck[]>(() => {
    const saved = localStorage.getItem('notespro_decks');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_DECKS;
      }
    }
    return INITIAL_DECKS;
  });

  const [quizzes, setQuizzes] = useState<Quiz[]>(() => {
    const saved = localStorage.getItem('notespro_quizzes');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_QUIZZES;
      }
    }
    return INITIAL_QUIZZES;
  });

  const [attempts, setAttempts] = useState<QuizAttempt[]>(() => {
    const saved = localStorage.getItem('notespro_attempts');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [];
  });

  const [tasks, setTasks] = useState<StudyTask[]>(() => {
    const saved = localStorage.getItem('notespro_tasks');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_TASKS;
      }
    }
    return INITIAL_TASKS;
  });

  useEffect(() => {
    localStorage.setItem('notespro_decks', JSON.stringify(decks));
  }, [decks]);

  useEffect(() => {
    localStorage.setItem('notespro_quizzes', JSON.stringify(quizzes));
  }, [quizzes]);

  useEffect(() => {
    localStorage.setItem('notespro_attempts', JSON.stringify(attempts));
  }, [attempts]);

  useEffect(() => {
    localStorage.setItem('notespro_tasks', JSON.stringify(tasks));
  }, [tasks]);

  const createDeck = (
    title: string,
    cards: Omit<Flashcard, 'id' | 'deckId' | 'masteryStatus' | 'timesReviewed'>[],
    noteId?: string
  ): FlashcardDeck => {
    const deckId = `deck-${Date.now()}`;
    const newCards: Flashcard[] = cards.map((c, idx) => ({
      ...c,
      id: `card-${Date.now()}-${idx}`,
      deckId,
      masteryStatus: 'learning',
      timesReviewed: 0,
    }));

    const newDeck: FlashcardDeck = {
      id: deckId,
      userId: 'usr-demo-999',
      title,
      noteId,
      cards: newCards,
      createdAt: new Date().toISOString(),
    };

    setDecks((prev) => [newDeck, ...prev]);
    return newDeck;
  };

  const updateCardMastery = (
    deckId: string,
    cardId: string,
    status: 'learning' | 'reviewing' | 'mastered'
  ) => {
    setDecks((prev) =>
      prev.map((deck) => {
        if (deck.id !== deckId) return deck;
        return {
          ...deck,
          cards: deck.cards.map((c) =>
            c.id === cardId
              ? {
                  ...c,
                  masteryStatus: status,
                  timesReviewed: c.timesReviewed + 1,
                  lastReviewedAt: new Date().toISOString(),
                }
              : c
          ),
        };
      })
    );
  };

  const deleteDeck = (deckId: string) => {
    setDecks((prev) => prev.filter((d) => d.id !== deckId));
  };

  const createQuiz = (
    title: string,
    topic: string,
    questions: Quiz['questions'],
    noteId?: string
  ): Quiz => {
    const newQuiz: Quiz = {
      id: `quiz-${Date.now()}`,
      userId: 'usr-demo-999',
      title,
      topic,
      noteId,
      questions,
      createdAt: new Date().toISOString(),
    };
    setQuizzes((prev) => [newQuiz, ...prev]);
    return newQuiz;
  };

  const recordQuizAttempt = (attempt: Omit<QuizAttempt, 'id' | 'completedAt'>) => {
    const newAttempt: QuizAttempt = {
      ...attempt,
      id: `atm-${Date.now()}`,
      completedAt: new Date().toISOString(),
    };
    setAttempts((prev) => [newAttempt, ...prev]);
  };

  const createTask = (task: Omit<StudyTask, 'id' | 'createdAt'>): StudyTask => {
    const newTask: StudyTask = {
      ...task,
      id: `task-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) => [newTask, ...prev]);
    return newTask;
  };

  const updateTaskStatus = (taskId: string, status: StudyTask['status']) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status } : t))
    );
  };

  const deleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  return (
    <StudyContext.Provider
      value={{
        decks,
        quizzes,
        attempts,
        tasks,
        createDeck,
        updateCardMastery,
        deleteDeck,
        createQuiz,
        recordQuizAttempt,
        createTask,
        updateTaskStatus,
        deleteTask,
      }}
    >
      {children}
    </StudyContext.Provider>
  );
};

export const useStudy = () => {
  const context = useContext(StudyContext);
  if (!context) throw new Error('useStudy must be used within a StudyProvider');
  return context;
};
