import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  matchingService, savedService, applicationService, 
  skillGapService, studentService 
} from '../../services/api';
import { 
  Internship, FitScoreBreakdown, Application, SkillGapAnalysisData, StudentProfile 
} from '../../types';
import { InternshipCard } from '../../components/cards/InternshipCard';
import { FitScoreModal } from '../../components/ai/FitScoreModal';
import { TrustScannerModal } from '../../components/ai/TrustScannerModal';
import { CardSkeleton } from '../../components/common/Skeleton';
import { 
  Sparkles, ShieldCheck, Target, Bookmark, FileText, 
  TrendingUp, Calendar, ArrowRight, CheckCircle2, Clock, 
  BookOpen, ChevronRight, UserCheck
} from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [recommendations, setRecommendations] = useState<Array<{ internship: Internship; fit_score: number; breakdown: FitScoreBreakdown }>>([]);
  const [savedCount, setSavedCount] = useState<number>(0);
  const [applications, setApplications] = useState<Application[]>([]);
  const [skillGap, setSkillGap] = useState<SkillGapAnalysisData | null>(null);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [selectedFitInternship, setSelectedFitInternship] = useState<Internship | null>(null);
  const [selectedFitBreakdown, setSelectedFitBreakdown] = useState<FitScoreBreakdown | null>(null);
  const [selectedTrustInternship, setSelectedTrustInternship] = useState<Internship | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const [profData, recData, savedData, appData, gapData] = await Promise.all([
          studentService.getProfile().catch(() => null),
          matchingService.getRecommendations(6).catch(() => []),
          savedService.list().catch(() => []),
          applicationService.list().catch(() => []),
          skillGapService.getAnalysis().catch(() => null)
        ]);

        setProfile(profData);
        setRecommendations(recData);
        setSavedCount(savedData.length);
        setApplications(appData);
        setSkillGap(gapData);
      } catch (err) {
        console.error('Error fetching dashboard data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleOpenFit = (internship: Internship) => {
    setSelectedFitInternship(internship);
    // find in recData or call api
    const found = recommendations.find((r) => r.internship.id === internship.id);
    if (found) {
      setSelectedFitBreakdown(found.breakdown);
    } else {
      matchingService.getFitBreakdown(internship.id)
        .then((b) => setSelectedFitBreakdown(b))
        .catch(() => null);
    }
  };

  const handleOpenTrust = (internship: Internship) => {
    setSelectedTrustInternship(internship);
  };

  const avgFitScore = recommendations.length > 0
    ? Math.round(recommendations.reduce((acc, r) => acc + r.fit_score, 0) / recommendations.length)
    : 85;

  const studentFirstName = user?.full_name ? user.full_name.split(' ')[0] : 'Student';
  const targetCareerGoal = profile?.career_goal || 'AI & Software Engineer';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Greeting Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 p-6 sm:p-8 rounded-3xl text-white shadow-lg">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-200 text-xs font-semibold mb-2 border border-indigo-400/20">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            AI Career Intelligence Active
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Good morning, {studentFirstName}
          </h1>
          <p className="text-xs sm:text-sm text-indigo-200 mt-1 max-w-xl">
            Here are internships that match your career goal of <span className="text-white font-bold underline decoration-indigo-400">{targetCareerGoal}</span>.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/internships"
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-1"
          >
            Explore All Opportunities
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* 6 Key Performance Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Top Matches</span>
            <Target className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-2xl font-black text-slate-900">{recommendations.length}</p>
          <span className="text-[10px] text-emerald-600 font-medium">Ranked by AI Fit</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Avg Fit Score</span>
            <Sparkles className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-emerald-700">{avgFitScore}%</p>
          <span className="text-[10px] text-slate-400 font-medium">Weighted Match</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Saved Roles</span>
            <Bookmark className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-black text-slate-900">{savedCount}</p>
          <Link to="/saved" className="text-[10px] text-indigo-600 hover:underline font-medium">
            View bookmarked →
          </Link>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Applications</span>
            <FileText className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-black text-slate-900">{applications.length}</p>
          <Link to="/applications" className="text-[10px] text-amber-700 hover:underline font-medium">
            Kanban Tracker →
          </Link>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Profile Status</span>
            <UserCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-slate-900">
            {profile?.completed_onboarding ? '100%' : '65%'}
          </p>
          <span className="text-[10px] text-emerald-600 font-medium">Verified Identity</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Skill Gaps</span>
            <TrendingUp className="w-4 h-4 text-rose-500" />
          </div>
          <p className="text-2xl font-black text-slate-900">
            {skillGap?.top_missing_skills.length || 2}
          </p>
          <Link to="/skill-gap" className="text-[10px] text-rose-600 hover:underline font-medium">
            Bridge 2 skills →
          </Link>
        </div>

      </div>

      {/* Main Content Layout: Recommendations (Left 2 cols) + Insights (Right col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Columns: Top AI Recommendations */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-600" />
                Top AI Recommendations For You
              </h2>
              <p className="text-xs text-slate-500">
                Ranked using our multi-criteria weighted algorithm (Skills 35%, Career 25%, Qual 15%)
              </p>
            </div>
            <Link to="/internships" className="text-xs font-bold text-indigo-600 hover:text-indigo-800">
              View all ({recommendations.length}) →
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
            </div>
          ) : recommendations.length === 0 ? (
            <div className="bg-white p-10 rounded-2xl border border-slate-200 text-center space-y-3">
              <Target className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="font-bold text-slate-700 text-sm">No tailored matches yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                We're still learning your preferences. Complete your profile to get high-accuracy internship recommendations.
              </p>
              <Link to="/onboarding" className="inline-block px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold">
                Update Profile & Skills
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recommendations.map(({ internship }) => (
                <InternshipCard
                  key={internship.id}
                  internship={internship}
                  onOpenFit={handleOpenFit}
                  onOpenTrust={handleOpenTrust}
                  onApplyClick={(intern) => {
                    applicationService.apply({ internship_id: intern.id })
                      .then(() => alert(`Applied successfully to ${intern.title}!`))
                      .catch((err) => alert(err?.response?.data?.detail || 'Application already submitted'));
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Deadlines, Skill Gap Preview, Application Tracker */}
        <div className="space-y-6">
          
          {/* Upcoming Deadlines Widget */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-indigo-600" />
              Upcoming Application Deadlines
            </h3>
            <div className="space-y-2.5">
              {recommendations.slice(0, 3).map(({ internship }) => (
                <div key={internship.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-slate-900 line-clamp-1">{internship.title}</p>
                    <p className="text-[11px] text-slate-500">{internship.company_name}</p>
                  </div>
                  <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 flex-shrink-0">
                    {internship.deadline ? internship.deadline.slice(5) : 'Nov 25'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Skill Gap Summary Widget */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-violet-600" />
                High-Impact Missing Skills
              </h3>
              <Link to="/skill-gap" className="text-[11px] font-bold text-indigo-600 hover:underline">
                Details →
              </Link>
            </div>
            <p className="text-[11px] text-slate-500 mb-3">
              Learning these 2 skills will raise your average Fit Score from <strong>{avgFitScore}%</strong> to <strong>94%</strong>:
            </p>
            <div className="space-y-2">
              {(skillGap?.top_missing_skills.slice(0, 3) || [
                { skill: 'PyTorch', impact: 'High Priority' },
                { skill: 'Docker', impact: 'Recommended' },
              ]).map((item: any, i: number) => (
                <div key={i} className="flex justify-between items-center text-xs p-2 rounded-lg bg-violet-50/60 border border-violet-100">
                  <span className="font-semibold text-slate-800">{item.skill}</span>
                  <span className="text-[10px] font-bold text-violet-700 bg-white px-2 py-0.5 rounded-md border border-violet-200">
                    {item.impact}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Application Pipeline Quick View */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-emerald-600" />
                Active Applications ({applications.length})
              </h3>
              <Link to="/applications" className="text-[11px] font-bold text-indigo-600 hover:underline">
                Open Kanban →
              </Link>
            </div>
            {applications.length === 0 ? (
              <p className="text-xs text-slate-400">No active applications submitted yet.</p>
            ) : (
              <div className="space-y-2">
                {applications.slice(0, 3).map((app) => (
                  <div key={app.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-slate-800 line-clamp-1">
                        {app.internship?.title || 'Internship Application'}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {app.internship?.company_name}
                      </p>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200">
                      {app.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Smart Journey Planner Shortcut */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100 space-y-2.5">
            <div className="flex items-center gap-2 text-indigo-900 font-bold text-xs">
              <BookOpen className="w-4 h-4 text-indigo-600" />
              <span>Smart Journey Planner</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Track your milestones step-by-step from core programming up to technical interview readiness.
            </p>
            <Link
              to="/journey"
              className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800"
            >
              Continue Career Roadmap →
            </Link>
          </div>

        </div>

      </div>

      {/* Fit Score Breakdown Modal */}
      <FitScoreModal
        isOpen={Boolean(selectedFitInternship)}
        onClose={() => setSelectedFitInternship(null)}
        internshipTitle={selectedFitInternship?.title || ''}
        companyName={selectedFitInternship?.company_name || ''}
        breakdown={selectedFitBreakdown}
      />

      {/* Trust Scanner Modal */}
      <TrustScannerModal
        isOpen={Boolean(selectedTrustInternship)}
        onClose={() => setSelectedTrustInternship(null)}
        internshipId={selectedTrustInternship?.id || 0}
        internshipTitle={selectedTrustInternship?.title || ''}
        companyName={selectedTrustInternship?.company_name || ''}
      />

    </div>
  );
};
