import { Router, Request, Response } from 'express';
import multer from 'multer';
import { PDFService } from '../services/pdfService.js';

export const pdfRouter = Router();

// Configure Multer for in-memory upload (limit 15MB)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 15 * 1024 * 1024, // 15MB max
  },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === 'application/pdf' || file.originalname.toLowerCase().endsWith('.pdf')) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are supported.'));
    }
  },
});

// Extract text endpoint
pdfRouter.post('/extract', upload.single('file'), async (req: Request, res: Response) => {
  try {
    if (!req.file || !req.file.buffer) {
      return res.status(400).json({ error: 'No PDF file uploaded.' });
    }

    const { text, numPages, info } = await PDFService.extractText(req.file.buffer);

    if (!text || text.length === 0) {
      return res.status(422).json({
        error: 'The uploaded PDF appears to be empty or contains only scanned images without OCR text.',
        numPages,
      });
    }

    res.json({
      success: true,
      filename: req.file.originalname,
      sizeBytes: req.file.size,
      numPages,
      charCount: text.length,
      text,
      title: info?.Title || req.file.originalname.replace(/\.pdf$/i, ''),
    });
  } catch (error: any) {
    console.error('PDF extraction failed:', error);
    res.status(500).json({ error: error.message || 'Failed to parse PDF.' });
  }
});
