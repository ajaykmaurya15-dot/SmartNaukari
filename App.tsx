import React, { useState, useEffect } from 'react';
import { FileUpload } from './components/FileUpload';
import { AnalysisReport } from './components/AnalysisReport';
import { analyzeResume } from './services/geminiService';
import { readFileAsBase64, extractTextFromDocx, extractTextFromPdf, getFileType } from './services/fileHelper';
import { AppState, AnalysisResult, FileData } from './types';
import { FileText, Loader2, Sparkles, CheckCircle, Zap, AlertTriangle } from 'lucide-react';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [fileData, setFileData] = useState<FileData | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loadingStep, setLoadingStep] = useState(0);
  
  const loadingMessages = [
    "Reading document structure...",
    "Sending to Gemini AI...",
    "Analyzing layout and impact...",
    "Comparing against industry standards...",
    "Compiling feedback..."
  ];

  useEffect(() => {
    let interval: number;
    if (appState === AppState.ANALYZING) {
      interval = window.setInterval(() => {
        setLoadingStep((prev) => (prev + 1) % loadingMessages.length);
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [appState]);

  const handleFileSelect = async (file: File) => {
    try {
      setAppState(AppState.ANALYZING);
      setErrorMsg(null);
      
      const fileType = getFileType(file);
      if (!fileType) {
        throw new Error("Unsupported file type");
      }

      let base64: string | undefined;
      let text: string | undefined;

      // Process file based on type
      if (fileType === 'docx') {
        text = await extractTextFromDocx(file);
      } else if (fileType === 'pdf') {
        text = await extractTextFromPdf(file);
        // For PDF, we also get base64 to leverage Gemini's multimodal capabilities where applicable,
        // though our service currently routes base64 for PDFs.
        base64 = await readFileAsBase64(file);
      } else {
        // Image
        base64 = await readFileAsBase64(file);
      }

      setFileData({
        file,
        type: fileType,
        previewUrl: fileType === 'image' ? URL.createObjectURL(file) : null,
        base64,
        text
      });

      // Send to Gemini
      const result = await analyzeResume(base64, text, file.type, fileType);
      
      setAnalysisResult(result);
      setAppState(AppState.SUCCESS);

    } catch (err: any) {
      console.error(err);
      const msg = err.message || "An error occurred while analyzing the resume.";
      setErrorMsg(msg);
      setAppState(AppState.ERROR);
    }
  };

  const handleReset = () => {
    setAppState(AppState.IDLE);
    setFileData(null);
    setAnalysisResult(null);
    setErrorMsg(null);
  };

  return (
    <div className="min-h-screen px-4 py-8 md:py-12 max-w-5xl mx-auto relative">
      
      {/* Header */}
      <header className="mb-12 text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 border border-indigo-100 rounded-full text-indigo-600 text-xs font-semibold tracking-wide uppercase">
          <Sparkles size={14} />
          Powered by Gemini 3 Flash
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
          ResumeAI <span className="text-indigo-600">Architect</span>
        </h1>
        <p className="text-slate-500 max-w-xl mx-auto text-lg">
          Transform your resume with advanced AI analysis. Upload your CV and get instant, professional feedback.
        </p>
      </header>

      {/* Main Content Area */}
      <main className="w-full">
        
        {appState === AppState.IDLE && (
          <div className="max-w-2xl mx-auto animate-fade-in">
            <FileUpload onFileSelect={handleFileSelect} isAnalyzing={false} />
            
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="p-4">
                <div className="w-12 h-12 bg-white shadow-sm rounded-xl flex items-center justify-center mx-auto mb-3 text-indigo-500">
                  <FileText />
                </div>
                <h3 className="font-semibold text-slate-800">Multi-Format</h3>
                <p className="text-sm text-slate-500 mt-1">PDF & DOCX Support</p>
              </div>
              <div className="p-4">
                <div className="w-12 h-12 bg-white shadow-sm rounded-xl flex items-center justify-center mx-auto mb-3 text-indigo-500">
                  <Zap />
                </div>
                <h3 className="font-semibold text-slate-800">Fast Analysis</h3>
                <p className="text-sm text-slate-500 mt-1">Powered by Gemini</p>
              </div>
              <div className="p-4">
                <div className="w-12 h-12 bg-white shadow-sm rounded-xl flex items-center justify-center mx-auto mb-3 text-indigo-500">
                  <CheckCircle />
                </div>
                <h3 className="font-semibold text-slate-800">Actionable</h3>
                <p className="text-sm text-slate-500 mt-1">Clear improvements</p>
              </div>
            </div>
          </div>
        )}

        {appState === AppState.ANALYZING && (
          <div className="max-w-md mx-auto text-center py-20 animate-pulse">
            <div className="relative w-24 h-24 mx-auto mb-8">
               <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
               <div className="absolute inset-0 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
               <Loader2 className="absolute inset-0 m-auto text-indigo-500 animate-pulse" size={32} />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Analyzing Resume...</h2>
            <p className="text-slate-500 transition-all duration-500 min-h-[1.5rem]">
              {loadingMessages[loadingStep]}
            </p>
          </div>
        )}

        {appState === AppState.ERROR && (
          <div className="max-w-xl mx-auto text-center py-12">
            <div className="bg-red-50 border border-red-100 p-6 rounded-2xl mb-8 text-left">
              <h3 className="text-red-700 font-bold text-lg mb-2 flex items-center gap-2">
                <AlertTriangle size={20}/> Analysis Failed
              </h3>
              
              <p className="text-red-600 mb-4">{errorMsg}</p>
              
              <div className="mt-6 text-center">
                <button 
                  onClick={handleReset}
                  className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 font-medium text-sm transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        )}

        {appState === AppState.SUCCESS && analysisResult && (
          <AnalysisReport result={analysisResult} onReset={handleReset} />
        )}

      </main>

      {/* Footer */}
      <footer className="mt-20 text-center text-slate-400 text-sm py-8 border-t border-slate-200/50">
        <p>© {new Date().getFullYear()} ResumeAI. Powered by Google Gemini.</p>
      </footer>
    </div>
  );
};

export default App;