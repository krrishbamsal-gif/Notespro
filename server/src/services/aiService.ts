import { GoogleGenAI } from '@google/genai';

export interface NoteGenerationOptions {
  content: string;
  topic?: string;
  style?: 'smart' | 'exam' | 'simplified' | 'summary' | 'cornell';
  language?: 'en' | 'hi';
  apiKey?: string;
}

export interface FlashcardItem {
  question: string;
  answer: string;
  topic?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

// Get client either from request-provided key or environment variable
function getGeminiClient(customApiKey?: string): GoogleGenAI | null {
  const key = customApiKey || process.env.GEMINI_API_KEY;
  if (!key || key.trim() === '' || key === 'YOUR_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({ apiKey: key.trim() });
}

export class AIService {
  static isConfigured(customApiKey?: string): boolean {
    const key = customApiKey || process.env.GEMINI_API_KEY;
    return Boolean(key && key.trim() !== '' && key !== 'YOUR_GEMINI_API_KEY');
  }

  /**
   * Generates comprehensive structured study notes.
   */
  static async generateNotes(options: NoteGenerationOptions): Promise<{
    markdown: string;
    isDemo: boolean;
    title: string;
    keyTakeaways: string[];
  }> {
    const { content, topic = 'General Study Material', style = 'smart', language = 'en', apiKey } = options;
    const ai = getGeminiClient(apiKey);

    if (!ai) {
      return this.generateMockNotes(content, topic, style, language);
    }

    const langInstruction = language === 'hi' 
      ? 'Output the notes in clean, educational Hindi (with English technical terms in parentheses where helpful).'
      : 'Output the notes in clear, academic English.';

    const styleInstructions: Record<string, string> = {
      smart: 'Create comprehensive structured notes with: Title, Executive Summary, Key Definitions, Core Principles, Detailed Sections with bullet points and bold concepts, Real-world Examples, and Key Takeaways.',
      exam: 'Focus on high-yield exam preparation: Key Concepts, Most Probable Questions, Memory Mnemonics, Formulae/Rules, Quick Revision Points, and Common Pitfalls to Avoid.',
      simplified: 'Explain in an ultra-intuitive "Explain Like I\'m 5 / Beginner Friendly" style: Analogies, relatable real-world metaphors, simple language, and breakdown of difficult jargon.',
      summary: 'Provide a concise, high-density executive summary with top 5 takeaways, critical bullet points, and core summary paragraph.',
      cornell: 'Format in Cornell Notes style: Cue Column (Questions/Keywords), Note-Taking Area (Detailed Notes), and Bottom Summary.'
    };

    const prompt = `You are NotesPro AI, a world-class academic study assistant and subject matter expert.
Generate high-quality, beautifully formatted Markdown study notes based on the following input material.

Input Material:
"""
${content.slice(0, 15000)}
"""

Topic / Context: ${topic}
Style: ${styleInstructions[style] || styleInstructions.smart}
Language Requirement: ${langInstruction}

Formatting Guidelines:
- Use clean Markdown with # Heading 1, ## Heading 2, ### Heading 3.
- Use bold text for key terminology.
- Use bullet points and callouts (> Note: ...) for important points.
- Include a "📌 Key Takeaways" section at the end.
- Give a descriptive top-level title.

Respond ONLY with the Markdown content.`;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
      });

      const markdown = response.text || '';
      const titleMatch = markdown.match(/^#\s+(.+)$/m);
      const title = titleMatch ? titleMatch[1].replace(/[*_#]/g, '').trim() : topic;
      
      const takeaways: string[] = [];
      const lines = markdown.split('\n');
      let recordingTakeaways = false;
      for (const line of lines) {
        if (line.includes('Key Takeaway') || line.includes('मुख्य बिंदु')) {
          recordingTakeaways = true;
          continue;
        }
        if (recordingTakeaways && (line.startsWith('- ') || line.startsWith('* '))) {
          takeaways.push(line.replace(/^[-*]\s+/, '').trim());
          if (takeaways.length >= 5) break;
        }
      }

      return {
        markdown,
        isDemo: false,
        title,
        keyTakeaways: takeaways.length > 0 ? takeaways : [
          'Core foundational concepts extracted and synthesized',
          'Structured hierarchy for rapid retention and recall',
          'Essential terminology clearly defined'
        ],
      };
    } catch (error: any) {
      console.warn('Live Gemini API call failed, falling back to smart demo generator:', error.message);
      return this.generateMockNotes(content, topic, style, language);
    }
  }

  /**
   * Generates interactive flashcards from text.
   */
  static async generateFlashcards(
    content: string,
    count: number = 8,
    topic: string = 'General',
    language: 'en' | 'hi' = 'en',
    apiKey?: string
  ): Promise<{ flashcards: FlashcardItem[]; isDemo: boolean }> {
    const ai = getGeminiClient(apiKey);
    if (!ai) {
      return { flashcards: this.generateMockFlashcards(content, count, topic, language), isDemo: true };
    }

    const langInstruction = language === 'hi' ? 'in Hindi (Devanagari script)' : 'in English';

    const prompt = `You are an expert educator. Extract exactly ${count} high-yield flashcard Q&A pairs from the content below ${langInstruction}.
Content:
"""
${content.slice(0, 10000)}
"""

Return ONLY a valid JSON array matching this TypeScript interface without markdown wrappers or other commentary:
[
  {
    "question": "string (clear, active-recall question)",
    "answer": "string (concise, precise answer)",
    "topic": "string (subtopic name)",
    "difficulty": "easy" | "medium" | "hard"
  }
]`;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const text = response.text?.trim() || '[]';
      const cleanJson = text.replace(/^```json\s*|\s*```$/g, '');
      const parsed = JSON.parse(cleanJson);
      return { flashcards: parsed, isDemo: false };
    } catch (error: any) {
      console.warn('Gemini flashcard call failed, falling back to mock:', error.message);
      return { flashcards: this.generateMockFlashcards(content, count, topic, language), isDemo: true };
    }
  }

  /**
   * Generates multiple-choice quiz questions with answers and explanations.
   */
  static async generateQuiz(
    content: string,
    count: number = 5,
    topic: string = 'General',
    language: 'en' | 'hi' = 'en',
    apiKey?: string
  ): Promise<{ quiz: QuizQuestion[]; isDemo: boolean }> {
    const ai = getGeminiClient(apiKey);
    if (!ai) {
      return { quiz: this.generateMockQuiz(content, count, topic, language), isDemo: true };
    }

    const langInstruction = language === 'hi' ? 'in Hindi' : 'in English';

    const prompt = `You are a test preparation specialist. Create ${count} rigorous multiple-choice questions based on this content ${langInstruction}.
Content:
"""
${content.slice(0, 10000)}
"""

Return ONLY a valid JSON array without markdown formatting:
[
  {
    "id": "q1",
    "question": "string",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": 0, // integer index (0, 1, 2, or 3) indicating the correct option
    "explanation": "string explaining why this option is correct and why other options are wrong"
  }
]`;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const text = response.text?.trim() || '[]';
      const cleanJson = text.replace(/^```json\s*|\s*```$/g, '');
      const parsed = JSON.parse(cleanJson);
      return { quiz: parsed, isDemo: false };
    } catch (error: any) {
      console.warn('Gemini quiz call failed, falling back to mock:', error.message);
      return { quiz: this.generateMockQuiz(content, count, topic, language), isDemo: true };
    }
  }

