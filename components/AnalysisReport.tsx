import React from 'react';
import { AnalysisResult } from '../types';
import { CheckCircle2, XCircle, AlertCircle, Award, Target, BookOpen } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Label } from 'recharts';

interface AnalysisReportProps {
  result: AnalysisResult;
  onReset: () => void;
}

export const AnalysisReport: React.FC<AnalysisReportProps> = ({ result, onReset }) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return '#10b981'; // Emerald 500
    if (score >= 60) return '#f59e0b'; // Amber 500
    return '#ef4444'; // Red 500
  };

  const scoreData = [
    { name: 'Score', value: result.score },
    { name: 'Remaining', value: 100 - result.score }
  ];

  return (
    <div className="animate-fade-in-up space-y-8">
      
      {/* Top Section: Score and Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Score Card */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col items-center justify-center text-center shadow-sm">
          <h3 className="text-slate-500 font-medium mb-4 uppercase tracking-wider text-sm">Resume Score</h3>
          <div className="h-48 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={scoreData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  startAngle={90}
                  endAngle={-270}
                  dataKey="value"
                  stroke="none"
                >
                  <Cell key="score" fill={getScoreColor(result.score)} />
                  <Cell key="rest" fill="#e2e8f0" />
                  <Label 
                    value={`${result.score}`} 
                    position="center" 
                    className="text-4xl font-bold fill-slate-800"
                    style={{ fontSize: '2.5rem', fontWeight: '800' }} 
                  />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 mt-8 text-xs font-medium text-slate-400">
              / 100
            </div>
          </div>
          <p className="mt-2 text-sm text-slate-500">
            {result.score >= 80 ? 'Excellent job!' : result.score >= 60 ? 'Good start, needs polish.' : 'Needs significant improvement.'}
          </p>
        </div>

        {/* Summary Card */}
        <div className="glass-panel p-6 rounded-2xl md:col-span-2 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4 text-indigo-600">
              <Award size={20} />
              <h3 className="font-semibold text-lg">Executive Summary</h3>
            </div>
            <p className="text-slate-600 leading-relaxed text-sm md:text-base">
              {result.summary}
            </p>
          </div>
          
          <div className="mt-6 pt-6 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3 flex items-center gap-2">
              <Target size={14} /> Identified Skills
            </h4>
            <div className="flex flex-wrap gap-2">
              {result.skillsFound.map((skill, idx) => (
                <span key={idx} className="px-3 py-1 bg-slate-100 text-slate-600 text-xs rounded-full font-medium border border-slate-200">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Strengths & Weaknesses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Strengths */}
        <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-6">
          <h3 className="flex items-center gap-2 text-emerald-700 font-semibold mb-4 text-lg">
            <CheckCircle2 size={24} />
            Strengths
          </h3>
          <ul className="space-y-3">
            {result.strengths.map((item, idx) => (
              <li key={idx} className="flex items-start gap-3 text-emerald-900 text-sm">
                <span className="mt-1 h-2 w-2 rounded-full bg-emerald-400 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Weaknesses */}
        <div className="bg-red-50/50 border border-red-100 rounded-2xl p-6">
          <h3 className="flex items-center gap-2 text-red-700 font-semibold mb-4 text-lg">
            <XCircle size={24} />
            Areas for Improvement
          </h3>
          <ul className="space-y-3">
            {result.weaknesses.map((item, idx) => (
              <li key={idx} className="flex items-start gap-3 text-red-900 text-sm">
                <span className="mt-1 h-2 w-2 rounded-full bg-red-400 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Action Plan */}
      <div className="glass-panel rounded-2xl p-8 border-l-4 border-l-indigo-500 shadow-md">
        <h3 className="flex items-center gap-2 text-slate-800 font-bold text-xl mb-6">
          <BookOpen size={24} className="text-indigo-500" />
          Recommended Actions
        </h3>
        <div className="space-y-4">
          {result.improvements.map((action, idx) => (
            <div key={idx} className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm">
                {idx + 1}
              </div>
              <p className="text-slate-700 pt-1 leading-relaxed">
                {action}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center pt-8">
        <button 
          onClick={onReset}
          className="px-8 py-3 bg-slate-900 text-white rounded-xl font-medium shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
        >
          Analyze Another Resume
        </button>
      </div>

    </div>
  );
};
