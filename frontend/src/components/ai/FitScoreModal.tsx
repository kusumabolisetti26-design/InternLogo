import React from 'react';
import { Modal } from '../common/Modal';
import { FitScoreBreakdown } from '../../types';
import { Sparkles, CheckCircle2, AlertCircle, TrendingUp, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

interface FitScoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  internshipTitle: string;
  companyName: string;
  breakdown: FitScoreBreakdown | null;
}

export const FitScoreModal: React.FC<FitScoreModalProps> = ({
  isOpen,
  onClose,
  internshipTitle,
  companyName,
  breakdown
}) => {
  if (!breakdown) return null;

  const factors = [
    { label: 'Skills Match', weight: '35%', score: breakdown.skill_match, color: 'bg-indigo-500' },
    { label: 'Career Alignment', weight: '25%', score: breakdown.career_alignment, color: 'bg-blue-500' },
    { label: 'Academic Qualification', weight: '15%', score: breakdown.qualification_match, color: 'bg-emerald-500' },
    { label: 'Domain & Interest Match', weight: '15%', score: breakdown.interest_match, color: 'bg-violet-500' },
    { label: 'Experience & Work Mode', weight: '10%', score: breakdown.experience_match, color: 'bg-amber-500' },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="AI Fit Score Diagnostic" maxWidth="xl">
      <div className="space-y-6">
        {/* Header Summary */}
        <div className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r from-indigo-50/70 to-slate-50 border border-indigo-100">
          <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-white border border-indigo-200 shadow-sm min-w-[90px]">
            <span className="text-xs font-semibold text-slate-500">Overall Fit</span>
            <span className="text-3xl font-extrabold text-indigo-600">{breakdown.overall_fit}%</span>
          </div>
          <div>
            <h4 className="font-semibold text-slate-900 text-base">{internshipTitle}</h4>
            <p className="text-sm text-slate-500">{companyName}</p>
            <p className="text-xs text-indigo-700 mt-2 font-medium leading-relaxed bg-white/80 p-2 rounded-lg border border-indigo-100/80">
              💡 {breakdown.explanation}
            </p>
          </div>
        </div>

        {/* 5-Factor Weighted Breakdown */}
        <div className="space-y-3">
          <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Weighted Score Breakdown
          </h5>
          <div className="space-y-2.5">
            {factors.map((f, idx) => (
              <div key={idx} className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <span className="font-medium text-slate-700">
                    {f.label} <span className="text-slate-400">({f.weight})</span>
                  </span>
                  <span className="font-bold text-slate-900">{f.score}%</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${f.color} rounded-full transition-all duration-500`}
                    style={{ width: `${f.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Matched vs Missing Skills */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-3.5 rounded-xl border border-emerald-100 bg-emerald-50/40">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800 mb-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Matched Skills ({breakdown.matched_skills.length})
            </div>
            <div className="flex flex-wrap gap-1.5">
              {breakdown.matched_skills.length > 0 ? (
                breakdown.matched_skills.map((s, i) => (
                  <span key={i} className="text-xs bg-white text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-md font-medium">
                    {s}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-400">No direct skills matched yet</span>
              )}
            </div>
          </div>

          <div className="p-3.5 rounded-xl border border-amber-100 bg-amber-50/40">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-800 mb-2">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              Skills to Bridge ({breakdown.missing_skills.length})
            </div>
            <div className="flex flex-wrap gap-1.5">
              {breakdown.missing_skills.length > 0 ? (
                breakdown.missing_skills.map((s, i) => (
                  <span key={i} className="text-xs bg-white text-amber-700 border border-amber-200 px-2 py-0.5 rounded-md font-medium">
                    {s}
                  </span>
                ))
              ) : (
                <span className="text-xs text-emerald-600 font-medium">You meet all core skill prerequisites!</span>
              )}
            </div>
          </div>
        </div>

        {/* Action Link to Skill Gap Planner */}
        <div className="pt-2 flex justify-between items-center border-t border-slate-100">
          <Link
            to="/skill-gap"
            onClick={onClose}
            className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
          >
            <BookOpen className="w-3.5 h-3.5" />
            View Curated Learning Roadmaps →
          </Link>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition"
          >
            Done
          </button>
        </div>
      </div>
    </Modal>
  );
};
