import { useState, useEffect, useCallback } from 'react';
import type { Job, JobFilters, UserLocation } from '@/types';
import { calculateDistance } from './useLocation';

interface UseJobsReturn {
  jobs: Job[];
  filteredJobs: Job[];
  isLoading: boolean;
  error: string | null;
  filters: JobFilters;
  setFilters: (filters: JobFilters) => void;
  refreshJobs: () => Promise<void>;
  applyFilters: (filters: JobFilters) => void;
  clearFilters: () => void;
}

// Mock jobs data - India focused
const mockJobs: Job[] = [
  {
    id: '1',
    title: 'Senior Full Stack Developer',
    company: {
      id: 'c1',
      name: 'Flipkart',
      size: 'large',
      industry: 'E-commerce',
    },
    location: {
      city: 'Bangalore',
      state: 'Karnataka',
      country: 'India',
      latitude: 12.9716,
      longitude: 77.5946,
      isRemote: true,
    },
    description: 'We are looking for an experienced Full Stack Developer to join our engineering team at Flipkart. You will be responsible for developing and maintaining scalable web applications serving millions of users.',
    requirements: [
      '5+ years of experience in full-stack development',
      'Strong proficiency in React, Node.js, and TypeScript',
      'Experience with cloud platforms (AWS/GCP)',
      'Bachelor\'s degree in Computer Science or related field',
    ],
    responsibilities: [
      'Develop and maintain high-scale web applications',
      'Collaborate with cross-functional teams',
      'Mentor junior developers',
      'Participate in code reviews and architectural decisions',
    ],
    skills: ['React', 'Node.js', 'TypeScript', 'AWS', 'MongoDB'],
    salary: {
      min: 2500000,
      max: 4500000,
      currency: 'INR',
      period: 'yearly',
      isNegotiable: true,
    },
    employmentType: 'full-time',
    experienceLevel: 'senior',
    postedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    isRemote: true,
    isFeatured: true,
    matchScore: 95,
  },
  {
    id: '2',
    title: 'Frontend Engineer',
    company: {
      id: 'c2',
      name: 'Zoho',
      size: 'large',
      industry: 'SaaS',
    },
    location: {
      city: 'Chennai',
      state: 'Tamil Nadu',
      country: 'India',
      latitude: 13.0827,
      longitude: 80.2707,
      isRemote: false,
    },
    description: 'Join our fast-paced team at Zoho as a Frontend Engineer. Work on cutting-edge SaaS products with a talented team.',
    requirements: [
      '3+ years of frontend development experience',
      'Expert in React and modern JavaScript',
      'Experience with state management (Redux/Zustand)',
      'Strong UI/UX sensibilities',
    ],
    responsibilities: [
      'Build responsive and performant user interfaces',
      'Optimize application performance',
      'Work closely with designers and product managers',
    ],
    skills: ['React', 'TypeScript', 'Redux', 'CSS', 'Webpack'],
    salary: {
      min: 1200000,
      max: 2000000,
      currency: 'INR',
      period: 'yearly',
      isNegotiable: true,
    },
    employmentType: 'full-time',
    experienceLevel: 'mid',
    postedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    isRemote: false,
    isFeatured: false,
    matchScore: 88,
  },
  {
    id: '3',
    title: 'Software Engineer - Backend',
    company: {
      id: 'c3',
      name: 'Paytm',
      size: 'large',
      industry: 'Fintech',
    },
    location: {
      city: 'Noida',
      state: 'Uttar Pradesh',
      country: 'India',
      latitude: 28.5355,
      longitude: 77.3910,
      isRemote: true,
    },
    description: 'Build scalable backend systems that power millions of transactions at Paytm. Join our backend team and make an impact in the fintech space.',
    requirements: [
      '4+ years of backend development experience',
      'Strong in Java, Python, or Go',
      'Experience with distributed systems',
      'Knowledge of microservices architecture',
    ],
    responsibilities: [
      'Design and implement scalable APIs',
      'Optimize database performance',
      'Build and maintain microservices',
    ],
    skills: ['Java', 'Spring Boot', 'Kafka', 'PostgreSQL', 'Redis'],
    salary: {
      min: 2000000,
      max: 3500000,
      currency: 'INR',
      period: 'yearly',
      isNegotiable: true,
    },
    employmentType: 'full-time',
    experienceLevel: 'senior',
    postedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    isRemote: true,
    isFeatured: true,
    matchScore: 82,
  },
  {
    id: '4',
    title: 'React Developer',
    company: {
      id: 'c4',
      name: 'Freshworks',
      size: 'large',
      industry: 'SaaS',
    },
    location: {
      city: 'Chennai',
      state: 'Tamil Nadu',
      country: 'India',
      latitude: 13.0827,
      longitude: 80.2707,
      isRemote: true,
    },
    description: 'Create stunning web experiences for our global customer base at Freshworks. Work on projects ranging from customer support to sales automation.',
    requirements: [
      '2+ years of React experience',
      'Strong JavaScript/TypeScript skills',
      'Experience with Next.js preferred',
      'Portfolio of previous work',
    ],
    responsibilities: [
      'Develop customer-facing web applications',
      'Collaborate with design and product teams',
      'Ensure cross-browser compatibility',
    ],
    skills: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'GraphQL'],
    salary: {
      min: 1000000,
      max: 1800000,
      currency: 'INR',
      period: 'yearly',
      isNegotiable: true,
    },
    employmentType: 'full-time',
    experienceLevel: 'mid',
    postedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    isRemote: true,
    isFeatured: false,
    matchScore: 90,
  },
  {
    id: '5',
    title: 'DevOps Engineer',
    company: {
      id: 'c5',
      name: 'Infosys',
      size: 'enterprise',
      industry: 'IT Services',
    },
    location: {
      city: 'Pune',
      state: 'Maharashtra',
      country: 'India',
      latitude: 18.5204,
      longitude: 73.8567,
      isRemote: false,
    },
    description: 'Join our DevOps team at Infosys to build and maintain cloud infrastructure for enterprise clients. Help us scale to meet growing demand.',
    requirements: [
      '3+ years of DevOps experience',
      'Strong AWS/Azure knowledge',
      'Experience with Terraform and Kubernetes',
      'Scripting skills (Python/Bash)',
    ],
    responsibilities: [
      'Manage cloud infrastructure for clients',
      'Implement CI/CD pipelines',
      'Monitor system performance',
      'Ensure security compliance',
    ],
    skills: ['AWS', 'Terraform', 'Kubernetes', 'Docker', 'Jenkins'],
    salary: {
      min: 800000,
      max: 1500000,
      currency: 'INR',
      period: 'yearly',
      isNegotiable: true,
    },
    employmentType: 'full-time',
    experienceLevel: 'mid',
    postedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    isRemote: false,
    isFeatured: true,
    matchScore: 75,
  },
  {
    id: '6',
    title: 'Full Stack Engineer',
    company: {
      id: 'c6',
      name: 'Razorpay',
      size: 'medium',
      industry: 'Fintech',
    },
    location: {
      city: 'Bangalore',
      state: 'Karnataka',
      country: 'India',
      latitude: 12.9716,
      longitude: 77.5946,
      isRemote: true,
    },
    description: 'Build the future of payments in India at Razorpay. Work on secure, scalable systems that handle millions of transactions daily.',
    requirements: [
      '4+ years of full-stack experience',
      'Strong in Node.js and React',
      'Experience with payment systems preferred',
      'Knowledge of security best practices',
    ],
    responsibilities: [
      'Develop payment processing applications',
      'Ensure system security and compliance',
      'Optimize transaction processing',
    ],
    skills: ['Node.js', 'React', 'PostgreSQL', 'Redis', 'Docker'],
    salary: {
      min: 2200000,
      max: 4000000,
      currency: 'INR',
      period: 'yearly',
      isNegotiable: true,
    },
    employmentType: 'full-time',
    experienceLevel: 'senior',
    postedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    isRemote: true,
    isFeatured: false,
    matchScore: 85,
  },
  {
    id: '7',
    title: 'Junior Software Developer',
    company: {
      id: 'c7',
      name: 'Wipro',
      size: 'enterprise',
      industry: 'IT Services',
    },
    location: {
      city: 'Hyderabad',
      state: 'Telangana',
      country: 'India',
      latitude: 17.3850,
      longitude: 78.4867,
      isRemote: false,
    },
    description: 'Start your IT career with Wipro! We are looking for passionate freshers and junior developers eager to learn and grow in a supportive environment.',
    requirements: [
      '0-2 years of software development experience',
      'Knowledge of Java, Python, or JavaScript',
      'Good understanding of data structures and algorithms',
      'Strong problem-solving skills',
    ],
    responsibilities: [
      'Develop and maintain software applications',
      'Learn from senior developers and mentors',
      'Contribute to team projects',
      'Participate in code reviews',
    ],
    skills: ['Java', 'Python', 'JavaScript', 'SQL', 'Git'],
    salary: {
      min: 350000,
      max: 600000,
      currency: 'INR',
      period: 'yearly',
      isNegotiable: false,
    },
    employmentType: 'full-time',
    experienceLevel: 'entry',
    postedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
    isRemote: false,
    isFeatured: false,
    matchScore: 70,
  },
  {
    id: '8',
    title: 'Mobile App Developer',
    company: {
      id: 'c8',
      name: 'Ola',
      size: 'large',
      industry: 'Transportation',
    },
    location: {
      city: 'Bangalore',
      state: 'Karnataka',
      country: 'India',
      latitude: 12.9716,
      longitude: 77.5946,
      isRemote: true,
    },
    description: 'Build amazing mobile experiences for millions of Ola users. Work with React Native and native technologies to create world-class ride-hailing apps.',
    requirements: [
      '3+ years of mobile development',
      'Experience with React Native or Flutter',
      'Knowledge of iOS/Android native development',
      'Published apps in Play Store/App Store',
    ],
    responsibilities: [
      'Develop and maintain Ola consumer and driver apps',
      'Optimize app performance and user experience',
      'Implement new features and improvements',
    ],
    skills: ['React Native', 'TypeScript', 'iOS', 'Android', 'Firebase'],
    salary: {
      min: 1500000,
      max: 2800000,
      currency: 'INR',
      period: 'yearly',
      isNegotiable: true,
    },
    employmentType: 'full-time',
    experienceLevel: 'mid',
    postedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
    isRemote: true,
    isFeatured: false,
    matchScore: 65,
  },
];

