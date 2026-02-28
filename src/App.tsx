import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Toaster, toast } from 'sonner';
import {
  Sparkles,
  Menu,
  X,
  ChevronUp,
} from 'lucide-react';
import { Hero, ResumeUpload, ResumeEnhancement, JobListings } from '@/sections';
import { useLocation, useResume, useJobs } from '@/hooks';
import type { AppSection } from '@/types';
import './App.css';

function App() {
  const [activeSection, setActiveSection] = useState<AppSection>('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const uploadRef = useRef<HTMLDivElement>(null);
  const enhanceRef = useRef<HTMLDivElement>(null);
  const jobsRef = useRef<HTMLDivElement>(null);

  // Custom hooks
  const { location, permission: locationPermission, requestLocation } = useLocation();
  const {
    resume,
    enhancementResult,
    isParsing,
    isEnhancing,
    error: resumeError,
    parseResume,
    enhanceResume,
    applySuggestion,
    rejectSuggestion,
    clearResume,
    generateStyledResume,
  } = useResume();
  const {
    jobs,
    filteredJobs,
    isLoading: jobsLoading,
    filters,
    applyFilters,
    clearFilters,
  } = useJobs(location);

  // Scroll handler
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-request location on app load (after a short delay)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (locationPermission === 'prompt') {
        requestLocation();
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [locationPermission, requestLocation]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>, section: AppSection) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
    setActiveSection(section);
    setMobileMenuOpen(false);
  };

  const handleGetStarted = () => {
    scrollToSection(uploadRef, 'upload');
  };

  const handleUpload = async (file: File) => {
    await parseResume(file);
    toast.success('Resume uploaded successfully!');
  };

  const handleEnhance = async () => {
    if (resume) {
      scrollToSection(enhanceRef, 'enhance');
      await enhanceResume(resume);
      toast.success('Resume enhanced with AI!');
    }
  };

  const handleRequestLocation = async () => {
    await requestLocation();
    if (location) {
      toast.success('Location access granted!');
    }
  };

  const navItems = [
    { id: 'home', label: 'Home', action: () => scrollToTop() },
    { id: 'upload', label: 'Upload', action: () => scrollToSection(uploadRef, 'upload') },
    { id: 'enhance', label: 'Enhance', action: () => scrollToSection(enhanceRef, 'enhance') },
    { id: 'jobs', label: 'Jobs', action: () => scrollToSection(jobsRef, 'jobs') },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Toaster position="top-center" richColors />

      {/* Navigation */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <motion.div
              className="flex items-center gap-2 cursor-pointer"
              whileHover={{ scale: 1.02 }}
              onClick={scrollToTop}
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                SmartNaukari
              </span>
            </motion.div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <Button
                  key={item.id}
                  variant="ghost"
                  onClick={item.action}
                  className={`relative ${
                    activeSection === item.id
                      ? 'text-violet-600 dark:text-violet-400'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {item.label}
                  {activeSection === item.id && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-violet-600"
                    />
                  )}
                </Button>
              ))}
            </nav>

            {/* CTA Button */}
            <div className="hidden md:block">
              <Button
                onClick={handleGetStarted}
                className="btn-gradient text-white"
              >
                Get Started
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800"
            >
              <nav className="flex flex-col p-4">
                {navItems.map((item) => (
                  <Button
                    key={item.id}
                    variant="ghost"
                    onClick={item.action}
                    className="justify-start"
                  >
                    {item.label}
                  </Button>
                ))}
                <Button
                  onClick={handleGetStarted}
                  className="btn-gradient text-white mt-4"
                >
                  Get Started
                </Button>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Main Content */}
      <main className="pt-16">
        {/* Hero Section */}
        <Hero onGetStarted={handleGetStarted} />

        {/* Resume Upload Section */}
        <div ref={uploadRef} id="upload">
          <ResumeUpload
            onUpload={handleUpload}
            onEnhance={handleEnhance}
            resume={resume}
            isParsing={isParsing}
            error={resumeError}
            onClear={clearResume}
          />
        </div>

        {/* Resume Enhancement Section */}
        <div ref={enhanceRef} id="enhance">
          <ResumeEnhancement
            enhancementResult={enhancementResult}
            isEnhancing={isEnhancing}
            onApplySuggestion={applySuggestion}
            onRejectSuggestion={rejectSuggestion}
            onGenerateStyledResume={generateStyledResume}
          />
        </div>

        {/* Job Listings Section */}
        <div ref={jobsRef} id="jobs">
          <JobListings
            jobs={jobs}
            filteredJobs={filteredJobs}
            isLoading={jobsLoading}
            userLocation={location}
            locationPermission={locationPermission}
            onRequestLocation={handleRequestLocation}
            filters={filters}
            onApplyFilters={applyFilters}
            onClearFilters={clearFilters}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">SmartNaukari</span>
              </div>
              <p className="text-slate-400 max-w-sm">
                AI-powered resume enhancement and job matching platform for Indian job seekers. 
                Find your dream job with precision.
              </p>
            </div>

            {/* Links */}
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#upload" className="hover:text-white transition-colors">Upload Resume</a></li>
                <li><a href="#enhance" className="hover:text-white transition-colors">AI Enhancement</a></li>
                <li><a href="#jobs" className="hover:text-white transition-colors">Job Search</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-slate-500 text-sm">
              © 2024 SmartNaukari. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <span className="text-slate-500 text-sm">Made with</span>
              <Sparkles className="w-4 h-4 text-violet-400" />
              <span className="text-slate-500 text-sm">and AI</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 w-12 h-12 rounded-full bg-violet-600 text-white shadow-lg hover:bg-violet-700 transition-colors flex items-center justify-center z-50"
          >
            <ChevronUp className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
