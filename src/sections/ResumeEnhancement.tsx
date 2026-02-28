import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sparkles,
  CheckCircle,
  XCircle,
  TrendingUp,
  FileText,
  Download,
  Eye,
  Palette,
  Check,
} from 'lucide-react';
import type { ResumeEnhancementResult, ResumeStyle, ResumeTemplate } from '@/types';

interface ResumeEnhancementProps {
  enhancementResult: ResumeEnhancementResult | null;
  isEnhancing: boolean;
  onApplySuggestion: (id: string) => void;
  onRejectSuggestion: (id: string) => void;
  onGenerateStyledResume: (style: ResumeStyle) => string;
}

const templates: { value: ResumeTemplate; label: string; icon: string }[] = [
  { value: 'modern', label: 'Modern', icon: 'M' },
  { value: 'classic', label: 'Classic', icon: 'C' },
  { value: 'minimal', label: 'Minimal', icon: 'm' },
  { value: 'creative', label: 'Creative', icon: 'Cr' },
  { value: 'professional', label: 'Professional', icon: 'P' },
];

const colors = [
  { value: 'blue', label: 'Blue', class: 'bg-blue-500' },
  { value: 'purple', label: 'Purple', class: 'bg-violet-500' },
  { value: 'green', label: 'Green', class: 'bg-emerald-500' },
  { value: 'red', label: 'Red', class: 'bg-red-500' },
  { value: 'orange', label: 'Orange', class: 'bg-orange-500' },
  { value: 'teal', label: 'Teal', class: 'bg-teal-500' },
];

