import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  internshipService, matchingService, trustService, 
  savedService, applicationService 
} from '../../services/api';
import { Internship, FitScoreBreakdown, TrustAnalysis } from '../../types';
import { DetailSkeleton } from '../../components/common/Skeleton';
import { Modal } from '../../components/common/Modal';
import { 
  Building2, MapPin, Briefcase, Calendar, Clock, 
  Sparkles, ShieldCheck, Bookmark, BookmarkCheck, 
  ArrowLeft, CheckCircle2, AlertTriangle, ExternalLink, 
  Flag, Send, Award
} from 'lucide-react';

export const InternshipDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [internship, setInternship] = useState<Internship | null>(null);
  const [fitBreakdown, setFitBreakdown] = useState<FitScoreBreakdown | null>(null);
  const [trustScan, setTrustScan] = useState<TrustAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  // Apply Modal state
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [applyNotes, setApplyNotes] = useState('');
  const [applying, setApplying] = useState(false);
  const [applicationSuccess, setApplicationSuccess] = useState(false);

  // Report Modal state
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState('Suspicious fee request');
  const [reportDetails, setReportDetails] = useState('');
  const [reporting, setReporting] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const internData = await internshipService.getById(Number(id));
        setInternship(internData);
        setIsSaved(internData.is_saved || false);

        // Fetch AI diagnostics and trust signals in parallel
        const [fit, trust] = await Promise.all([
          matchingService.getFitBreakdown(Number(id)).catch(() => null),
          trustService.getScan(Number(id)).catch(() => null)
        ]);
        setFitBreakdown(fit);
        setTrustScan(trust);
      } catch (err) {
        console.error('Failed to load internship detail', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  const handleToggleSave = async () => {
    if (!internship) return;
    try {
      if (isSaved) {
        await savedService.remove(internship.id);
        setIsSaved(false);
      } else {
        await savedService.save(internship.id);
        setIsSaved(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!internship) return;
    setApplying(true);
    try {
      await applicationService.apply({
        internship_id: internship.id,
        notes: applyNotes
      });
      setApplicationSuccess(true);
      setTimeout(() => {
        setApplyModalOpen(false);
        setApplicationSuccess(false);
        navigate('/applications');
      }, 1500);
    } catch (err: any) {
      alert(err?.response?.data?.detail || 'Application could not be submitted');
    } finally {
      setApplying(false);
    }
  };

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!internship) return;
    setReporting(true);
    try {
      await internshipService.report(internship.id, {
        reason: reportReason,
        details: reportDetails
      });
      alert('Thank you! Your report has been submitted to the InternLogo verification desk.');
      setReportModalOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setReporting(false);
    }
  };

  if (loading) {
    return <DetailSkeleton />;
  }

  if (!internship) {
    return (
      <div className="max-w-3xl mx-auto py-16 px-4 text-center">
        <h2 className="text-xl font-bold text-slate-900">Internship opportunity not found</h2>
        <Link to="/internships" className="text-xs font-bold text-indigo-600 mt-3 inline-block">
          ← Back to Discovery
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Back button */}
      <div>
        <Link
          to="/internships"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to all internships
        </Link>
      </div>

      {/* Main Role Header Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-700 text-xl overflow-hidden flex-shrink-0">
            {internship.company_logo ? (
              <img src={internship.company_logo} alt={internship.company_name} className="w-full h-full object-cover" />
            ) : (
              <Building2 className="w-8 h-8 text-slate-400" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-bold text-slate-600">{internship.company_name}</span>
              {internship.company_verified && (
                <span className="text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-blue-600" />
                  Verified Organization
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
              {internship.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {internship.location} ({internship.work_mode})
              </span>
              <span className="flex items-center gap-1 font-bold text-slate-900">
                <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                {internship.stipend}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                {internship.duration}
              </span>
              <span className="flex items-center gap-1 text-amber-700 font-medium">
                <Clock className="w-3.5 h-3.5 text-amber-500" />
                Deadline: {internship.deadline || 'Rolling basis'}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={handleToggleSave}
            className={`p-3 rounded-2xl border transition flex items-center gap-1 text-xs font-semibold ${
              isSaved
                ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
            }`}
          >
            {isSaved ? <BookmarkCheck className="w-4 h-4 text-indigo-600" /> : <Bookmark className="w-4 h-4" />}
            <span>{isSaved ? 'Bookmarked' : 'Save'}</span>
          </button>

          {internship.application_status ? (
            <span className="px-5 py-3 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold text-xs">
              Status: {internship.application_status}
            </span>
          ) : (
            <button
              onClick={() => setApplyModalOpen(true)}
              className="flex-1 sm:flex-initial px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-2xl shadow-md transition"
            >
              Apply for Role
            </button>
          )}

          <button
            onClick={() => setReportModalOpen(true)}
            className="p-3 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-2xl transition border border-transparent"
            title="Report Suspicious Opportunity"
          >
            <Flag className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Two Column Layout: Detailed Description vs AI Diagnostics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Opportunity Scope & Qualifications */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* About Role */}
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/90 shadow-2xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              About the Role
            </h3>
            <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
              {internship.description}
            </p>
          </div>

          {/* Key Responsibilities */}
          {internship.responsibilities && (
            <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/90 shadow-2xs space-y-3">
              <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
                Key Responsibilities
              </h3>
              <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                {internship.responsibilities}
              </p>
            </div>
          )}

          {/* Prerequisites & Skills */}
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/90 shadow-2xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              Prerequisites & Requirements
            </h3>
            {internship.requirements && (
              <p className="text-xs text-slate-700 leading-relaxed mb-4">
                {internship.requirements}
              </p>
            )}

            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Required Core Skills
              </span>
              <div className="flex flex-wrap gap-2">
                {internship.required_skills.split(',').map((sk, i) => (
                  <span key={i} className="text-xs font-semibold px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg border border-indigo-100">
                    {sk.trim()}
                  </span>
                ))}
              </div>
            </div>

            {internship.preferred_skills && (
              <div className="space-y-2 pt-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  Preferred / Bonus Skills
                </span>
                <div className="flex flex-wrap gap-2">
                  {internship.preferred_skills.split(',').map((sk, i) => (
                    <span key={i} className="text-xs font-semibold px-3 py-1 bg-slate-100 text-slate-700 rounded-lg border border-slate-200">
                      {sk.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {internship.qualifications && (
              <div className="pt-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Academic Eligibility
                </span>
                <p className="text-xs text-slate-700">{internship.qualifications}</p>
              </div>
            )}
          </div>

          {/* About Company */}
          {internship.company_description && (
            <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/90 shadow-2xs space-y-2">
              <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
                About {internship.company_name}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {internship.company_description}
              </p>
              {internship.company_website && (
                <a
                  href={internship.company_website}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:underline pt-2"
                >
                  Visit Corporate Website <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          )}

        </div>

        {/* Right Col: AI Fit Score & AI Trust Scanner Modules */}
        <div className="space-y-6">
          
          {/* YOUR FIT SECTION */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-2xs space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                YOUR FIT
              </h3>
              <span className="text-2xl font-black text-indigo-600">
                {fitBreakdown ? `${fitBreakdown.overall_fit}%` : `${internship.fit_score || 85}%`}
              </span>
            </div>

            {fitBreakdown && (
              <div className="space-y-3">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-600">Skills Match (35%)</span>
                    <span className="font-bold text-slate-900">{fitBreakdown.skill_match}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${fitBreakdown.skill_match}%` }} />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-600">Career Alignment (25%)</span>
                    <span className="font-bold text-slate-900">{fitBreakdown.career_alignment}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-full" style={{ width: `${fitBreakdown.career_alignment}%` }} />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-600">Academic Qualification (15%)</span>
                    <span className="font-bold text-slate-900">{fitBreakdown.qualification_match}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${fitBreakdown.qualification_match}%` }} />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-600">Domain Interest Match (15%)</span>
                    <span className="font-bold text-slate-900">{fitBreakdown.interest_match}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div className="h-full bg-violet-600 rounded-full" style={{ width: `${fitBreakdown.interest_match}%` }} />
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100">
                  <p className="text-[11px] text-slate-600 leading-relaxed bg-indigo-50/60 p-2.5 rounded-xl border border-indigo-100">
                    💡 {fitBreakdown.explanation}
                  </p>
                </div>

                {/* Missing Skills Highlight */}
                {fitBreakdown.missing_skills.length > 0 && (
                  <div className="pt-2">
                    <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block mb-1.5">
                      Skills to Bridge Before Applying:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {fitBreakdown.missing_skills.map((s, idx) => (
                        <span key={idx} className="text-xs bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-md font-semibold">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* TRUST INDICATORS SECTION */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                TRUST INDICATORS
              </h3>
              <span className="text-xs font-black px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg">
                Score: {trustScan?.trust_score || internship.trust_score}/100
              </span>
            </div>

            {trustScan ? (
              <div className="space-y-3">
                <div className="space-y-1.5">
                  {trustScan.positive_indicators.slice(0, 4).map((pos, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 flex-shrink-0" />
                      <span>{pos}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-slate-100">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Potential Concerns
                  </span>
                  {trustScan.risk_indicators.length > 0 ? (
                    <div className="space-y-1 text-xs text-amber-800">
                      {trustScan.risk_indicators.map((risk, idx) => (
                        <div key={idx} className="flex items-start gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-600 mt-0.5" />
                          <span>{risk}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500">None detected ✓</p>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500">Scanning indicators...</p>
            )}
          </div>

        </div>

      </div>

      {/* Apply Modal */}
      <Modal isOpen={applyModalOpen} onClose={() => setApplyModalOpen(false)} title="Submit Internship Application">
        {applicationSuccess ? (
          <div className="py-6 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <h4 className="text-lg font-bold text-slate-900">Application Submitted!</h4>
            <p className="text-xs text-slate-500">Redirecting to your Kanban application tracker...</p>
          </div>
        ) : (
          <form onSubmit={handleApplySubmit} className="space-y-4">
            <div>
              <p className="text-xs text-slate-600 mb-2">
                You are applying to <strong>{internship.title}</strong> at <strong>{internship.company_name}</strong>.
              </p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Candidate Note / Highlight (Optional)
              </label>
              <textarea
                rows={3}
                value={applyNotes}
                onChange={(e) => setApplyNotes(e.target.value)}
                placeholder="Mention relevant projects or why your skills fit this position..."
                className="w-full text-xs p-3 rounded-xl border border-slate-300"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setApplyModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={applying}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                {applying ? 'Submitting...' : 'Confirm Application'}
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* Report Opportunity Modal */}
      <Modal isOpen={reportModalOpen} onClose={() => setReportModalOpen(false)} title="Report Suspicious Opportunity">
        <form onSubmit={handleReportSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Reason for Concern</label>
            <select
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white"
            >
              <option value="Suspicious fee request">Demands registration / training fees</option>
              <option value="Fake company claims">Unverified or impersonated organization</option>
              <option value="Misleading job description">Misleading responsibilities or unpaid work</option>
              <option value="Other concern">Other security / safety issue</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Additional Details</label>
            <textarea
              rows={3}
              value={reportDetails}
              onChange={(e) => setReportDetails(e.target.value)}
              placeholder="Provide context to help our moderation audit team..."
              className="w-full text-xs p-3 rounded-xl border border-slate-300"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setReportModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={reporting}
              className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl"
            >
              {reporting ? 'Reporting...' : 'Submit Report'}
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
