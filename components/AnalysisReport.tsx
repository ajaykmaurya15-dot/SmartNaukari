
import React from 'react';
import { AnalysisResult } from '../types.ts';
import { CheckCircle2, AlertCircle, Award, BookOpen, Briefcase, Zap, Search } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Label } from 'recharts';

interface AnalysisReportProps {
  result: AnalysisResult;
  onReset: () => void;
}

export const AnalysisReport: React.FC<AnalysisReportProps> = ({ result, onReset }) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#f59e0b';
    return '#ef4444';
  };

  const ScoreDonut = ({ score, label, color }: { score: number, label: string, color: string }) => {
    const data = [{ value: score }, { value: 100 - score }];
    return (
      <div className="flex flex-col items-center">
        <div className="h-40 w-40 relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} cx="50%" cy="50%" innerRadius={50} outerRadius={65} startAngle={90} endAngle={-270} dataKey="value" stroke="none">
                <Cell key="score" fill={color} />
                <Cell key="rest" fill="#f1f5f9" />
                <Label value={`${score}%`} position="center" style={{ fontSize: '1.5rem', fontWeight: '800', fill: '#1e293b' }} />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">{label}</span>
      </div>
    );
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-8">
      
      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-6 rounded-3xl shadow-sm border border-slate-200 flex flex-col items-center justify-center">
          <ScoreDonut score={result.score} label="Profile Strength" color={getScoreColor(result.score)} />
        </div>
        
        <div className="glass-panel p-6 rounded-3xl shadow-sm border border-slate-200 flex flex-col items-center justify-center">
          <ScoreDonut score={result.matchScore || 0} label="Job Alignment" color="#6366f1" />
        </div>

        <div className="glass-panel p-6 rounded-3xl shadow-sm border border-slate-200 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-indigo-600">
              <Briefcase size={20} />
              <h3 className="font-bold">Target Role</h3>
            </div>
            <p className="text-2xl font-bold text-slate-800 leading-tight">
              {result.roleMatch || "General Professional"}
            </p>
          </div>
          <div className="mt-4 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {result.skillsFound.slice(0, 3).map((s, i) => (
              <span key={i} className="text-[10px] bg-slate-100 px-2 py-1 rounded text-slate-500 font-bold whitespace-nowrap">#{s}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <section className="glass-panel p-8 rounded-3xl shadow-sm border border-slate-200">
            <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Award className="text-amber-500" /> Executive Analysis
            </h3>
            <p className="text-slate-600 leading-relaxed text-lg italic">"{result.summary}"</p>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-emerald-50/50 border border-emerald-100 rounded-3xl p-6">
              <h4 className="flex items-center gap-2 text-emerald-700 font-bold mb-4">
                <CheckCircle2 size={20} /> Highlighted Strengths
              </h4>
              <ul className="space-y-3">
                {result.strengths.map((s, i) => (
                  <li key={i} className="flex gap-3 text-sm text-emerald-800">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0" /> {s}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-rose-50/50 border border-rose-100 rounded-3xl p-6">
              <h4 className="flex items-center gap-2 text-rose-700 font-bold mb-4">
                <AlertCircle size={20} /> Missing Elements
              </h4>
              <ul className="space-y-3">
                {result.weaknesses.map((w, i) => (
                  <li key={i} className="flex gap-3 text-sm text-rose-800">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-rose-400 shrink-0" /> {w}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <section className="bg-slate-900 text-white p-8 rounded-3xl shadow-xl relative overflow-hidden">
            <Zap className="absolute -top-4 -right-4 w-24 h-24 text-white/5 rotate-12" />
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2 relative z-10">
              <BookOpen size={20} className="text-indigo-400" /> Improvement Plan
            </h3>
            <div className="space-y-6 relative z-10">
              {result.improvements.map((item, i) => (
                <div key={i} className="flex gap-4 group">
                  <div className="shrink-0 w-6 h-6 rounded-full bg-indigo-500 text-[10px] flex items-center justify-center font-black">
                    0{i+1}
                  </div>
                  <p className="text-sm text-slate-300 group-hover:text-white transition-colors">{item}</p>
                </div>
              ))}
            </div>
          </section>

          {result.keywordGaps && result.keywordGaps.length > 0 && (
            <div className="glass-panel p-6 rounded-3xl border border-amber-100 bg-amber-50/20">
              <h4 className="flex items-center gap-2 text-amber-700 font-bold mb-3 text-sm">
                <Search size={16} /> Keyword Gaps
              </h4>
              <div className="flex flex-wrap gap-2">
                {result.keywordGaps.map((k, i) => (
                  <span key={i} className="bg-white border border-amber-200 text-amber-600 px-3 py-1 rounded-full text-xs font-medium">
                    {k}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-center pt-8">
        <button 
          onClick={onReset}
          className="px-10 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold shadow-lg shadow-indigo-200 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          Analyze Another Candidate
        </button>
      </div>
    </div>
  );
};
