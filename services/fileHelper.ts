
import mammoth from 'mammoth';
import * as pdfjsLib from 'pdfjs-dist';

// Handle ESM default export inconsistencies (common with pdfjs-dist via CDNs)
const pdfjs = (pdfjsLib as any).default ?? pdfjsLib;

// Initialize the PDF.js worker using unpkg for reliable raw script loading.
// This specifically resolves the 'importScripts' NetworkError seen with esm.sh workers.
if (pdfjs.GlobalWorkerOptions) {
  pdfjs.GlobalWorkerOptions.workerSrc = 'https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js';
}

export const readFileAsBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        // Remove the data URL prefix (e.g., "data:image/png;base64,")
        const base64 = reader.result.split(',')[1];
        resolve(base64);
      } else {
        reject(new Error('Failed to read file as string'));
      }
    };
    reader.onerror = error => reject(error);
    reader.readAsDataURL(file);
  });
};

export const extractTextFromDocx = async (file: File): Promise<string> => {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value;
};

export const extractTextFromPdf = async (file: File): Promise<string> => {
  const arrayBuffer = await file.arrayBuffer();
  
  try {
    const loadingTask = pdfjs.getDocument({ 
      data: arrayBuffer,
      // Use standard fonts and disable specialized font loading to reduce external dependencies
      disableFontFace: true,
      verbosity: 0 
    });
    
    const pdf = await loadingTask.promise;
    let fullText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map((item: any) => (item as any).str).join(' ');
      fullText += pageText + '\n';
    }

    return fullText;
  } catch (error: any) {
    console.error("PDF Parsing error:", error);
    
    // Catch worker initialization failures specifically
    if (error.message?.includes('WorkerMessageHandler') || error.name === 'NetworkError') {
      throw new Error("The PDF engine failed to load properly. Please ensure you have a stable internet connection and try refreshing the page.");
    }
    
    throw new Error("Could not extract text from this PDF. It might be a scanned image or password-protected.");
  }
};

export const getFileType = (file: File): 'pdf' | 'image' | 'docx' | null => {
  if (file.type === 'application/pdf') return 'pdf';
  if (file.type.startsWith('image/')) return 'image';
  if (
    file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    file.name.endsWith('.docx')
  ) {
    return 'docx';
  }
  return null;
};
