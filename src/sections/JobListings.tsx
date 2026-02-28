import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Briefcase,
  MapPin,
  DollarSign,
  Clock,
  Search,
  Filter,
  X,
  Building2,
  Star,
  ExternalLink,
  Loader2,
  Navigation,
  CheckCircle,
} from 'lucide-react';
import type { Job, JobFilters, UserLocation } from '@/types';
import { formatSalary, formatPostedDate } from '@/hooks/useJobs';
import { calculateDistance, formatDistance } from '@/hooks/useLocation';

interface JobListingsProps {
  jobs: Job[];
  filteredJobs: Job[];
  isLoading: boolean;
  userLocation: UserLocation | null;
  locationPermission: 'granted' | 'denied' | 'prompt';
  onRequestLocation: () => void;
  filters: JobFilters;
  onApplyFilters: (filters: JobFilters) => void;
  onClearFilters: () => void;
}

export function JobListings({
  jobs,
  filteredJobs,
  isLoading,
  userLocation,
  locationPermission,
  onRequestLocation,
  filters,
  onApplyFilters,
  onClearFilters,
}: JobListingsProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [searchQuery, setSearchQuery] = useState(filters.query || '');
  const [radius, setRadius] = useState(filters.radius || 50);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onApplyFilters({ ...filters, query: searchQuery });
  };

  const handleRadiusChange = (value: number[]) => {
    setRadius(value[0]);
    onApplyFilters({ ...filters, radius: value[0] });
  };

  const getDistanceToJob = (job: Job): number | null => {
    if (!userLocation || !job.location.latitude || !job.location.longitude) {
      return null;
    }
    return calculateDistance(
      userLocation.latitude,
      userLocation.longitude,
      job.location.latitude,
      job.location.longitude
    );
  };

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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: 'easeOut' as const,
      },
    },
  };

  if (isLoading) {
    return (
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <Loader2 className="w-12 h-12 text-violet-600 animate-spin mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400">Loading jobs...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
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
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium mb-4"
            >
              <Briefcase className="w-4 h-4" />
              Step 3: Discover Your Perfect Job
            </motion.div>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 dark:text-slate-100 mb-4">
              Jobs Matched to Your Skills
            </h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
              Based on your enhanced resume, we've found these opportunities that match your skills and experience.
            </p>
          </div>

          {/* Location Permission Banner */}
          {locationPermission === 'prompt' && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 p-4 rounded-xl bg-gradient-to-r from-violet-100 to-purple-100 dark:from-violet-900/30 dark:to-purple-900/30 border border-violet-200 dark:border-violet-800"
            >
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-violet-500 flex items-center justify-center">
                    <Navigation className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800 dark:text-slate-100">
                      Enable Location for Better Results
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      We'll show you jobs near your location
                    </p>
                  </div>
                </div>
                <Button
                  onClick={onRequestLocation}
                  className="btn-gradient text-white whitespace-nowrap"
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  Allow Location Access
                </Button>
              </div>
            </motion.div>
          )}

          {/* Location Badge */}
          {locationPermission === 'granted' && userLocation && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-8 flex items-center justify-center"
            >
              <div className="location-badge">
                <CheckCircle className="w-4 h-4" />
                <span>
                  Showing jobs near {userLocation.city || 'your location'}
                </span>
              </div>
            </motion.div>
          )}

          {/* Search and Filters */}
          <div className="mb-8">
            <form onSubmit={handleSearch} className="flex gap-3 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Search jobs, companies, or skills..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 py-6 text-lg"
                />
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className={`px-4 ${showFilters ? 'bg-violet-50 dark:bg-violet-900/20 border-violet-300' : ''}`}
              >
                <Filter className="w-5 h-5 mr-2" />
                Filters
              </Button>
              <Button type="submit" className="btn-gradient text-white px-6">
                Search
              </Button>
            </form>

            {/* Filter Panel */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <Card className="p-6 rounded-xl border border-slate-200 dark:border-slate-700">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {/* Employment Type */}
                      <div>
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3 block">
                          Employment Type
                        </label>
                        <div className="space-y-2">
                          {['full-time', 'part-time', 'contract', 'freelance', 'internship'].map(
                            (type) => (
                              <div key={type} className="flex items-center">
                                <Checkbox
                                  id={type}
                                  checked={filters.employmentType?.includes(type)}
                                  onCheckedChange={(checked) => {
                                    const current = filters.employmentType || [];
                                    const updated = checked
                                      ? [...current, type]
                                      : current.filter((t) => t !== type);
                                    onApplyFilters({ ...filters, employmentType: updated });
                                  }}
                                />
                                <label
                                  htmlFor={type}
                                  className="ml-2 text-sm text-slate-600 dark:text-slate-400 capitalize"
                                >
                                  {type.replace('-', ' ')}
                                </label>
                              </div>
                            )
                          )}
                        </div>
                      </div>

                      {/* Experience Level */}
                      <div>
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3 block">
                          Experience Level
                        </label>
                        <div className="space-y-2">
                          {['entry', 'mid', 'senior', 'executive'].map((level) => (
                            <div key={level} className="flex items-center">
                              <Checkbox
                                id={level}
                                checked={filters.experienceLevel?.includes(level)}
                                onCheckedChange={(checked) => {
                                  const current = filters.experienceLevel || [];
                                  const updated = checked
                                    ? [...current, level]
                                    : current.filter((l) => l !== level);
                                  onApplyFilters({ ...filters, experienceLevel: updated });
                                }}
                              />
                              <label
                                htmlFor={level}
                                className="ml-2 text-sm text-slate-600 dark:text-slate-400 capitalize"
                              >
                                {level}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Remote Filter */}
                      <div>
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3 block">
                          Work Type
                        </label>
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <Checkbox
                              id="remote"
                              checked={filters.isRemote}
                              onCheckedChange={(checked) =>
                                onApplyFilters({ ...filters, isRemote: checked as boolean })
                              }
                            />
                            <label
                              htmlFor="remote"
                              className="ml-2 text-sm text-slate-600 dark:text-slate-400"
                            >
                              Remote Only
                            </label>
                          </div>
                        </div>
                      </div>

                      {/* Radius Slider */}
                      {userLocation && (
                        <div>
                          <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3 block">
                            Search Radius: {radius}km
                          </label>
                          <Slider
                            value={[radius]}
                            onValueChange={handleRadiusChange}
                            min={5}
                            max={200}
                            step={5}
                            className="mt-4"
                          />
                        </div>
                      )}
                    </div>

                    <div className="flex justify-end mt-6">
                      <Button variant="outline" onClick={onClearFilters} size="sm">
                        <X className="w-4 h-4 mr-2" />
                        Clear Filters
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Results Count */}
          <div className="mb-6 flex items-center justify-between">
            <p className="text-slate-600 dark:text-slate-400">
              Showing <span className="font-semibold text-slate-800 dark:text-slate-100">{filteredJobs.length}</span> of{' '}
              <span className="font-semibold text-slate-800 dark:text-slate-100">{jobs.length}</span> jobs
            </p>
          </div>

          {/* Job Cards */}
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {filteredJobs.map((job, index) => {
                const distance = getDistanceToJob(job);
                
                return (
                  <motion.div
                    key={job.id}
                    layout
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card
                      className="job-card p-6 rounded-xl cursor-pointer"
                      onClick={() => setSelectedJob(job)}
                    >
                      <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                        {/* Company Logo */}
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900/30 dark:to-purple-900/30 flex items-center justify-center flex-shrink-0">
                          <Building2 className="w-7 h-7 text-violet-600 dark:text-violet-400" />
                        </div>

                        {/* Job Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-start gap-2 mb-2">
                            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                              {job.title}
                            </h3>
                            {job.isFeatured && (
                              <Badge className="bg-gradient-to-r from-amber-400 to-orange-500 text-white">
                                <Star className="w-3 h-3 mr-1" />
                                Featured
                              </Badge>
                            )}
                            {job.matchScore && job.matchScore >= 85 && (
                              <Badge className="bg-gradient-to-r from-green-400 to-emerald-500 text-white">
                                {job.matchScore}% Match
                              </Badge>
                            )}
                          </div>

                          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 dark:text-slate-400 mb-3">
                            <span className="flex items-center gap-1">
                              <Building2 className="w-4 h-4" />
                              {job.company.name}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {job.location.city}, {job.location.state}
                              {job.isRemote && (
                                <Badge variant="secondary" className="ml-1 text-xs">
                                  Remote
                                </Badge>
                              )}
                            </span>
                            {distance !== null && (
                              <span className="flex items-center gap-1 text-violet-600 dark:text-violet-400">
                                <Navigation className="w-4 h-4" />
                                {formatDistance(distance)} away
                              </span>
                            )}
                          </div>

                          <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-2 mb-4">
                            {job.description}
                          </p>

                          {/* Skills */}
                          <div className="flex flex-wrap gap-2 mb-4">
                            {job.skills.slice(0, 5).map((skill) => (
                              <span
                                key={skill}
                                className="px-2 py-1 rounded-full text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                              >
                                {skill}
                              </span>
                            ))}
                            {job.skills.length > 5 && (
                              <span className="px-2 py-1 rounded-full text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                                +{job.skills.length - 5}
                              </span>
                            )}
                          </div>

                          {/* Footer */}
                          <div className="flex flex-wrap items-center gap-4 text-sm">
                            <span className="flex items-center gap-1 text-green-600 dark:text-green-400 font-medium">
                              <DollarSign className="w-4 h-4" />
                              {formatSalary(job.salary)}
                            </span>
                            <span className="flex items-center gap-1 text-slate-500 dark:text-slate-500">
                              <Clock className="w-4 h-4" />
                              {formatPostedDate(job.postedAt)}
                            </span>
                            <Badge variant="outline" className="capitalize">
                              {job.employmentType.replace('-', ' ')}
                            </Badge>
                            <Badge variant="outline" className="capitalize">
                              {job.experienceLevel}
                            </Badge>
                          </div>
                        </div>

                        {/* Action */}
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-shrink-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedJob(job);
                          }}
                        >
                          View Details
                          <ExternalLink className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {filteredJobs.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  <Search className="w-10 h-10 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-2">
                  No jobs found
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Try adjusting your filters or search query
                </p>
              </motion.div>
            )}
          </div>

          {/* Job Detail Dialog */}
          <Dialog open={!!selectedJob} onOpenChange={() => setSelectedJob(null)}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-auto">
              {selectedJob && (
                <>
                  <DialogHeader>
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900/30 dark:to-purple-900/30 flex items-center justify-center flex-shrink-0">
                        <Building2 className="w-8 h-8 text-violet-600 dark:text-violet-400" />
                      </div>
                      <div className="flex-1">
                        <DialogTitle className="text-xl mb-1">
                          {selectedJob.title}
                        </DialogTitle>
                        <DialogDescription className="flex flex-wrap items-center gap-3">
                          <span>{selectedJob.company.name}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {selectedJob.location.city}, {selectedJob.location.state}
                          </span>
                        </DialogDescription>
                      </div>
                    </div>
                  </DialogHeader>

                  <div className="mt-6 space-y-6">
                    {/* Quick Info */}
                    <div className="flex flex-wrap gap-3">
                      <Badge className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                        <DollarSign className="w-3 h-3 mr-1" />
                        {formatSalary(selectedJob.salary)}
                      </Badge>
                      <Badge variant="secondary" className="capitalize">
                        {selectedJob.employmentType.replace('-', ' ')}
                      </Badge>
                      <Badge variant="secondary" className="capitalize">
                        {selectedJob.experienceLevel}
                      </Badge>
                      {selectedJob.isRemote && (
                        <Badge className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                          Remote
                        </Badge>
                      )}
                    </div>

                    {/* Description */}
                    <div>
                      <h4 className="font-semibold text-slate-800 dark:text-slate-100 mb-2">
                        About the Role
                      </h4>
                      <p className="text-slate-600 dark:text-slate-400">
                        {selectedJob.description}
                      </p>
                    </div>

                    {/* Requirements */}
                    <div>
                      <h4 className="font-semibold text-slate-800 dark:text-slate-100 mb-2">
                        Requirements
                      </h4>
                      <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400">
                        {selectedJob.requirements.map((req, i) => (
                          <li key={i}>{req}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Responsibilities */}
                    <div>
                      <h4 className="font-semibold text-slate-800 dark:text-slate-100 mb-2">
                        Responsibilities
                      </h4>
                      <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400">
                        {selectedJob.responsibilities.map((resp, i) => (
                          <li key={i}>{resp}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Skills */}
                    <div>
                      <h4 className="font-semibold text-slate-800 dark:text-slate-100 mb-2">
                        Required Skills
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedJob.skills.map((skill) => (
                          <span
                            key={skill}
                            className="px-3 py-1 rounded-full text-sm bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Apply Button */}
                    <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                      <Button
                        className="w-full btn-gradient text-white py-6"
                        onClick={() => {
                          if (selectedJob.applicationUrl) {
                            window.open(selectedJob.applicationUrl, '_blank');
                          }
                        }}
                      >
                        Apply Now
                        <ExternalLink className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </DialogContent>
          </Dialog>
        </motion.div>
      </div>
    </section>
  );
}
