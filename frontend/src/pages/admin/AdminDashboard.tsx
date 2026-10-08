import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/api';
import { 
  ShieldCheck, Users, Building2, Briefcase, 
  FileText, CheckCircle2, AlertTriangle, Flag, Sparkles 
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [analytics, setAnalytics] = useState<any>(null);
  const [internships, setInternships] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'internships' | 'reports'>('internships');
  const [loading, setLoading] = useState(true);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [analyticsData, internshipsData, reportsData] = await Promise.all([
        adminService.getAnalytics(),
        adminService.getInternships(),
        adminService.getReports()
      ]);
      setAnalytics(analyticsData);
      setInternships(internshipsData);
      setReports(reportsData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleUpdateVerification = async (id: number, status: string) => {
    try {
      await adminService.updateVerification(id, { 
        verification_status: status,
        trust_score: status === 'Verified' ? 95 : status === 'Flagged' ? 25 : 65
      });
      fetchAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleResolveReport = async (reportId: number, status: string, flagListing: boolean) => {
    try {
      await adminService.resolveReport(reportId, { status, flag_internship: flagListing });
      fetchAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Admin Header */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 text-indigo-300 text-xs font-semibold mb-2 border border-slate-700">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
            Platform Trust & Verification Desk
          </div>
          <h1 className="text-2xl font-black tracking-tight">Admin Oversight Command</h1>
          <p className="text-xs text-slate-400 mt-1">
            Audit opportunity signals, resolve community reports, and monitor platform KPI growth.
          </p>
        </div>
      </div>

      {/* Analytics KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
          <span className="text-[11px] font-bold uppercase text-slate-400 block mb-1">Students</span>
          <p className="text-2xl font-black text-slate-900">{analytics?.total_students || 0}</p>
          <span className="text-[10px] text-emerald-600 font-medium">Active Learners</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
          <span className="text-[11px] font-bold uppercase text-slate-400 block mb-1">Companies</span>
          <p className="text-2xl font-black text-slate-900">{analytics?.total_companies || 0}</p>
          <span className="text-[10px] text-blue-600 font-medium">Hiring Teams</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
          <span className="text-[11px] font-bold uppercase text-slate-400 block mb-1">Listings</span>
          <p className="text-2xl font-black text-slate-900">{analytics?.total_internships || 0}</p>
          <span className="text-[10px] text-indigo-600 font-medium">Opportunities</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
          <span className="text-[11px] font-bold uppercase text-slate-400 block mb-1">Applications</span>
          <p className="text-2xl font-black text-slate-900">{analytics?.total_applications || 0}</p>
          <span className="text-[10px] text-amber-600 font-medium">Total Submitted</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
          <span className="text-[11px] font-bold uppercase text-slate-400 block mb-1">Placements</span>
          <p className="text-2xl font-black text-emerald-700">{analytics?.successful_placements || 0}</p>
          <span className="text-[10px] text-emerald-600 font-medium">Selected Offers 🎉</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
          <span className="text-[11px] font-bold uppercase text-slate-400 block mb-1">Avg AI Fit</span>
          <p className="text-2xl font-black text-indigo-600">{analytics?.average_fit_score || 86}%</p>
          <span className="text-[10px] text-indigo-500 font-medium">Platform Match</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-6">
        <button
          onClick={() => setActiveTab('internships')}
          className={`pb-3 text-xs font-bold transition border-b-2 flex items-center gap-1.5 ${
            activeTab === 'internships'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          Opportunity Verification Queue ({internships.length})
        </button>
        <button
          onClick={() => setActiveTab('reports')}
          className={`pb-3 text-xs font-bold transition border-b-2 flex items-center gap-1.5 ${
            activeTab === 'reports'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Flag className="w-4 h-4" />
          Community Safety Reports ({reports.length})
        </button>
      </div>

      {/* Tab 1: Internships Verification Queue */}
      {activeTab === 'internships' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] font-bold">
              <tr>
                <th className="px-5 py-3.5">Opportunity</th>
                <th className="px-5 py-3.5">Domain</th>
                <th className="px-5 py-3.5">Trust Score</th>
                <th className="px-5 py-3.5">Verification Status</th>
                <th className="px-5 py-3.5 text-right">Moderation Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {internships.map((i) => (
                <tr key={i.id} className="hover:bg-slate-50/70 transition">
                  <td className="px-5 py-3.5">
                    <p className="font-bold text-slate-900">{i.title}</p>
                    <p className="text-[11px] text-slate-400">{i.company_name} • {i.location}</p>
                  </td>
                  <td className="px-5 py-3.5 text-slate-600">{i.domain}</td>
                  <td className="px-5 py-3.5">
                    <span className="font-bold text-slate-800">{i.trust_score}/100</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                      i.verification_status === 'Verified' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                      i.verification_status === 'Flagged' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                      'bg-amber-50 text-amber-700 border-amber-200'
                    }`}>
                      {i.verification_status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right space-x-2">
                    <button
                      onClick={() => handleUpdateVerification(i.id, 'Verified')}
                      className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold rounded-lg border border-emerald-200 transition text-[11px]"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleUpdateVerification(i.id, 'Flagged')}
                      className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-lg border border-rose-200 transition text-[11px]"
                    >
                      Flag Risk
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 2: Reports Queue */}
      {activeTab === 'reports' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden">
          {reports.length === 0 ? (
            <div className="p-12 text-center text-xs text-slate-500">
              No unresolved community reports found. Clean record!
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] font-bold">
                <tr>
                  <th className="px-5 py-3.5">Reported Opportunity</th>
                  <th className="px-5 py-3.5">Reported Reason</th>
                  <th className="px-5 py-3.5">Details</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Resolution</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {reports.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/70 transition">
                    <td className="px-5 py-3.5">
                      <p className="font-bold text-slate-900">{r.internship_title}</p>
                      <p className="text-[11px] text-slate-400">{r.company_name}</p>
                    </td>
                    <td className="px-5 py-3.5 font-semibold text-rose-700">{r.reason}</td>
                    <td className="px-5 py-3.5 text-slate-600 max-w-xs">{r.details || 'N/A'}</td>
                    <td className="px-5 py-3.5">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200">
                        {r.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right space-x-2">
                      <button
                        onClick={() => handleResolveReport(r.id, 'Reviewed', false)}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-[11px]"
                      >
                        Dismiss
                      </button>
                      <button
                        onClick={() => handleResolveReport(r.id, 'Action Taken', true)}
                        className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg text-[11px]"
                      >
                        Flag & Punish
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

    </div>
  );
};
