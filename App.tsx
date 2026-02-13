
import React, { useState, useEffect } from 'react';
import { FileUpload } from './components/FileUpload';
import { AnalysisReport } from './components/AnalysisReport';
import { analyzeResume } from './services/geminiService';
import { readFileAsBase64, extractTextFromDocx, extractTextFromPdf, getFileType } from './services/fileHelper';
import { AppState, AnalysisResult, FileData } from './types';
import { FileText, Loader2, Sparkles, CheckCircle, Zap, AlertTriangle, Briefcase } from 'lucide-react';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [fileData, setFileData] = useState<FileData | null>(null);
  const [jobDescription, setJobDescription] = useState('');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loadingStep, setLoadingStep] = useState(0);
  
  const loadingMessages = [
    "Processing document modalities...",
    "Consulting Gemini Intelligence...",
    "Extracting semantic insights...",
    "Validating industry alignment...",
    "Constructing your roadmap..."
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
      if (!fileType) throw new Error("Unsupported file type");

      let base64: string | undefined;
      let text: string | undefined;

      if (fileType === 'docx') {
        text = await extractTextFromDocx(file);
      } else if (fileType === 'pdf') {
        text = await extractTextFromPdf(file);
        base64 = await readFileAsBase64(file);
      } else {
        base64 = await readFileAsBase64(file);
      }

      setFileData({
        file,
        type: fileType,
        previewUrl: fileType === 'image' ? URL.createObjectURL(file) : null,
        base64,
        text
      });

      const result = await analyzeResume(base64, text, file.type, fileType, jobDescription);
      setAnalysisResult(result);
      setAppState(AppState.SUCCESS);

    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Something went wrong during analysis.");
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
    <div className="min-h-screen px-4 py-8 md:py-16 max-w-6xl mx-auto selection:bg-indigo-100 selection:text-indigo-900">
      
      <header className="mb-16 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-50 border border-indigo-100 rounded-full text-indigo-600 text-[10px] font-bold tracking-[0.2em] uppercase shadow-sm">
          <Sparkles size={14} className="animate-pulse" />
          Intelligence Powered by Gemini 3 Flash
        </div>
        <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight">
          ResumeAI <span className="bg-gradient-to-r from-indigo-600 to-violet-500 bg-clip-text text-transparent">Architect</span>
        </h1>
        <p className="text-slate-500 max-w-2xl mx-auto text-xl leading-relaxed">
          The most advanced CV intelligence platform. Benchmark your profile against any role and receive actionable, high-impact feedback instantly.
        </p>
      </header>

      <main>
        {appState === AppState.IDLE && (
          <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-10">
            {/* File Upload Area */}
            <div className="lg:col-span-3 space-y-6">
              <FileUpload onFileSelect={handleFileSelect} isAnalyzing={false} />
              
              <div className="grid grid-cols-3 gap-4">
                {[
                  { icon: <FileText />, label: "Multi-Format" },
                  { icon: <Zap />, label: "Real-time" },
                  { icon: <CheckCircle />, label: "Precise" }
                ].map((item, i) => (
                  <div key={i} className="p-4 bg-white/50 border border-slate-100 rounded-2xl text-center space-y-2">
                    <div className="text-indigo-500 flex justify-center">{item.icon}</div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Job Description Sidebar */}
            <div className="lg:col-span-2">
              <div className="glass-panel p-6 rounded-3xl border border-slate-200 h-full flex flex-col">
                <div className="flex items-center gap-2 mb-4 text-slate-700">
                  <Briefcase size={18} />
                  <h3 className="font-bold">Job Description <span className="text-slate-400 font-normal">(Optional)</span></h3>
                </div>
                <textarea 
                  className="w-full flex-grow p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none resize-none min-h-[200px]"
                  placeholder="Paste the target job description here to get a custom match score and keyword gap analysis..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                />
                <p className="mt-3 text-[11px] text-slate-400 italic">
                  Providing context helps the AI identify role-specific keywords you might be missing.
                </p>
              </div>
            </div>
          </div>
        )}

        {appState === AppState.ANALYZING && (
          <div className="max-w-md mx-auto text-center py-24 space-y-8">
            <div className="relative w-32 h-32 mx-auto">
               <div className="absolute inset-0 border-[6px] border-slate-100 rounded-full"></div>
               <div className="absolute inset-0 border-[6px] border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
               <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center animate-pulse">
                    <Loader2 className="text-indigo-500" size={32} />
                  </div>
               </div>
            </div>
            <div>
              <h2 className="text-3xl font-black text-slate-900 mb-2">Analyzing Resume</h2>
              <p className="text-indigo-500 font-medium tracking-wide animate-pulse h-6">
                {loadingMessages[loadingStep]}
              </p>
            </div>
          </div>
        )}

        {appState === AppState.ERROR && (
          <div className="max-w-xl mx-auto py-12">
            <div className="bg-rose-50 border border-rose-100 p-8 rounded-3xl text-center space-y-6">
              <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto">
                <AlertTriangle size={32}/>
              </div>
              <div className="space-y-2">
                <h3 className="text-rose-900 font-black text-2xl">Architect Error</h3>
                <p className="text-rose-700/80 leading-relaxed">{errorMsg}</p>
              </div>
              <button 
                onClick={handleReset}
                className="w-full py-4 bg-rose-600 text-white rounded-2xl font-bold hover:bg-rose-700 transition-colors shadow-lg shadow-rose-200"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        )}

        {appState === AppState.SUCCESS && analysisResult && (
          <AnalysisReport result={analysisResult} onReset={handleReset} />
        )}
      </main>

      <footer className="mt-24 pt-12 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-400 text-sm">
        <p>© {new Date().getFullYear()} ResumeAI Architect. All rights reserved.</p>
        <div className="flex gap-6 font-medium">
          <a href="#" className="hover:text-indigo-600 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-indigo-600 transition-colors">API Status</a>
        </div>
      </footer>
    </div>
  );
};

export default App;