export function useJobs(userLocation: UserLocation | null): UseJobsReturn {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<JobFilters>({});

  // Fetch jobs
  const refreshJobs = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Sort by match score and featured status
      const sortedJobs = [...mockJobs].sort((a, b) => {
        if (a.isFeatured && !b.isFeatured) return -1;
        if (!a.isFeatured && b.isFeatured) return 1;
        return (b.matchScore || 0) - (a.matchScore || 0);
      });

      setJobs(sortedJobs);
      setFilteredJobs(sortedJobs);
    } catch (err) {
      setError('Failed to fetch jobs. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Apply filters
  const applyFilters = useCallback((newFilters: JobFilters) => {
    setFilters(newFilters);
    
    let result = [...jobs];

    // Text search
    if (newFilters.query) {
      const query = newFilters.query.toLowerCase();
      result = result.filter(job =>
        job.title.toLowerCase().includes(query) ||
        job.company.name.toLowerCase().includes(query) ||
        job.description.toLowerCase().includes(query) ||
        job.skills.some(skill => skill.toLowerCase().includes(query))
      );
    }

    // Location filter with radius
    if (userLocation && newFilters.radius) {
      result = result.filter(job => {
        if (job.isRemote && newFilters.isRemote) return true;
        if (!job.location.latitude || !job.location.longitude) return false;
        
        const distance = calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          job.location.latitude,
          job.location.longitude
        );
        
        return distance <= newFilters.radius!;
      });
    }

    // Remote filter
    if (newFilters.isRemote !== undefined) {
      result = result.filter(job => job.isRemote === newFilters.isRemote);
    }

    // Employment type filter
    if (newFilters.employmentType && newFilters.employmentType.length > 0) {
      result = result.filter(job =>
        newFilters.employmentType!.includes(job.employmentType)
      );
    }

    // Experience level filter
    if (newFilters.experienceLevel && newFilters.experienceLevel.length > 0) {
      result = result.filter(job =>
        newFilters.experienceLevel!.includes(job.experienceLevel)
      );
    }

    // Salary filter
    if (newFilters.salaryMin) {
      result = result.filter(job => job.salary.max >= newFilters.salaryMin!);
    }
    if (newFilters.salaryMax) {
      result = result.filter(job => job.salary.min <= newFilters.salaryMax!);
    }

    // Skills filter
    if (newFilters.skills && newFilters.skills.length > 0) {
      result = result.filter(job =>
        newFilters.skills!.some(skill =>
          job.skills.some(jobSkill =>
            jobSkill.toLowerCase().includes(skill.toLowerCase())
          )
        )
      );
    }

    // Posted within filter
    if (newFilters.postedWithin) {
      const now = Date.now();
      const timeRanges: Record<string, number> = {
        '24h': 24 * 60 * 60 * 1000,
        '3d': 3 * 24 * 60 * 60 * 1000,
        '7d': 7 * 24 * 60 * 60 * 1000,
        '14d': 14 * 24 * 60 * 60 * 1000,
        '30d': 30 * 24 * 60 * 60 * 1000,
      };
      
      const maxAge = timeRanges[newFilters.postedWithin];
      result = result.filter(job =>
        now - job.postedAt.getTime() <= maxAge
      );
    }

    setFilteredJobs(result);
  }, [jobs, userLocation]);

  // Clear all filters
  const clearFilters = useCallback(() => {
    setFilters({});
    setFilteredJobs(jobs);
  }, [jobs]);

  // Initial load
  useEffect(() => {
    refreshJobs();
  }, [refreshJobs]);

  return {
    jobs,
    filteredJobs,
    isLoading,
    error,
    filters,
    setFilters,
    refreshJobs,
    applyFilters,
    clearFilters,
  };
}

// Format salary for display - shows LPA for INR
export function formatSalary(salary: Job['salary']): string {
  if (salary.currency === 'INR') {
    // Convert to LPA (Lakhs Per Annum)
    const minLPA = (salary.min / 100000).toFixed(1);
    const maxLPA = (salary.max / 100000).toFixed(1);
    return `₹${minLPA} - ₹${maxLPA} LPA`;
  }
  
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: salary.currency,
    maximumFractionDigits: 0,
  });

  const min = formatter.format(salary.min);
  const max = formatter.format(salary.max);
  const period = salary.period === 'yearly' ? '/year' : 
                 salary.period === 'monthly' ? '/month' :
                 salary.period === 'hourly' ? '/hour' : '';

  return `${min} - ${max}${period}`;
}

// Format date for display
export function formatPostedDate(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  
  const days = Math.floor(diff / (24 * 60 * 60 * 1000));
  const hours = Math.floor(diff / (60 * 60 * 1000));
  
  if (hours < 1) return 'Just now';
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