export function ResumeEnhancement({
  enhancementResult,
  isEnhancing,
  onApplySuggestion,
  onRejectSuggestion,
  onGenerateStyledResume,
}: ResumeEnhancementProps) {
  const [selectedStyle, setSelectedStyle] = useState<ResumeStyle>({
    template: 'modern',
    primaryColor: 'blue',
    secondaryColor: 'purple',
    fontFamily: 'modern',
    fontSize: 'medium',
    spacing: 'normal',
  });
  const [previewOpen, setPreviewOpen] = useState(false);
  const [generatedHtml, setGeneratedHtml] = useState('');

  const handlePreview = () => {
    const html = onGenerateStyledResume(selectedStyle);
    setGeneratedHtml(html);
    setPreviewOpen(true);
  };

  const handleDownload = () => {
    const html = generatedHtml || onGenerateStyledResume(selectedStyle);
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'enhanced-resume.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: 'easeOut' as const,
      },
    },
  };

  if (isEnhancing) {
    return (
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="text-center"
          >
            <div className="relative w-32 h-32 mx-auto mb-8">
              <motion.div
                className="absolute inset-0 rounded-full border-4 border-violet-200 dark:border-violet-800"
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              />
              <motion.div
                className="absolute inset-2 rounded-full border-4 border-violet-400 dark:border-violet-600 border-t-transparent"
                animate={{ rotate: -360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles className="w-12 h-12 text-violet-600 dark:text-violet-400" />
              </div>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-slate-100 mb-4">
              Enhancing Your Resume with AI...
            </h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto">
              Our AI is analyzing your resume, adding ATS-optimized keywords, 
              and improving your content for better results.
            </p>
          </motion.div>
        </div>
      </section>
    );
  }

  if (!enhancementResult) return null;

  const { score, atsCompatibility, suggestions, keywordsAdded } = enhancementResult;

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
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 text-green-700 dark:text-green-300 text-sm font-medium mb-4"
            >
              <Sparkles className="w-4 h-4" />
              Step 2: AI Enhancement Complete
            </motion.div>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 dark:text-slate-100 mb-4">
              Your Resume is Enhanced!
            </h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
              Review the improvements and customize your resume style before downloading.
            </p>
          </div>

          {/* Score Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <motion.div variants={cardVariants}>
              <Card className="p-6 rounded-2xl border border-violet-200 dark:border-violet-800">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800 dark:text-slate-100">
                        Resume Score
                      </h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Overall quality improvement
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-violet-600 dark:text-violet-400">
                      {score.enhanced}
                    </div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">
                      from {score.original}
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-400">Before</span>
                    <span className="text-slate-600 dark:text-slate-400">After</span>
                  </div>
                  <div className="relative h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <motion.div
                      className="absolute left-0 top-0 h-full bg-gradient-to-r from-violet-500 to-purple-600 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${score.enhanced}%` }}
                      transition={{ duration: 1, delay: 0.3 }}
                    />
                  </div>
                </div>
              </Card>
            </motion.div>

            <motion.div variants={cardVariants}>
              <Card className="p-6 rounded-2xl border border-emerald-200 dark:border-emerald-800">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800 dark:text-slate-100">
                        ATS Compatibility
                      </h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Applicant tracking system score
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                      {atsCompatibility.enhanced}%
                    </div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">
                      from {atsCompatibility.original}%
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-400">Before</span>
                    <span className="text-slate-600 dark:text-slate-400">After</span>
                  </div>
                  <div className="relative h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <motion.div
                      className="absolute left-0 top-0 h-full bg-gradient-to-r from-emerald-500 to-green-600 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${atsCompatibility.enhanced}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                    />
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Keywords Added */}
          <motion.div variants={cardVariants} className="mb-8">
            <Card className="p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
              <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                Keywords Added for Better ATS Matching
              </h3>
              <div className="flex flex-wrap gap-2">
                {keywordsAdded.map((keyword, index) => (
                  <motion.span
                    key={keyword}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="px-3 py-1.5 rounded-full text-sm bg-gradient-to-r from-violet-100 to-purple-100 dark:from-violet-900/30 dark:to-purple-900/30 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-800"
                  >
                    + {keyword}
                  </motion.span>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Suggestions */}
          <motion.div variants={cardVariants} className="mb-8">
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="all">All Suggestions</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="applied">Applied</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-4">
                {suggestions.map((suggestion, index) => (
                  <motion.div
                    key={suggestion.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card
                      className={`p-4 rounded-xl border ${
                        suggestion.applied
                          ? 'border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-900/10'
                          : 'border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                            suggestion.applied
                              ? 'bg-green-100 dark:bg-green-900/30'
                              : 'bg-violet-100 dark:bg-violet-900/30'
                          }`}
                        >
                          {suggestion.applied ? (
                            <Check className="w-4 h-4 text-green-600" />
                          ) : (
                            <Sparkles className="w-4 h-4 text-violet-600" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge
                              variant={
                                suggestion.priority === 'high'
                                  ? 'destructive'
                                  : suggestion.priority === 'medium'
                                  ? 'default'
                                  : 'secondary'
                              }
                            >
                              {suggestion.priority}
                            </Badge>
                            <span className="text-sm text-slate-500 dark:text-slate-400 capitalize">
                              {suggestion.type}
                            </span>
                            <span className="text-sm text-slate-400">•</span>
                            <span className="text-sm text-slate-500 dark:text-slate-400 capitalize">
                              {suggestion.section}
                            </span>
                          </div>
                          <p className="text-slate-600 dark:text-slate-400 text-sm mb-2 line-through opacity-60">
                            {suggestion.original}
                          </p>
                          <p className="text-slate-800 dark:text-slate-200 text-sm mb-2">
                            {suggestion.suggestion}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-500">
                            {suggestion.reason}
                          </p>
                        </div>
                        {!suggestion.applied && (
                          <div className="flex gap-2 flex-shrink-0">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => onRejectSuggestion(suggestion.id)}
                              className="text-red-600 hover:bg-red-50"
                            >
                              <XCircle className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => onApplySuggestion(suggestion.id)}
                              className="bg-violet-600 hover:bg-violet-700"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </TabsContent>

              <TabsContent value="pending" className="space-y-4">
                {suggestions
                  .filter((s) => !s.applied)
                  .map((suggestion, index) => (
                    <motion.div
                      key={suggestion.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                        <div className="flex items-start gap-4">
                          <div className="w-8 h-8 rounded-lg bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center flex-shrink-0">
                            <Sparkles className="w-4 h-4 text-violet-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge
                                variant={
                                  suggestion.priority === 'high'
                                    ? 'destructive'
                                    : suggestion.priority === 'medium'
                                    ? 'default'
                                    : 'secondary'
                                }
                              >
                                {suggestion.priority}
                              </Badge>
                              <span className="text-sm text-slate-500 dark:text-slate-400 capitalize">
                                {suggestion.type}
                              </span>
                            </div>
                            <p className="text-slate-600 dark:text-slate-400 text-sm mb-2 line-through opacity-60">
                              {suggestion.original}
                            </p>
                            <p className="text-slate-800 dark:text-slate-200 text-sm mb-2">
                              {suggestion.suggestion}
                            </p>
                          </div>
                          <div className="flex gap-2 flex-shrink-0">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => onRejectSuggestion(suggestion.id)}
                            >
                              <XCircle className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => onApplySuggestion(suggestion.id)}
                              className="bg-violet-600 hover:bg-violet-700"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
              </TabsContent>

              <TabsContent value="applied" className="space-y-4">
                {suggestions
                  .filter((s) => s.applied)
                  .map((suggestion, index) => (
                    <motion.div
                      key={suggestion.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="p-4 rounded-xl border border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-900/10">
                        <div className="flex items-start gap-4">
                          <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                            <Check className="w-4 h-4 text-green-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-slate-800 dark:text-slate-200 text-sm">
                              {suggestion.suggestion}
                            </p>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
              </TabsContent>
            </Tabs>
          </motion.div>

          {/* Style Customization */}
          <motion.div variants={cardVariants}>
            <Card className="p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
              <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-2">
                <Palette className="w-5 h-5 text-violet-600" />
                Customize Your Resume Style
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Template Selection */}
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                    Template
                  </label>
                  <Select
                    value={selectedStyle.template}
                    onValueChange={(value) =>
                      setSelectedStyle({ ...selectedStyle, template: value as ResumeTemplate })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {templates.map((t) => (
                        <SelectItem key={t.value} value={t.value}>
                          {t.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Color Selection */}
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                    Primary Color
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {colors.map((color) => (
                      <button
                        key={color.value}
                        onClick={() =>
                          setSelectedStyle({ ...selectedStyle, primaryColor: color.value })
                        }
                        className={`w-8 h-8 rounded-full ${color.class} ${
                          selectedStyle.primaryColor === color.value
                            ? 'ring-2 ring-offset-2 ring-slate-400'
                            : ''
                        }`}
                        title={color.label}
                      />
                    ))}
                  </div>
                </div>

                {/* Font Size */}
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                    Font Size
                  </label>
                  <Select
                    value={selectedStyle.fontSize}
                    onValueChange={(value) =>
                      setSelectedStyle({
                        ...selectedStyle,
                        fontSize: value as ResumeStyle['fontSize'],
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Small</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="large">Large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Spacing */}
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                    Spacing
                  </label>
                  <Select
                    value={selectedStyle.spacing}
                    onValueChange={(value) =>
                      setSelectedStyle({
                        ...selectedStyle,
                        spacing: value as ResumeStyle['spacing'],
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="compact">Compact</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="spacious">Spacious</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      onClick={handlePreview}
                      className="flex-1 py-6"
                    >
                      <Eye className="w-5 h-5 mr-2" />
                      Preview Styled Resume
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
                    <DialogHeader>
                      <DialogTitle>Resume Preview</DialogTitle>
                    </DialogHeader>
                    <div
                      className="mt-4"
                      dangerouslySetInnerHTML={{ __html: generatedHtml }}
                    />
                  </DialogContent>
                </Dialog>

                <Button onClick={handleDownload} className="btn-gradient text-white flex-1 py-6">
                  <Download className="w-5 h-5 mr-2" />
                  Download Enhanced Resume
                </Button>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
