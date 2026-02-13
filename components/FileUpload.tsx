import React, { useRef, useState } from 'react';
import { UploadCloud, FileText, Image as ImageIcon, FileType } from 'lucide-react';
import { getFileType } from '../services/fileHelper';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  isAnalyzing: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, isAnalyzing }) => {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndUpload(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndUpload(e.target.files[0]);
    }
  };

  const validateAndUpload = (file: File) => {
    if (isAnalyzing) return;
    
    const type = getFileType(file);
    if (type) {
      onFileSelect(file);
    } else {
      alert("Unsupported file type. Please upload a PDF, DOCX, or Image (PNG/JPG).");
    }
  };

  return (
    <div 
      className={`relative group cursor-pointer transition-all duration-300 ease-in-out border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center text-center
        ${isDragging ? 'border-indigo-500 bg-indigo-50/50' : 'border-slate-300 hover:border-indigo-400 hover:bg-slate-50'}
        ${isAnalyzing ? 'opacity-50 pointer-events-none' : ''}
      `}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
    >
      <input 
        type="file" 
        ref={inputRef} 
        className="hidden" 
        accept=".pdf,.docx,.doc,.png,.jpg,.jpeg"
        onChange={handleInputChange}
      />
      
      <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
        <UploadCloud size={32} />
      </div>

      <h3 className="text-xl font-semibold text-slate-800 mb-2">
        {isDragging ? "Drop it like it's hot!" : "Click to upload or drag & drop"}
      </h3>
      
      <p className="text-slate-500 text-sm max-w-sm mx-auto mb-6">
        Support for PDF, Word Documents (DOCX), and Images (PNG, JPG). 
        <br/>We prioritize your privacy.
      </p>

      <div className="flex gap-4 text-xs text-slate-400 uppercase tracking-wide font-medium">
        <span className="flex items-center gap-1"><FileType size={14}/> PDF</span>
        <span className="flex items-center gap-1"><FileText size={14}/> DOCX</span>
        <span className="flex items-center gap-1"><ImageIcon size={14}/> IMG</span>
      </div>
    </div>
  );
};
