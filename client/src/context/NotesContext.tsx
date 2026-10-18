import React, { createContext, useContext, useState, useEffect } from 'react';
import { Note, Folder } from '../types';

interface NotesContextType {
  notes: Note[];
  folders: Folder[];
  activeFolderId: string | null;
  searchQuery: string;
  setActiveFolderId: (id: string | null) => void;
  setSearchQuery: (query: string) => void;
  createNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => Note;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  togglePin: (id: string) => void;
  toggleFavorite: (id: string) => void;
  createFolder: (name: string, color?: string) => Folder;
  deleteFolder: (id: string) => void;
  getNoteById: (id: string) => Note | undefined;
}

const NotesContext = createContext<NotesContextType | undefined>(undefined);

const INITIAL_FOLDERS: Folder[] = [
  { id: 'fld-1', userId: 'usr-demo-999', name: 'Computer Science', color: '#8b5cf6', icon: 'code' },
  { id: 'fld-2', userId: 'usr-demo-999', name: 'Neuroscience & Biology', color: '#06b6d4', icon: 'dna' },
  { id: 'fld-3', userId: 'usr-demo-999', name: 'Economics & Markets', color: '#10b981', icon: 'trending-up' },
];

const INITIAL_NOTES: Note[] = [
  {
    id: 'note-1',
    userId: 'usr-demo-999',
    folderId: 'fld-1',
    title: 'Transformer Architecture & Self-Attention Mechanisms',
    subject: 'Artificial Intelligence',
    tags: ['AI', 'Transformers', 'Deep Learning', 'Attention'],
    isPinned: true,
    isFavorite: true,
    language: 'en',
    style: 'smart',
    sourceType: 'ai_generator',
    charCount: 2450,
    keyTakeaways: [
      'Self-attention computes dynamic weights connecting every token pair in parallel.',
      'Scaled dot-product attention divides dot product by sqrt(d_k) to prevent vanishing gradients.',
      'Positional encodings provide sequence order without recurrence or convolutions.'
    ],
    content: `# Transformer Architecture & Self-Attention Mechanisms

> [!NOTE]
> Published in the foundational paper *"Attention Is All You Need"* (Vaswani et al., 2017), the Transformer completely replaced recurrent and convolutional networks in modern Natural Language Processing and Foundation Models.

---

## 🎯 Executive Summary
The Transformer architecture eliminates recurrence, relying exclusively on **multi-head self-attention mechanisms** to model global dependencies between input and output tokens. This enables massively parallelized training on GPUs and superior long-range semantic representation.

---

## 🧠 Core Terminology & Definitions
- **Query (Q):** Vector representing the current token seeking relevant context.
- **Key (K):** Vector representing candidate tokens offering context.
- **Value (V):** Vector containing the actual informational payload of each token.
- **Scale Factor ($\\sqrt{d_k}$):** Normalization factor to keep softmax gradients from saturating at extreme values.

---

## 📐 Attention Formula
The fundamental Scaled Dot-Product Attention equation is defined as:

$$\\text{Attention}(Q, K, V) = \\text{softmax}\\left(\\frac{QK^T}{\\sqrt{d_k}}\\right)V$$

### Why Multi-Head Attention?
Multi-Head Attention projects Queries, Keys, and Values $h$ times into distinct representation subspaces:
1. One head may track grammatical dependencies (subject-verb agreement).
2. Another head tracks spatial or temporal relationships.
3. Another head attends to direct coreferences (pronoun targets).

---

## 📌 Key Takeaways
- Self-attention operates in $O(1)$ sequential operations per layer, enabling 100x training speedups over LSTMs.
- Positional encodings (sinusoidal or learned) are mandatory because attention is inherently permutation-invariant.
- Feed-forward networks (FFNs) apply non-linear transformations independently to each position.`,
    createdAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: 'note-2',
    userId: 'usr-demo-999',
    folderId: 'fld-2',
    title: 'Action Potential & Synaptic Transmission (तंत्रिका आवेग)',
    subject: 'Neurobiology',
    tags: ['Biology', 'Neuroscience', 'Exams'],
    isPinned: false,
    isFavorite: true,
    language: 'hi',
    style: 'exam',
    sourceType: 'pdf',
    charCount: 1980,
    keyTakeaways: [
      'विश्राम विभव (Resting Potential) लगभग -70 mV पर सोडियम-पोटेशियम पंप द्वारा स्थिर रहता है।',
      'डीपोलराइजेशन (Depolarization) में वोल्टेज-गेटेड सोडियम चैनल तेजी से खुलते हैं।',
      'साइनैप्टिक क्लेफ्ट में न्यूरोट्रांसमीटर (जैसे एसिटिलकोलीन) रासायनिक संकेत प्रसारित करते हैं।'
    ],
    content: `# तंत्रिका आवेग एवं सिनेप्टिक संचरण (Action Potential)

> [!IMPORTANT]
> यह विषय मेडिकल और जीव विज्ञान परीक्षाओं (NEET / University Finals) में लगातार 5-अंक और 10-अंक वाले प्रश्नों में पूछा जाता है।

---

## ⚡ 1. विश्राम कला विभव (Resting Membrane Potential)
तंत्रिका कोशिका (Neuron) की झिल्ली सामान्य अवस्था में भीतर से ऋणात्मक ($-70\\text{ mV}$) होती है:
- **सोडियम-पोटेशियम पंप ($Na^+/K^+$ ATPase):** $3 Na^+$ आयनों को बाहर फेंकता है और $2 K^+$ आयनों को अंदर लाता है।
- **अभेद्यता (Permeability):** झिल्ली $K^+$ आयनों के लिए अधिक पारगम्य होती है।

---

## 📈 2. क्रिया विभव के चरण (Phases of Action Potential)
1. **थ्रेसहोल्ड उत्तेजना (Threshold Stimulus):** विभव $-55\\text{ mV}$ तक पहुंचता है (All-or-None Principle)।
2. **विध्रुवण (Depolarization):** 
   - वोल्टेज-सेंसिटिव $Na^+$ चैनल खुलते हैं।
   - $Na^+$ कोशिका के अंदर तेजी से प्रवेश करता है (विभव $+30\\text{ mV}$ तक)।
3. **पुनर्ध्रुवण (Repolarization):**
   - $Na^+$ चैनल निष्क्रिय हो जाते हैं।
   - $K^+$ चैनल खुलते हैं और $K^+$ बाहर निकलता है।
4. **अतिध्रुवण (Hyperpolarization):**
   - विभव $-90\\text{ mV}$ तक गिर जाता है, फिर पंप द्वारा सामान्य होता है।

---

## 🎯 परीक्षा पुनरावृत्ति सूत्र (Quick Formula)
- **$Na^+$ अंदर** = डिपोलराइजेशन (उत्तेजना)
- **$K^+$ बाहर** = रिपोलराइजेशन (शांति)
- **माइलिन आवरण (Myelin Sheath)** = सॉल्टेटरी कंडक्शन (Saltatory Conduction) जो गति को 10x बढ़ाता है।`,
    createdAt: new Date(Date.now() - 3600000 * 24 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
  {
    id: 'note-3',
    userId: 'usr-demo-999',
    folderId: 'fld-3',
    title: 'Monetary Policy, Inflation & Central Bank Rates',
    subject: 'Macroeconomics',
    tags: ['Economics', 'Finance', 'Inflation', 'Federal Reserve'],
    isPinned: false,
    isFavorite: false,
    language: 'en',
    style: 'summary',
    sourceType: 'manual',
    charCount: 1650,
    keyTakeaways: [
      'Central banks increase benchmark interest rates to cool aggregate demand during high inflation.',
      'Quantitative Tightening (QT) reduces the central bank balance sheet and absorbs liquidity.',
      'The Phillips Curve illustrates the short-run inverse trade-off between unemployment and inflation.'
    ],
    content: `# Monetary Policy, Inflation & Central Bank Rates

## 🏦 Overview
Central banks (e.g., The Federal Reserve, RBI, ECB) wield monetary policy to maintain price stability, promote maximum sustainable employment, and moderate long-term interest rates.

---

## 🛠️ The 3 Primary Central Bank Tools
1. **Policy Interest Rate (Repo / Fed Funds Rate):**
   - Raising rates makes borrowing expensive for commercial banks and consumers.
   - Dampens consumer spending, business capital expenditures, and asset inflation.
2. **Open Market Operations (OMO):**
   - Purchasing government bonds injects cash (Quantitative Easing).
   - Selling bonds withdraws liquidity from commercial banking systems (Quantitative Tightening).
3. **Reserve Requirements:**
   - The statutory percentage of deposits that banks must retain in vault cash or at the central bank.

---

## 📊 Inflation Transmission Mechanism
$$\\text{Rate Hike} \\longrightarrow \\text{Higher Loan Costs} \\longrightarrow \\downarrow \\text{Demand} \\longrightarrow \\downarrow \\text{Price Growth}$$`,
    createdAt: new Date(Date.now() - 3600000 * 24 * 7).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 48).toISOString(),
  }
];

export const NotesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notes, setNotes] = useState<Note[]>(() => {
    const saved = localStorage.getItem('notespro_notes');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_NOTES;
      }
    }
    return INITIAL_NOTES;
  });

  const [folders, setFolders] = useState<Folder[]>(() => {
    const saved = localStorage.getItem('notespro_folders');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_FOLDERS;
      }
    }
    return INITIAL_FOLDERS;
  });

  const [activeFolderId, setActiveFolderId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    localStorage.setItem('notespro_notes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem('notespro_folders', JSON.stringify(folders));
  }, [folders]);

  const createNote = (newNoteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>): Note => {
    const newNote: Note = {
      ...newNoteData,
      id: `note-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setNotes((prev) => [newNote, ...prev]);
    return newNote;
  };

  const updateNote = (id: string, updates: Partial<Note>) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, ...updates, updatedAt: new Date().toISOString() } : n))
    );
  };

  const deleteNote = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  const togglePin = (id: string) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isPinned: !n.isPinned, updatedAt: new Date().toISOString() } : n))
    );
  };

  const toggleFavorite = (id: string) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isFavorite: !n.isFavorite, updatedAt: new Date().toISOString() } : n))
    );
  };

  const createFolder = (name: string, color = '#8b5cf6'): Folder => {
    const newFolder: Folder = {
      id: `fld-${Date.now()}`,
      userId: 'usr-demo-999',
      name,
      color,
      icon: 'folder',
    };
    setFolders((prev) => [...prev, newFolder]);
    return newFolder;
  };

  const deleteFolder = (id: string) => {
    setFolders((prev) => prev.filter((f) => f.id !== id));
    // Move notes inside to uncategorized
    setNotes((prev) =>
      prev.map((n) => (n.folderId === id ? { ...n, folderId: undefined } : n))
    );
  };

  const getNoteById = (id: string) => {
    return notes.find((n) => n.id === id);
  };

  return (
    <NotesContext.Provider
      value={{
        notes,
        folders,
        activeFolderId,
        searchQuery,
        setActiveFolderId,
        setSearchQuery,
        createNote,
        updateNote,
        deleteNote,
        togglePin,
        toggleFavorite,
        createFolder,
        deleteFolder,
        getNoteById,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
};

export const useNotes = () => {
  const context = useContext(NotesContext);
  if (!context) throw new Error('useNotes must be used within a NotesProvider');
  return context;
};
