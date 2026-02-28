import { useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  Upload,
  CheckCircle,
  AlertCircle,
  X,
  Sparkles,
  Loader2,
} from 'lucide-react';
import type { ResumeData } from '@/types';

interface ResumeUploadProps {
  onUpload: (file: File) => Promise<void>;
  onEnhance: () => void;
  resume: ResumeData | null;
  isParsing: boolean;
  error: string | null;
  onClear: () => void;
}

interface FileRejection {
  file: File;
  errors: { message: string; code: string }[];
}

export function ResumeUpload({
  onUpload,
  onEnhance,
  resume,
  isParsing,
  error,
  onClear,
}: ResumeUploadProps) {
  const [uploadProgress, setUploadProgress] = useState(0);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        
        // Simulate upload progress
        setUploadProgress(0);
        const progressInterval = setInterval(() => {
          setUploadProgress((prev) => {
            if (prev >= 90) {
              clearInterval(progressInterval);
              return 90;
            }
            return prev + 10;
          });
        }, 100);

        await onUpload(file);
        
        clearInterval(progressInterval);
        setUploadProgress(100);
        
        setTimeout(() => setUploadProgress(0), 500);
      }
    },
    [onUpload]
  );

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024, // 5MB
    disabled: isParsing,
  });

  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut' as const,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: 'easeOut' as const,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      transition: {
        duration: 0.3,
      },
    },
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={containerVariants}
        >
          {/* Section Header */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-violet-100 to-purple-100 dark:from-violet-900/30 dark:to-purple-900/30 text-violet-700 dark:text-violet-300 text-sm font-medium mb-4"
            >
              <Upload className="w-4 h-4" />
              Step 1: Upload Your Resume
            </motion.div>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 dark:text-slate-100 mb-4">
              Upload Your Resume
            </h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
              We support PDF, DOC, and DOCX formats. Our AI will analyze your resume 
              and extract key information to enhance it.
            </p>
          </div>

          {/* Upload Area */}
          <AnimatePresence mode="wait">
            {!resume ? (
              <motion.div
                key="upload"
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <Card
                  {...getRootProps()}
                  className={`
                    relative p-8 sm:p-12 border-2 border-dashed rounded-2xl cursor-pointer
                    transition-all duration-300
                    ${isDragActive 
                      ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/20' 
                      : 'border-slate-300 dark:border-slate-700 hover:border-violet-400 dark:hover:border-violet-600'
                    }
                    ${isParsing ? 'pointer-events-none opacity-70' : ''}
                  `}
                >
                  <input {...getInputProps()} />

                  <div className="text-center">
                    <motion.div
                      className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900/30 dark:to-purple-900/30 flex items-center justify-center"
                      animate={isDragActive ? { scale: 1.1 } : { scale: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      {isParsing ? (
                        <Loader2 className="w-10 h-10 text-violet-600 animate-spin" />
                      ) : (
                        <Upload className="w-10 h-10 text-violet-600 dark:text-violet-400" />
                      )}
                    </motion.div>

                    {isParsing ? (
                      <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
                          Analyzing Your Resume...
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400">
                          Our AI is extracting your skills and experience
                        </p>
                        <div className="max-w-xs mx-auto">
                          <Progress value={uploadProgress} className="h-2" />
                        </div>
                      </div>
                    ) : (
                      <>
                        <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-2">
                          {isDragActive ? 'Drop your resume here' : 'Drag & drop your resume'}
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400 mb-4">
                          or click to browse files
                        </p>
                        <div className="flex flex-wrap justify-center gap-2 text-sm text-slate-500 dark:text-slate-500">
                          <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800">
                            PDF
                          </span>
                          <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800">
                            DOC
                          </span>
                          <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800">
                            DOCX
                          </span>
                          <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800">
                            Max 5MB
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </Card>

                {/* Error Message */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mt-4 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex items-center gap-3"
                    >
                      <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
                      <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* File Rejection Errors */}
                <AnimatePresence>
                  {fileRejections.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mt-4 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
                    >
                      {(fileRejections as FileRejection[]).map(({ file, errors }: FileRejection, index: number) => (
                        <div key={index} className="flex items-center gap-3">
                          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
                          <div>
                            <p className="text-red-700 dark:text-red-300 text-sm font-medium">
                              {file.name}
                            </p>
                            {errors.map((e: { message: string }, i: number) => (
                              <p key={i} className="text-red-600 dark:text-red-400 text-xs">
                                {e.message}
                              </p>
                            ))}
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ) : (
              <motion.div
                key="preview"
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <Card className="p-6 sm:p-8 rounded-2xl border border-violet-200 dark:border-violet-800 bg-gradient-to-br from-violet-50/50 to-purple-50/50 dark:from-violet-900/10 dark:to-purple-900/10">
                  {/* Success Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
                        <CheckCircle className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                          Resume Uploaded Successfully!
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400 text-sm">
                          {resume.fileName}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={onClear}
                      className="rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-600"
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </div>

                  {/* Resume Preview */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">
                        Name
                      </div>
                      <div className="font-medium text-slate-800 dark:text-slate-100">
                        {resume.personalInfo.fullName}
                      </div>
                    </div>
                    <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">
                        Experience
                      </div>
                      <div className="font-medium text-slate-800 dark:text-slate-100">
                        {resume.experience.length} positions
                      </div>
                    </div>
                    <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">
                        Skills
                      </div>
                      <div className="font-medium text-slate-800 dark:text-slate-100">
                        {resume.skills.length} skills detected
                      </div>
                    </div>
                    <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">
                        Education
                      </div>
                      <div className="font-medium text-slate-800 dark:text-slate-100">
                        {resume.education.length} degrees
                      </div>
                    </div>
                  </div>

                  {/* Skills Tags */}
                  <div className="mb-6">
                    <div className="text-sm text-slate-500 dark:text-slate-400 mb-2">
                      Top Skills
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {resume.skills.slice(0, 8).map((skill) => (
                        <span
                          key={skill.id}
                          className="px-3 py-1 rounded-full text-sm bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300"
                        >
                          {skill.name}
                        </span>
                      ))}
                      {resume.skills.length > 8 && (
                        <span className="px-3 py-1 rounded-full text-sm bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                          +{resume.skills.length - 8} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action Button */}
                  <Button
                    onClick={onEnhance}
                    className="w-full btn-gradient text-white py-6 text-lg rounded-xl group"
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                    Enhance My Resume with AI
                    <motion.span
                      className="ml-2"
                      animate={{ x: [0, 4, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      →
                    </motion.span>
                  </Button>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
