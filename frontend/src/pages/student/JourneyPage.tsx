import React, { useState, useEffect } from 'react';
import { journeyService, studentService } from '../../services/api';
import { JourneyStep, StudentProfile } from '../../types';
import { 
  CheckCircle2, Circle, Sparkles, ArrowRight, 
  BookOpen, Award, CheckSquare, Target, Compass
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const JourneyPage: React.FC = () => {
  const [steps, setSteps] = useState<JourneyStep[]>([]);
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchJourney = async () => {
    setLoading(true);
    try {
      const [stepsData, profData] = await Promise.all([
        journeyService.getSteps(),
        studentService.getProfile().catch(() => null)
      ]);
      setSteps(stepsData);
      setProfile(profData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJourney();
  }, []);

  const handleToggle = async (stepId: number, currentStatus: boolean) => {
    try {
      // Optimistic update
      setSteps((prev) =>
        prev.map((s) => (s.id === stepId ? { ...s, is_completed: !currentStatus } : s))
      );
      await journeyService.toggleStep(stepId, !currentStatus);
    } catch (err) {
      console.error('Failed to toggle step', err);
      fetchJourney();
    }
  };

  const completedCount = steps.filter((s) => s.is_completed).length;
  const progressPercent = steps.length > 0 ? Math.round((completedCount / steps.length) * 100) : 0;
  const careerGoal = profile?.career_goal || 'AI & Software Engineer';

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-16 text-center space-y-3">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-xs text-slate-500 font-medium">Loading your personalized career journey...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner with Overall Progress Bar */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-2xs space-y-5">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold mb-2 border border-indigo-200">
              <Compass className="w-3.5 h-3.5 text-indigo-600" />
              Strategic Career Roadmap
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Internship Journey: {careerGoal}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Check off completed milestones to track your readiness for competitive openings.
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Roadmap Progress
            </span>
            <span className="text-3xl font-black text-indigo-600">{progressPercent}%</span>
            <span className="text-[11px] text-slate-500 block">
              {completedCount} of {steps.length} milestones completed
            </span>
          </div>
        </div>

        {/* Visual Progress Bar */}
        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-600 to-emerald-500 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Interactive Milestones List */}
      <div className="space-y-4">
        {steps.map((step) => (
          <div
            key={step.id}
            onClick={() => handleToggle(step.id, step.is_completed)}
            className={`p-5 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 select-none ${
              step.is_completed
                ? 'bg-emerald-50/40 border-emerald-200 hover:bg-emerald-50/60'
                : 'bg-white border-slate-200/90 hover:border-indigo-300 hover:shadow-xs'
            }`}
          >
            {/* Checkbox Icon */}
            <div className="mt-0.5 flex-shrink-0">
              {step.is_completed ? (
                <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              ) : (
                <div className="w-6 h-6 rounded-lg border-2 border-slate-300 hover:border-indigo-500 flex items-center justify-center">
                  <Circle className="w-3.5 h-3.5 text-transparent" />
                </div>
              )}
            </div>

            {/* Step Body */}
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between gap-2">
                <h3
                  className={`text-sm font-bold transition ${
                    step.is_completed ? 'line-through text-slate-400' : 'text-slate-900'
                  }`}
                >
                  Step {step.step_number}: {step.title}
                </h3>
                {step.is_completed ? (
                  <span className="text-[10px] font-bold uppercase text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-md">
                    Completed
                  </span>
                ) : (
                  <span className="text-[10px] font-bold uppercase text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                    In Progress
                  </span>
                )}
              </div>

              {step.description && (
                <p className="text-xs text-slate-500 leading-relaxed">{step.description}</p>
              )}

              {step.skills && (
                <div className="pt-1.5 flex flex-wrap gap-1.5">
                  {step.skills.split(',').map((sk, i) => (
                    <span
                      key={i}
                      className="text-[10px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md"
                    >
                      {sk.trim()}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom CTA to Apply */}
      <div className="p-6 rounded-3xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="font-bold text-sm">Ready to put your skills to the test?</h4>
          <p className="text-xs text-slate-400">
            Browse verified internships matching your journey progress.
          </p>
        </div>
        <Link
          to="/internships"
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-sm whitespace-nowrap"
        >
          <span>Find Matching Roles</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

    </div>
  );
};
