import React, { useState, useEffect } from 'react';
import { companyService, internshipService } from '../../services/api';
import { Modal } from '../../components/common/Modal';
import { 
  Building2, Plus, Users, Briefcase, CheckCircle2, 
  ExternalLink, Sparkles, Filter, ChevronRight, Check
} from 'lucide-react';

export const CompanyDashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [selectedInternshipId, setSelectedInternshipId] = useState<number | null>(null);
  const [candidatesData, setCandidatesData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [candidatesLoading, setCandidatesLoading] = useState(false);

  // Post Internship Modal
  const [postModalOpen, setPostModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [domain, setDomain] = useState('AI/ML');
  const [description, setDescription] = useState('');
  const [responsibilities, setResponsibilities] = useState('');
  const [requirements, setRequirements] = useState('');
  const [requiredSkills, setRequiredSkills] = useState('');
  const [preferredSkills, setPreferredSkills] = useState('');
  const [qualifications, setQualifications] = useState('B.Tech/BE in Computer Science or related degree');
  const [location, setLocation] = useState('Bengaluru / Remote');
  const [workMode, setWorkMode] = useState('Remote');
  const [duration, setDuration] = useState('6 Months');
  const [stipend, setStipend] = useState('₹30,000 / month');
  const [posting, setPosting] = useState(false);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const data = await companyService.getDashboard();
      setDashboardData(data);
      if (data.postings && data.postings.length > 0) {
        setSelectedInternshipId(data.postings[0].id);
        fetchCandidates(data.postings[0].id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCandidates = async (id: number) => {
    setCandidatesLoading(true);
    try {
      const data = await companyService.getCandidates(id);
      setCandidatesData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setCandidatesLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleSelectInternship = (id: number) => {
    setSelectedInternshipId(id);
    fetchCandidates(id);
  };

  const handleCreateInternship = async (e: React.FormEvent) => {
    e.preventDefault();
    setPosting(true);
    try {
      await internshipService.create({
        title,
        domain,
        description,
        responsibilities,
        requirements,
        required_skills: requiredSkills,
        preferred_skills: preferredSkills,
        qualifications,
        location,
        work_mode: workMode,
        duration,
        stipend,
        stipend_amount: parseInt(stipend.replace(/\D/g, '') || '0', 10),
        application_url: 'https://internlogo.com/apply/auto'
      });
      setPostModalOpen(false);
      // Reset form
      setTitle('');
      setDescription('');
      setRequiredSkills('');
      fetchDashboard();
    } catch (err) {
      console.error(err);
    } finally {
      setPosting(false);
    }
  };

  const handleCandidateStatus = async (appId: number, newStatus: string) => {
    try {
      await companyService.updateCandidateStatus(appId, { status: newStatus });
      if (selectedInternshipId) {
        fetchCandidates(selectedInternshipId);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-2xs flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-black text-slate-900">
              {dashboardData?.company_name || 'Recruiter Portal'}
            </h1>
            {dashboardData?.verified && (
              <span className="text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-blue-600" />
                Verified Employer
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500">
            Manage your opportunities and review AI-ranked candidate matches in real time.
          </p>
        </div>

        <button
          onClick={() => setPostModalOpen(true)}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-indigo-600/20"
        >
          <Plus className="w-4 h-4" />
          Post New Internship
        </button>
      </div>

      {/* Main Grid: Postings List (Left) + Candidate Match Table (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Col: Posted Internships */}
        <div className="space-y-4">
          <div className="flex justify-between items-center px-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Active Postings ({dashboardData?.postings?.length || 0})
            </h3>
          </div>

          <div className="space-y-3">
            {dashboardData?.postings?.map((post: any) => (
              <div
                key={post.id}
                onClick={() => handleSelectInternship(post.id)}
                className={`p-4 rounded-2xl border transition cursor-pointer select-none ${
                  selectedInternshipId === post.id
                    ? 'bg-indigo-50/70 border-indigo-300 ring-2 ring-indigo-500/20 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
                    {post.domain}
                  </span>
                  <span className="text-[11px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                    {post.applicants_count} Applicants
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 line-clamp-1">{post.title}</h4>
                <p className="text-xs text-slate-500 mt-1">
                  {post.location} • {post.work_mode} • {post.stipend}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right 2 Cols: Candidate Match Table */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center px-1">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                Ranked Candidates for: {candidatesData?.internship_title || 'Selected Role'}
              </h3>
              <p className="text-xs text-slate-500">
                Sorted by AI Fit Score calculated against required qualifications
              </p>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden">
            {candidatesLoading ? (
              <div className="p-12 text-center text-xs text-slate-400">
                Loading candidate rankings...
              </div>
            ) : !candidatesData || candidatesData.candidates.length === 0 ? (
              <div className="p-12 text-center space-y-2">
                <Users className="w-10 h-10 text-slate-300 mx-auto" />
                <h4 className="text-sm font-bold text-slate-700">No applications received yet</h4>
                <p className="text-xs text-slate-400">
                  New applications will appear here automatically scored with AI Fit ratings.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] font-bold">
                    <tr>
                      <th className="px-5 py-3.5">Candidate</th>
                      <th className="px-5 py-3.5">AI Fit Score</th>
                      <th className="px-5 py-3.5">Academic Background</th>
                      <th className="px-5 py-3.5">Current Skills</th>
                      <th className="px-5 py-3.5">Status</th>
                      <th className="px-5 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {candidatesData.candidates.map((cand: any) => (
                      <tr key={cand.application_id} className="hover:bg-slate-50/70 transition">
                        <td className="px-5 py-4">
                          <p className="font-bold text-slate-900">{cand.student_name}</p>
                          <p className="text-[11px] text-slate-400">{cand.career_goal}</p>
                        </td>
                        <td className="px-5 py-4">
                          <span className={`inline-flex items-center gap-1 font-extrabold px-2.5 py-1 rounded-full text-xs ${
                            cand.fit_score >= 85 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                            cand.fit_score >= 70 ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' :
                            'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}>
                            <Sparkles className="w-3 h-3" />
                            {cand.fit_score}% Match
                          </span>
                        </td>
                        <td className="px-5 py-4 text-slate-600">
                          <p className="font-semibold text-slate-800">{cand.college}</p>
                          <p className="text-[11px] text-slate-500">{cand.degree} - {cand.branch} ('{cand.graduation_year})</p>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex flex-wrap gap-1 max-w-[200px]">
                            {cand.skills.slice(0, 3).map((s: string, idx: number) => (
                              <span key={idx} className="text-[10px] font-medium bg-slate-100 px-1.5 py-0.5 rounded text-slate-700">
                                {s}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200">
                            {cand.status}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <select
                            value={cand.status}
                            onChange={(e) => handleCandidateStatus(cand.application_id, e.target.value)}
                            className="text-xs p-1 rounded-lg border border-slate-300 bg-white font-medium"
                          >
                            <option value="Applied">Applied</option>
                            <option value="Assessment">Assessment</option>
                            <option value="Interview">Interview</option>
                            <option value="Selected">Selected</option>
                            <option value="Rejected">Rejected</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Post Internship Modal */}
      <Modal isOpen={postModalOpen} onClose={() => setPostModalOpen(false)} title="Create New Internship Opportunity" maxWidth="xl">
        <form onSubmit={handleCreateInternship} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Role Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. AI Research Intern"
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Domain</label>
              <select
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white"
              >
                <option value="AI/ML">AI/ML</option>
                <option value="Software Development">Software Development</option>
                <option value="Data Science">Data Science</option>
                <option value="Web Development">Web Development</option>
                <option value="Cloud/DevOps">Cloud/DevOps</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Role Description</label>
            <textarea
              rows={2}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detailed description of the internship and day-to-day projects..."
              className="w-full text-xs p-2.5 rounded-xl border border-slate-300"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Required Skills (Comma-separated)</label>
              <input
                type="text"
                required
                value={requiredSkills}
                onChange={(e) => setRequiredSkills(e.target.value)}
                placeholder="Python, PyTorch, SQL"
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Preferred Skills</label>
              <input
                type="text"
                value={preferredSkills}
                onChange={(e) => setPreferredSkills(e.target.value)}
                placeholder="Docker, Git, HuggingFace"
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Work Mode</label>
              <select
                value={workMode}
                onChange={(e) => setWorkMode(e.target.value)}
                className="w-full text-xs p-2 rounded-xl border border-slate-300 bg-white"
              >
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
                <option value="On-site">On-site</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Duration</label>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="3 Months / 6 Months"
                className="w-full text-xs p-2 rounded-xl border border-slate-300"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Monthly Stipend</label>
              <input
                type="text"
                value={stipend}
                onChange={(e) => setStipend(e.target.value)}
                placeholder="₹30,000 / month"
                className="w-full text-xs p-2 rounded-xl border border-slate-300"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setPostModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={posting}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl"
            >
              {posting ? 'Publishing...' : 'Publish Internship Listing'}
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
