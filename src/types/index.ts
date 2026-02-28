// User Location Type
export interface UserLocation {
  latitude: number;
  longitude: number;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  address?: string;
}

// Resume Types
export interface ResumeData {
  id: string;
  personalInfo: PersonalInfo;
  summary: string;
  experience: WorkExperience[];
  education: Education[];
  skills: Skill[];
  certifications: Certification[];
  projects: Project[];
  languages: Language[];
  uploadedAt: Date;
  fileName: string;
}

export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedIn?: string;
  portfolio?: string;
  github?: string;
}

export interface WorkExperience {
  id: string;
  company: string;
  title: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  achievements: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  location: string;
  startDate: string;
  endDate: string;
  gpa?: string;
}

export interface Skill {
  id: string;
  name: string;
  category: 'technical' | 'soft' | 'language' | 'tool';
  proficiency: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  expiryDate?: string;
  credentialId?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  link?: string;
  github?: string;
}

export interface Language {
  id: string;
  name: string;
  proficiency: 'basic' | 'conversational' | 'fluent' | 'native';
}

// Resume Template Types
export type ResumeTemplate = 'modern' | 'classic' | 'minimal' | 'creative' | 'professional';

export interface ResumeStyle {
  template: ResumeTemplate;
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  fontSize: 'small' | 'medium' | 'large';
  spacing: 'compact' | 'normal' | 'spacious';
}

// Job Types
export interface Job {
  id: string;
  title: string;
  company: Company;
  location: JobLocation;
  description: string;
  requirements: string[];
  responsibilities: string[];
  skills: string[];
  salary: Salary;
  employmentType: 'full-time' | 'part-time' | 'contract' | 'freelance' | 'internship';
  experienceLevel: 'entry' | 'mid' | 'senior' | 'executive';
  postedAt: Date;
  expiresAt?: Date;
  applicationUrl?: string;
  matchScore?: number;
  isRemote: boolean;
  isFeatured: boolean;
}

export interface Company {
  id: string;
  name: string;
  logo?: string;
  website?: string;
  description?: string;
  size: 'startup' | 'small' | 'medium' | 'large' | 'enterprise';
  industry: string;
}

export interface JobLocation {
  city: string;
  state?: string;
  country: string;
  postalCode?: string;
  latitude?: number;
  longitude?: number;
  isRemote: boolean;
}

export interface Salary {
  min: number;
  max: number;
  currency: string;
  period: 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly';
  isNegotiable: boolean;
}

// Job Filter Types
export interface JobFilters {
  query?: string;
  location?: string;
  radius?: number;
  employmentType?: string[];
  experienceLevel?: string[];
  salaryMin?: number;
  salaryMax?: number;
  skills?: string[];
  isRemote?: boolean;
  postedWithin?: '24h' | '3d' | '7d' | '14d' | '30d';
}

// Application State Types
export interface AppState {
  resume: ResumeData | null;
  enhancedResume: ResumeData | null;
  jobs: Job[];
  filteredJobs: Job[];
  userLocation: UserLocation | null;
  locationPermission: 'granted' | 'denied' | 'prompt';
  selectedJob: Job | null;
  isLoading: boolean;
  error: string | null;
}

// Animation Types
export interface AnimationConfig {
  initial: object;
  animate: object;
  exit?: object;
  transition?: object;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Enhancement Suggestion Types
export interface EnhancementSuggestion {
  id: string;
  type: 'grammar' | 'formatting' | 'content' | 'keywords' | 'structure';
  section: string;
  original: string;
  suggestion: string;
  reason: string;
  priority: 'low' | 'medium' | 'high';
  applied: boolean;
}

export interface ResumeEnhancementResult {
  original: ResumeData;
  enhanced: ResumeData;
  suggestions: EnhancementSuggestion[];
  score: {
    original: number;
    enhanced: number;
  };
  keywordsAdded: string[];
  atsCompatibility: {
    original: number;
    enhanced: number;
  };
}

// Navigation Types
export type AppSection = 'home' | 'upload' | 'enhance' | 'jobs' | 'preview' | 'about';

// Theme Types
export type AppTheme = 'light' | 'dark' | 'system';
