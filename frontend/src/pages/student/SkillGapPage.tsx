import React, { useState, useEffect } from 'react';
import { skillGapService } from '../../services/api';
import { SkillGapAnalysisData } from '../../types';
import { 
  TrendingUp, CheckCircle2, AlertCircle, BookOpen, 
  Clock, Award, ExternalLink, ArrowRight, Sparkles 
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const SkillGapPage: React.FC = () => {
  const [data, setData] = useState<SkillGapAnalysisData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    skillGapService.getAnalysis()
      .then((res) => setData(res))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto py-16 text-center space-y-3">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-xs text-slate-500 font-medium">Computing market skill gap distribution...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="max-w-3xl mx-auto py-12 text-center">
        <p className="text-xs text-slate-500">Skill gap data currently unavailable</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Page Header Banner */}
      <div className="bg-gradient-to-r from-violet-900 via-indigo-900 to-slate-900 p-8 rounded-3xl text-white shadow-lg space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/20 text-violet-200 text-xs font-semibold border border-violet-400/20">
          <TrendingUp className="w-3.5 h-3.5 text-violet-400" />
          Skill Gap Diagnostic
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
          Target Career Goal: {data.career_goal}
        </h1>
        <p className="text-xs sm:text-sm text-indigo-200 max-w-2xl leading-relaxed">
          We analyzed <strong>{data.total_analyzed_opportunities}</strong> verified opportunities across the <strong>{data.preferred_domain}</strong> track to compare your current toolkit against market requirements.
        </p>
      </div>

      {/* Toolkit Comparison: Current Skills vs High Priority Missing Skills */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Current Toolkit */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Your Current Verified Skills ({data.current_skills.length})
            </h3>
            <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
              Active in Profile
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {data.current_skills.map((skill, idx) => (
              <span
                key={idx}
                className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200/80 flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Missing Skills In High Demand */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-500" />
              Target Skills in Market Demand
            </h3>
            <span className="text-[10px] uppercase font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
              High Impact
            </span>
          </div>

          <div className="space-y-2">
            {data.top_missing_skills.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs"
              >
                <span className="font-bold text-slate-800">{item.skill}</span>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-400">
                    Required in {item.frequency} listings
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                    item.impact === 'High Priority'
                      ? 'bg-amber-50 text-amber-800 border-amber-200'
                      : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                  }`}>
                    {item.impact}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Recommended Structured Learning Paths */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-600" />
              Recommended Modular Learning Paths
            </h2>
            <p className="text-xs text-slate-500">
              Curated roadmaps tailored to bridge your exact prerequisites
            </p>
          </div>
          <Link to="/journey" className="text-xs font-bold text-indigo-600 hover:underline">
            View in Journey Planner →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {data.learning_recommendations.map((course, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-2xs hover:shadow-md transition flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200">
                    {course.skill}
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {course.duration}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900">{course.title}</h3>
                <p className="text-xs text-slate-500">{course.provider}</p>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs text-slate-600">
                  <span className="font-semibold text-slate-800 block mb-0.5">Focus areas:</span>
                  {course.focus}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between text-xs">
                <span className="font-medium text-slate-400">{course.difficulty}</span>
                <Link
                  to="/journey"
                  className="font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                >
                  Add to Journey <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
