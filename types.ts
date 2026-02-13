export interface AnalysisResult {
  score: number;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  improvements: string[];
  skillsFound: string[];
  roleMatch?: string;
}

export interface FileData {
  file: File;
  previewUrl: string | null;
  base64?: string; // For images/PDFs
  text?: string;   // For DOCX
  type: 'pdf' | 'image' | 'docx';
}

export enum AppState {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}