  /**
   * Grounded Chat with Document or Notes.
   */
  static async chatWithDocument(
    contextText: string,
    history: ChatMessage[],
    userMessage: string,
    language: 'en' | 'hi' = 'en',
    apiKey?: string
  ): Promise<{ reply: string; isDemo: boolean }> {
    const ai = getGeminiClient(apiKey);
    if (!ai) {
      return {
        reply: this.generateMockChatReply(contextText, userMessage, language),
        isDemo: true,
      };
    }

    const systemPrompt = `You are NotesPro AI Assistant. You answer questions specifically and accurately grounded in the user's provided document notes below.
If the answer is found in the text, cite the relevant point or quote it.
If the question is not covered in the context, politely clarify that while providing helpful academic guidance.
Respond in ${language === 'hi' ? 'Hindi' : 'English'}.

DOCUMENT CONTEXT:
"""
${contextText.slice(0, 12000)}
"""`;

    try {
      const messagesPrompt = history
        .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
        .join('\n\n');

      const fullPrompt = `${systemPrompt}\n\nCONVERSATION HISTORY:\n${messagesPrompt}\n\nUSER: ${userMessage}\n\nASSISTANT:`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: fullPrompt,
      });

      return {
        reply: response.text || 'I could not generate an answer at this moment.',
        isDemo: false,
      };
    } catch (error: any) {
      return {
        reply: this.generateMockChatReply(contextText, userMessage, language),
        isDemo: true,
      };
    }
  }

  /**
   * Text Simplifier & Concept Explainer.
   */
  static async simplifyText(
    text: string,
    level: 'eli5' | 'highschool' | 'hinglish' | 'hindi' = 'eli5',
    apiKey?: string
  ): Promise<{ simplified: string; isDemo: boolean }> {
    const ai = getGeminiClient(apiKey);
    if (!ai) {
      return { simplified: this.generateMockSimplified(text, level), isDemo: true };
    }

    let levelInstruction = '';
    switch (level) {
      case 'eli5':
        levelInstruction = 'Explain like I am 5 years old. Use a playful, visual analogy that anyone can instantly understand.';
        break;
      case 'highschool':
        levelInstruction = 'Explain in clear student-friendly language suitable for high school or early undergrad, breaking down technical terms.';
        break;
      case 'hindi':
        levelInstruction = 'Explain completely in simple, easy-to-understand Hindi (Devanagari).';
        break;
      case 'hinglish':
        levelInstruction = 'Explain in casual, friendly Hinglish (conversational Hindi-English blend commonly used by Indian students).';
        break;
    }

    const prompt = `You are an expert tutor known for breaking down complex subjects.
${levelInstruction}

ORIGINAL TEXT:
"""
${text.slice(0, 6000)}
"""

Format your response in Markdown with:
1. 💡 The Big Picture (Core concept in 1 sentence)
2. 🚗 Relatable Real-World Analogy
3. 🔍 Step-by-Step Breakdown
4. 🧠 Quick Memory Trick`;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
      });

      return {
        simplified: response.text || 'Could not simplify text.',
        isDemo: false,
      };
    } catch (error: any) {
      return { simplified: this.generateMockSimplified(text, level), isDemo: true };
    }
  }

  /**
   * Mock data generators for Demo mode
   */
  private static generateMockNotes(
    content: string,
    topic: string,
    style: string,
    language: 'en' | 'hi'
  ) {
    const cleanTopic = topic || 'Synthesized Study Guide';
    const samplePreview = content.slice(0, 150).replace(/\n/g, ' ') || 'Key fundamental concepts and frameworks';

    if (language === 'hi') {
      return {
        title: `${cleanTopic} — मुख्य अध्ययन नोट्स`,
        isDemo: true,
        markdown: `# ${cleanTopic} — अध्ययन गाइड (NotesPro AI)

> [!NOTE]
> यह नोट्स डेमो मोड में तैयार किए गए हैं। वास्तविक Gemini AI से लाइव नोट्स बनाने के लिए सेटिंग्स में अपना Gemini API Key जोड़ें।

## 📖 विषय सारांश (Executive Summary)
यह अध्ययन गाइड **${cleanTopic}** के महत्वपूर्ण सिद्धांतों और अवधारणाओं को व्यवस्थित रूप से प्रस्तुत करता है। 

> "${samplePreview}..."

---

## 🔑 मुख्य परिभाषाएँ (Key Definitions)
- **मूल अवधारणा (Core Concept):** वह बुनियादी नियम जिसके आधार पर यह संपूर्ण विषय कार्य करता है।
- **व्यवस्थित प्रक्रिया (Systematic Process):** विभिन्न घटकों का समन्वित प्रवाह जो वांछित परिणाम उत्पन्न करता है।
- **विश्लेषण सिद्धांत (Analytical Principle):** जटिल समस्याओं को छोटे, हल करने योग्य हिस्सों में विभाजित करने की तकनीक।

---

## 📌 महत्वपूर्ण बिंदु और व्याख्या (Key Pillars)
1. **बुनियादी आधारशिला (Foundational Pillar):**
   - मूलभूत नियमों की स्पष्ट समझ परीक्षा और व्यावहारिक उपयोग दोनों में निर्णायक होती है।
   - सिद्धांतों का क्रमिक अनुप्रयोग गलतियों को 70% तक कम करता है।

2. **व्यावहारिक उपयोग (Practical Application):**
   - वास्तविक उदाहरणों के साथ तुलना करके याद रखना 3x अधिक प्रभावी है।
   - प्रमुख सूत्रों और संरचनाओं की पुनरावृत्ति।

3. **परीक्षण रणनीति (Exam Strategy):**
   - सीधे पूछे जाने वाले लघु उत्तरीय प्रश्नों पर विशेष ध्यान दें।
   - आरेखों (Diagrams) और तालिकाओं का उपयोग करके उत्तर को स्पष्ट बनाएं।

---

## 💡 मुख्य निष्कर्ष (Key Takeaways)
- मूल अवधारणाओं की गहरी समझ रटने से कहीं अधिक उपयोगी है।
- मुख्य बिंदुओं की नियमित समीक्षा दीर्घकालिक स्मृति को सुदृढ़ करती है।
- वास्तविक जीवन के उदाहरणों से जोड़कर सीखना सबसे तेज़ तरीका है।`,
        keyTakeaways: [
          'मूल अवधारणाओं की गहरी समझ रटने से कहीं अधिक उपयोगी है',
          'मुख्य बिंदुओं की नियमित समीक्षा दीर्घकालिक स्मृति को सुदृढ़ करती है',
          'वास्तविक जीवन के उदाहरणों से जोड़कर सीखना सबसे तेज़ तरीका है'
        ]
      };
    }

    return {
      title: `${cleanTopic} — Master Study Guide`,
      isDemo: true,
      markdown: `# ${cleanTopic} — Smart Study Guide

> [!NOTE]
> Generated in **Demo Mode**. To enable live Google Gemini 2.5 Flash intelligence, enter your Gemini API key in **Settings** or your \`.env\` file.

## 🎯 Executive Summary
This document breaks down **${cleanTopic}** into clear, digestible principles, actionable takeaways, and exam-ready revision points based on the provided material:
*"${samplePreview}..."*

---

## 🧠 Core Terminology & Definitions
- **Foundational Mechanism:** The underlying structure that dictates behavior and properties across varying test conditions.
- **Critical Threshold:** The pivotal point where state shifts or significant variance occurs.
- **Synthesis Framework:** The methodology for linking prerequisite knowledge with advanced application.

---

## 📋 Comprehensive Breakdown

### 1. Conceptual Architecture
- **Primary Principles:** The domain operates under consistent fundamental rules that can be reduced to core first principles.
- **Direct Cause & Effect:** Alterations in input variables correlate systematically with observed outcomes.
- **Boundary Conditions:** Identify edge-cases where standard approximations no longer hold true.

### 2. Methodologies & Workflows
- **Step 1:** Establish the baseline context and define variable constraints.
- **Step 2:** Formulate hypotheses or structured outlines based on proven theorems.
- **Step 3:** Validate using cross-referencing and empirical checks.

### 3. Exam & Practical Application Tips
> **High-Yield Insight:** Examiners consistently test the trade-offs between competing approaches. Always state assumptions upfront.

---

## 📌 Key Takeaways
- Mastery requires distinguishing between foundational causes and surface-level symptoms.
- Active recall through flashcards and practice quizzes increases long-term retention by 200%.
- Systematically cross-reference edge cases to avoid common exam traps.`,
      keyTakeaways: [
        'Mastery requires distinguishing between foundational causes and surface-level symptoms.',
        'Active recall through flashcards and practice quizzes increases long-term retention by 200%.',
        'Systematically cross-reference edge cases to avoid common exam traps.'
      ]
    };
  }

  private static generateMockFlashcards(
    content: string,
    count: number,
    topic: string,
    language: 'en' | 'hi'
  ): FlashcardItem[] {
    if (language === 'hi') {
      return [
        {
          question: `${topic}: मूल सिद्धांत क्या है?`,
          answer: 'यह वह मौलिक नियम है जो संपूर्ण संरचना और कार्यप्रणाली का संचालन करता है।',
          topic,
          difficulty: 'easy'
        },
        {
          question: 'इस विषय में सबसे सामान्य परीक्षा त्रुटि क्या है?',
          answer: 'मूल अवधारणा को समझे बिना केवल सतही सूत्रों को याद करना और सीमांत शर्तों (boundary conditions) को भूल जाना।',
          topic,
          difficulty: 'medium'
        },
        {
          question: 'वास्तविक दुनिया में इसका व्यावहारिक उपयोग कहाँ होता है?',
          answer: 'जटिल प्रणालियों के विश्लेषण, संसाधन अनुकूलन और पूर्वानुमान मॉडल बनाने में।',
          topic,
          difficulty: 'hard'
        },
        {
          question: 'त्वरित पुनरावृत्ति (Revision) के लिए मुख्य सूत्र क्या है?',
          answer: 'इनपुट पैरामीटर का सटीक विश्लेषण -> प्रसंस्करण नियम -> आउटपुट सत्यापन।',
          topic,
          difficulty: 'medium'
        }
      ];
    }

    return [
      {
        question: `What is the core foundational principle of ${topic}?`,
        answer: 'It establishes the primary governing laws and baseline constraints that dictate how components interact.',
        topic,
        difficulty: 'easy'
      },
      {
        question: 'What is the most frequent misconception tested on exams?',
        answer: 'Confusing correlation with direct causation and omitting critical boundary conditions in analytical steps.',
        topic,
        difficulty: 'medium'
      },
      {
        question: 'How do you optimize retention and problem-solving in this subject?',
        answer: 'By mapping concepts to real-world analogies, practicing active retrieval, and breaking problems down into first principles.',
        topic,
        difficulty: 'hard'
      },
      {
        question: 'What is the primary trade-off when applying standard approximations?',
        answer: 'Computational speed and simplicity increase, but precision diminishes near extreme boundary limits.',
        topic,
        difficulty: 'medium'
      },
      {
        question: 'What step should always precede final conclusion in an exam answer?',
        answer: 'Validating dimensional consistency and verifying edge cases against baseline assumptions.',
        topic,
        difficulty: 'hard'
      }
    ];
  }

  private static generateMockQuiz(
    content: string,
    count: number,
    topic: string,
    language: 'en' | 'hi'
  ): QuizQuestion[] {
    if (language === 'hi') {
      return [
        {
          id: 'q1',
          question: `${topic} के संदर्भ में सबसे महत्वपूर्ण सिद्धांत क्या है?`,
          options: [
            'बुनियादी अवधारणाओं का क्रमबद्ध अनुप्रयोग',
            'केवल सूत्रों को बिना समझे याद करना',
            'सीमांत शर्तों की अनदेखी करना',
            'यादृच्छिक अनुमान लगाना'
          ],
          correctAnswer: 0,
          explanation: 'बुनियादी अवधारणाओं का क्रमिक और सुसंगत अनुप्रयोग किसी भी जटिल समस्या को सटीकता से हल करने की कुंजी है।'
        },
        {
          id: 'q2',
          question: 'परीक्षा में उत्कृष्ट अंक प्राप्त करने के लिए सबसे प्रभावी रणनीति क्या है?',
          options: [
            'अंतिम रात में सब पढ़ना',
            'एक्टिव रिकॉल (Active Recall) और फ्लैशकार्ड्स का नियमित अभ्यास',
            'प्रश्नों को छोड़ देना',
            'केवल परिभाषाओं को पढ़ना'
          ],
          correctAnswer: 1,
          explanation: 'वैज्ञानिक अनुसंधानों के अनुसार एक्टिव रिकॉल और स्पेसड रिपीटीशन दीर्घकालिक स्मृति को 200% से अधिक मजबूत करते हैं।'
        }
      ];
    }

    return [
      {
        id: 'q1',
        question: `In the context of ${topic}, which factor is most decisive when establishing system stability?`,
        options: [
          'Adherence to core boundary conditions and input constraints',
          'Maximizing arbitrary complexity without validation',
          'Ignoring state transitions under variable load',
          'Relying solely on heuristic intuition'
        ],
        correctAnswer: 0,
        explanation: 'System stability is intrinsically bound to adhering to defined boundary conditions and verifying invariants across states.'
      },
      {
        id: 'q2',
        question: 'Why is first-principles reasoning superior to surface memorization?',
        options: [
          'It takes zero mental effort',
          'It enables solving novel, unencountered exam problems by reconstructing the logic',
          'It eliminates the need to understand fundamentals',
          'It only works for basic arithmetic'
        ],
        correctAnswer: 1,
        explanation: 'First-principles reasoning strips problems down to fundamental truths, empowering you to solve novel variations without relying on rote memorization.'
      },
      {
        id: 'q3',
        question: 'What is the recommended approach when faced with a high-mark comprehensive exam question?',
        options: [
          'Begin writing paragraphs immediately with no structure',
          'Outline key definitions, state assumptions, show step-by-step logic, and conclude with takeaways',
          'Only write a single sentence conclusion',
          'Copy the question prompt repeatedly'
        ],
        correctAnswer: 1,
        explanation: 'Examiners reward structured methodology: clear terminology, explicitly stated assumptions, and methodical execution.'
      }
    ];
  }

  private static generateMockChatReply(
    context: string,
    userQuery: string,
    language: 'en' | 'hi'
  ): string {
    const q = userQuery.toLowerCase();
    if (language === 'hi') {
      return `आपके द्वारा प्रदान किए गए दस्तावेज़ के अनुसार:

"${userQuery}" के संबंध में मुख्य बिंदु यह है कि विषय वस्तु स्पष्ट रूप से मूल सिद्धांतों और व्यवस्थित अभ्यास पर बल देती है। 

- **मुख्य संदर्भ:** दस्तावेज़ स्पष्ट करता है कि अवधारणाओं को छोटे घटकों में विभाजित करना सबसे कुशल तरीका है।
- **सुझाव:** क्या आप इस बिंदु पर आधारित फ्लैशकार्ड या 3 महत्वपूर्ण बहुविकल्पीय प्रश्न (MCQ) बनाना चाहते हैं?`;
    }

    return `Based on your provided study material and document context:

Regarding **"${userQuery}"**:

1. **Direct Finding:** The text highlights that understanding foundational mechanics and boundary rules is the primary determinant of mastery.
2. **Key Insight:** When applying this to problem solving, consistently state your baseline assumptions before formulating final conclusions.
3. **Study Recommendation:** Would you like me to generate a 3-question drill or flashcards specifically focused on this subtopic?`;
  }

  private static generateMockSimplified(
    text: string,
    level: string
  ): string {
    return `### 💡 The Big Picture
Think of this concept like the engine of a car: instead of worrying about thousands of tiny wires, focus on how fuel turns into movement.

---

### 🚗 Relatable Real-World Analogy
Imagine you are baking a cake. If you just dump all ingredients together randomly, it fails. But if you mix flour and eggs in order, the chemical reaction happens reliably. This concept works the exact same way: consistent inputs yield predictable outputs.

---

### 🔍 Step-by-Step Breakdown
1. **The Starting State:** You begin with raw inputs and clear rules.
2. **The Transformation:** A structured rule or formula acts upon the inputs.
3. **The Result:** You receive verified, reproducible outcomes without confusion.

---

### 🧠 Quick Memory Trick
Remember **"I-P-O"**: **Input** -> **Process** -> **Output**!`;
  }
}
