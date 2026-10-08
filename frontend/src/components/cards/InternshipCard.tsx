import React, { useState } from 'react';
import { Internship } from '../../types';
import { FitScoreGauge } from './FitScoreGauge';
import { TrustBadge } from './TrustBadge';
import { Badge } from '../common/Badge';
import { MapPin, Briefcase, Calendar, Bookmark, BookmarkCheck, ArrowRight, Building2, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { savedService } from '../../services/api';

interface InternshipCardProps {
  internship: Internship;
  onOpenFit?: (internship: Internship) => void;
  onOpenTrust?: (internship: Internship) => void;
  onApplyClick?: (internship: Internship) => void;
}

export const InternshipCard: React.FC<InternshipCardProps> = ({
  internship,
  onOpenFit,
  onOpenTrust,
  onApplyClick,
}) => {
  const [isSaved, setIsSaved] = useState(internship.is_saved || false);
  const [saving, setSaving] = useState(false);

  const toggleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (saving) return;
    setSaving(true);
    try {
      if (isSaved) {
        await savedService.remove(internship.id);
        setIsSaved(false);
      } else {
        await savedService.save(internship.id);
        setIsSaved(true);
      }
    } catch (err) {
      console.error('Failed to toggle bookmark', err);
    } finally {
      setSaving(false);
    }
  };

  const skillsList = internship.required_skills.split(',').map((s) => s.trim()).filter(Boolean);

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group">
      <div>
        {/* Top Header: Company Info & Action Badges */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-700 text-sm overflow-hidden flex-shrink-0">
              {internship.company_logo ? (
                <img src={internship.company_logo} alt={internship.company_name} className="w-full h-full object-cover" />
              ) : (
                <Building2 className="w-5 h-5 text-slate-500" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-slate-600 line-clamp-1">
                  {internship.company_name || 'Innovate Tech'}
                </span>
                {internship.company_verified && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" title="Verified Employer" />
                )}
              </div>
              <Link to={`/internships/${internship.id}`}>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                  {internship.title}
                </h3>
              </Link>
            </div>
          </div>

          {/* Bookmark Button */}
          <button
            onClick={toggleSave}
            disabled={saving}
            className={`p-2 rounded-xl transition border ${
              isSaved
                ? 'bg-indigo-50 text-indigo-600 border-indigo-200'
                : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50 border-transparent'
            }`}
            title={isSaved ? 'Remove Bookmark' : 'Save for Later'}
          >
            {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
          </button>
        </div>

        {/* AI & Trust Metrics Bar */}
        <div className="flex items-center gap-2 mb-3.5 flex-wrap">
          {internship.fit_score !== undefined && internship.fit_score !== null ? (
            <button
              onClick={() => onOpenFit && onOpenFit(internship)}
              type="button"
              className="focus:outline-hidden"
              title="Click to view AI Fit Breakdown"
            >
              <FitScoreGauge score={internship.fit_score} size="sm" />
            </button>
          ) : (
            <span className="text-[11px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full font-medium">
              Profile Fit Available
            </span>
          )}

          <TrustBadge
            score={internship.trust_score}
            status={internship.verification_status}
            size="sm"
            onClick={() => onOpenTrust && onOpenTrust(internship)}
          />

          <Badge variant="slate" size="sm">
            {internship.work_mode}
          </Badge>
        </div>

        {/* Core Metadata: Location, Stipend, Duration */}
        <div className="grid grid-cols-2 gap-y-2 text-xs text-slate-500 mb-4 bg-slate-50/70 p-3 rounded-xl border border-slate-100">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <span className="truncate">{internship.location}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-semibold text-slate-800 truncate">{internship.stipend}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>{internship.duration}</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-500">
            <span className="truncate">Deadline: {internship.deadline ? internship.deadline.slice(5) : 'Rolling'}</span>
          </div>
        </div>

        {/* Skills Tags */}
        <div className="flex flex-wrap gap-1 mb-4">
          {skillsList.slice(0, 4).map((skill, index) => (
            <span
              key={index}
              className="text-[11px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md"
            >
              {skill}
            </span>
          ))}
          {skillsList.length > 4 && (
            <span className="text-[11px] font-medium text-slate-400 px-1 py-0.5">
              +{skillsList.length - 4} more
            </span>
          )}
        </div>
      </div>

      {/* Card Footer: View Details & Apply CTA */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        <Link
          to={`/internships/${internship.id}`}
          className="text-xs font-semibold text-slate-600 hover:text-indigo-600 flex items-center gap-1 transition"
        >
          View Details
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>

        {internship.application_status ? (
          <span className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
            Status: {internship.application_status}
          </span>
        ) : (
          <button
            onClick={() => onApplyClick ? onApplyClick(internship) : null}
            className="text-xs font-semibold px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition shadow-xs"
          >
            Apply Now
          </button>
        )}
      </div>
    </div>
  );
};
