import React, { useState, useEffect } from 'react';
import { applicationService } from '../../services/api';
import { Application, ApplicationStatus } from '../../types';
import { 
  FileText, Calendar, Building2, MapPin, 
  Trash2, Edit3, Plus, ArrowRight, ExternalLink 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Modal } from '../../components/common/Modal';

export const ApplicationsKanban: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  // Edit modal
  const [editingApp, setEditingApp] = useState<Application | null>(null);
  const [editStatus, setEditStatus] = useState<ApplicationStatus>('Applied');
  const [editNotes, setEditNotes] = useState('');
  const [editInterviewDate, setEditInterviewDate] = useState('');
  const [updating, setUpdating] = useState(false);

  const columns: { status: ApplicationStatus; title: string; color: string }[] = [
    { status: 'Applied', title: 'Applied', color: 'border-blue-500 bg-blue-50/30' },
    { status: 'Assessment', title: 'Assessment / OA', color: 'border-indigo-500 bg-indigo-50/30' },
    { status: 'Interview', title: 'Interview Rounds', color: 'border-amber-500 bg-amber-50/30' },
    { status: 'Selected', title: 'Selected / Offer 🎉', color: 'border-emerald-500 bg-emerald-50/30' },
    { status: 'Rejected', title: 'Archived / Rejected', color: 'border-slate-400 bg-slate-50/30' },
  ];

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const data = await applicationService.list();
      setApplications(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleOpenEdit = (app: Application) => {
    setEditingApp(app);
    setEditStatus(app.status);
    setEditNotes(app.notes || '');
    setEditInterviewDate(app.interview_date || '');
  };

  const handleSaveUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingApp) return;
    setUpdating(true);
    try {
      await applicationService.update(editingApp.id, {
        status: editStatus,
        notes: editNotes,
        interview_date: editInterviewDate
      });
      setEditingApp(null);
      fetchApplications();
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Remove this application from tracker?')) return;
    try {
      await applicationService.delete(id);
      fetchApplications();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <FileText className="w-6 h-6 text-indigo-600" />
            Application Progress Tracker
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Organize your active interview pipelines across stages from submission to offer.
          </p>
        </div>

        <Link
          to="/internships"
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
        >
          <Plus className="w-4 h-4" />
          Apply to More Roles
        </Link>
      </div>

      {/* Kanban Board Columns Container */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 items-start overflow-x-auto pb-4">
        {columns.map((col) => {
          const colApps = applications.filter((a) => a.status === col.status);
          return (
            <div
              key={col.status}
              className="bg-slate-100/70 p-3.5 rounded-2xl border border-slate-200 min-h-[500px] flex flex-col space-y-3"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-bold text-slate-800">{col.title}</span>
                <span className="text-[11px] font-extrabold text-slate-500 bg-white px-2 py-0.5 rounded-full border border-slate-200">
                  {colApps.length}
                </span>
              </div>

              {/* Cards inside column */}
              <div className="space-y-3 flex-1">
                {colApps.length === 0 ? (
                  <div className="h-32 border border-dashed border-slate-300 rounded-xl flex items-center justify-center text-[11px] text-slate-400">
                    No applications
                  </div>
                ) : (
                  colApps.map((app) => (
                    <div
                      key={app.id}
                      className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3 hover:shadow-xs transition group"
                    >
                      <div>
                        <span className="text-[11px] font-semibold text-slate-500 block truncate">
                          {app.internship?.company_name || 'Innovate Co'}
                        </span>
                        <Link
                          to={`/internships/${app.internship_id}`}
                          className="font-bold text-xs text-slate-900 group-hover:text-indigo-600 line-clamp-1"
                        >
                          {app.internship?.title || 'Internship Role'}
                        </Link>
                      </div>

                      <div className="text-[11px] text-slate-500 space-y-1">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span className="truncate">{app.internship?.location || 'Remote'}</span>
                        </div>
                        {app.interview_date && (
                          <div className="flex items-center gap-1 text-amber-700 font-bold bg-amber-50 p-1 rounded-md">
                            <Calendar className="w-3 h-3" />
                            <span>Interview: {app.interview_date}</span>
                          </div>
                        )}
                      </div>

                      {app.notes && (
                        <p className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100 line-clamp-2">
                          "{app.notes}"
                        </p>
                      )}

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                        <button
                          onClick={() => handleOpenEdit(app)}
                          className="font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                        >
                          <Edit3 className="w-3 h-3" />
                          Update
                        </button>
                        <button
                          onClick={() => handleDelete(app.id)}
                          className="text-slate-400 hover:text-rose-600 p-1"
                          title="Delete application"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Application Modal */}
      <Modal isOpen={Boolean(editingApp)} onClose={() => setEditingApp(null)} title="Update Application Stage">
        <form onSubmit={handleSaveUpdate} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Pipeline Status</label>
            <select
              value={editStatus}
              onChange={(e) => setEditStatus(e.target.value as ApplicationStatus)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white"
            >
              <option value="Applied">Applied</option>
              <option value="Assessment">Assessment / OA</option>
              <option value="Interview">Interview Rounds</option>
              <option value="Selected">Selected / Offer</option>
              <option value="Rejected">Archived / Rejected</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Interview Date (if scheduled)</label>
            <input
              type="date"
              value={editInterviewDate}
              onChange={(e) => setEditInterviewDate(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-300"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Notes / Preparation Milestones</label>
            <textarea
              rows={3}
              value={editNotes}
              onChange={(e) => setEditNotes(e.target.value)}
              placeholder="e.g. Completed initial phone screen, preparing for system design round..."
              className="w-full text-xs p-3 rounded-xl border border-slate-300"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setEditingApp(null)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={updating}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl"
            >
              {updating ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
