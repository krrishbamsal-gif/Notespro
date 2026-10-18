import pdfParse from 'pdf-parse';

export class PDFService {
  /**
   * Extracts raw text from a PDF buffer safely.
   */
  static async extractText(buffer: Buffer): Promise<{
    text: string;
    numPages: number;
    info: any;
  }> {
    try {
      const data = await pdfParse(buffer);
      return {
        text: data.text ? data.text.trim() : '',
        numPages: data.numpages || 1,
        info: data.info || {}
      };
    } catch (error: any) {
      throw new Error(`Failed to extract text from PDF: ${error.message}`);
    }
  }
}
