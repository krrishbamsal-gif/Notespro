import { Router, Request, Response } from 'express';
import { AIService } from '../services/aiService.js';

export const aiRouter = Router();

// Check AI status / key validity
aiRouter.get('/status', (req: Request, res: Response) => {
  const customKey = req.headers['x-gemini-key'] as string | undefined;
  const isConfigured = AIService.isConfigured(customKey);
  res.json({
    status: 'ok',
    isConfigured,
    model: 'gemini-3.8-flash',
    mode: isConfigured ? 'live' : 'demo',
    message: isConfigured
      ? 'Live Gemini API configured'
      : 'Running in Smart Demo Mode. Add GEMINI_API_KEY in server/.env or in Settings to enable live generation.'
  });
});

// Generate Notes
aiRouter.post('/generate-notes', async (req: Request, res: Response) => {
  try {
    const { content, topic, style, language } = req.body;
    const customKey = req.headers['x-gemini-key'] as string | undefined;

    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      return res.status(400).json({ error: 'Content is required to generate notes.' });
    }

    const result = await AIService.generateNotes({
      content,
      topic,
      style,
      language,
      apiKey: customKey,
    });

    res.json(result);
  } catch (error: any) {
    console.error('Error generating notes:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

// Summarize PDF / Text
aiRouter.post('/summarize', async (req: Request, res: Response) => {
  try {
    const { content, topic, length = 'standard', language = 'en' } = req.body;
    const customKey = req.headers['x-gemini-key'] as string | undefined;

    if (!content || typeof content !== 'string') {
      return res.status(400).json({ error: 'Content is required for summary.' });
    }

    const style = length === 'brief' ? 'summary' : 'smart';
    const result = await AIService.generateNotes({
      content,
      topic: topic || 'Document Summary',
      style,
      language,
      apiKey: customKey,
    });

    res.json(result);
  } catch (error: any) {
    console.error('Error summarizing:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

// Generate Flashcards
aiRouter.post('/generate-flashcards', async (req: Request, res: Response) => {
  try {
    const { content, count = 8, topic = 'General', language = 'en' } = req.body;
    const customKey = req.headers['x-gemini-key'] as string | undefined;

    if (!content) {
      return res.status(400).json({ error: 'Content is required.' });
    }

    const result = await AIService.generateFlashcards(
      content,
      Number(count),
      topic,
      language,
      customKey
    );

    res.json(result);
  } catch (error: any) {
    console.error('Error generating flashcards:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

// Generate Quiz
aiRouter.post('/generate-quiz', async (req: Request, res: Response) => {
  try {
    const { content, count = 5, topic = 'General', language = 'en' } = req.body;
    const customKey = req.headers['x-gemini-key'] as string | undefined;

    if (!content) {
      return res.status(400).json({ error: 'Content is required.' });
    }

    const result = await AIService.generateQuiz(
      content,
      Number(count),
      topic,
      language,
      customKey
    );

    res.json(result);
  } catch (error: any) {
    console.error('Error generating quiz:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

// Chat with Document / Notes
aiRouter.post('/chat', async (req: Request, res: Response) => {
  try {
    const { context, history = [], message, language = 'en' } = req.body;
    const customKey = req.headers['x-gemini-key'] as string | undefined;

    if (!message) {
      return res.status(400).json({ error: 'Message is required.' });
    }

    const result = await AIService.chatWithDocument(
      context || '',
      history,
      message,
      language,
      customKey
    );

    res.json(result);
  } catch (error: any) {
    console.error('Error in chat:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

// Simplify Text (ELI5 / Hindi / Highschool)
aiRouter.post('/simplify', async (req: Request, res: Response) => {
  try {
    const { text, level = 'eli5' } = req.body;
    const customKey = req.headers['x-gemini-key'] as string | undefined;

    if (!text) {
      return res.status(400).json({ error: 'Text is required to simplify.' });
    }

    const result = await AIService.simplifyText(text, level, customKey);
    res.json(result);
  } catch (error: any) {
    console.error('Error in simplify:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});
