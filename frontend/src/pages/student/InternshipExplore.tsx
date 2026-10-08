import React, { useState, useEffect } from 'react';
import { internshipService, applicationService } from '../../services/api';
import { Internship, FitScoreBreakdown } from '../../types';
import { InternshipCard } from '../../components/cards/InternshipCard';
import { CardSkeleton } from '../../components/common/Skeleton';
import { FitScoreModal } from '../../components/ai/FitScoreModal';
import { TrustScannerModal } from '../../components/ai/TrustScannerModal';
import { matchingService } from '../../services/api';
import { 
  Search, Filter, SlidersHorizontal, Compass, 
  MapPin, Briefcase, Sparkles, ShieldCheck 
} from 'lucide-react';

export const InternshipExplore: React.FC = () => {
  const [internships, setInternships] = useState<Internship[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('All');
  const [selectedWorkMode, setSelectedWorkMode] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [sortBy, setSortBy] = useState('fit'); // 'fit', 'trust', 'date', 'stipend'

  // Modals
  const [selectedFitInternship, setSelectedFitInternship] = useState<Internship | null>(null);
  const [selectedFitBreakdown, setSelectedFitBreakdown] = useState<FitScoreBreakdown | null>(null);
  const [selectedTrustInternship, setSelectedTrustInternship] = useState<Internship | null>(null);

  const domains = ['All', 'AI/ML', 'Software Development', 'Data Science', 'Web Development', 'Cloud/DevOps'];
  const workModes = ['All', 'Remote', 'Hybrid', 'On-site'];

  const fetchInternships = async () => {
    setLoading(true);
    try {
      const params: any = {
        sort_by: sortBy,
      };
      if (searchQuery.trim()) params.query = searchQuery.trim();
      if (selectedDomain !== 'All') params.domain = selectedDomain;
      if (selectedWorkMode !== 'All') params.work_mode = selectedWorkMode;
      
      const data = await internshipService.list(params);
      setInternships(data);
    } catch (err) {
      console.error('Failed to load internships', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInternships();
  }, [selectedDomain, selectedWorkMode, sortBy]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchInternships();
  };

  const handleOpenFit = (internship: Internship) => {
    setSelectedFitInternship(internship);
    matchingService.getFitBreakdown(internship.id)
      .then((res) => setSelectedFitBreakdown(res))
      .catch(() => null);
  };

  const handleOpenTrust = (internship: Internship) => {
    setSelectedTrustInternship(internship);
  };

  const handleApply = (internship: Internship) => {
    applicationService.apply({ internship_id: internship.id })
      .then(() => {
        alert(`Application submitted successfully for ${internship.title}!`);
        fetchInternships();
      })
      .catch((err) => {
        alert(err?.response?.data?.detail || 'Application already recorded');
      });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Search Header Banner */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-2xs space-y-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <Compass className="w-6 h-6 text-indigo-600" />
            Discover Verified Internships
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Browse genuine opportunities scored with AI fit algorithms and verified trust indicators.
          </p>
        </div>

        {/* Search Bar & Controls */}
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by role, company, skills (e.g. Python, Machine Learning, Docker)..."
              className="w-full text-xs pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition"
          >
            Search
          </button>
        </form>

        {/* Filter Pills */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pt-3 border-t border-slate-100">
          
          {/* Domains selector */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
            <span className="text-[11px] font-bold uppercase text-slate-400 mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3" />
              Domain:
            </span>
            {domains.map((dom) => (
              <button
                key={dom}
                type="button"
                onClick={() => setSelectedDomain(dom)}
                className={`text-xs px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition border ${
                  selectedDomain === dom
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {dom}
              </button>
            ))}
          </div>

          {/* Work Mode & Sorting Selectors */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <select
              value={selectedWorkMode}
              onChange={(e) => setSelectedWorkMode(e.target.value)}
              className="text-xs px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-700 font-medium"
            >
              <option value="All">All Modes</option>
              <option value="Remote">Remote Only</option>
              <option value="Hybrid">Hybrid</option>
              <option value="On-site">On-site</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-xs px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-700 font-semibold"
            >
              <option value="fit">Sort: Best AI Fit</option>
              <option value="trust">Sort: Highest Trust</option>
              <option value="date">Sort: Newest</option>
              <option value="stipend">Sort: Highest Stipend</option>
            </select>
          </div>

        </div>
      </div>

      {/* Results Header */}
      <div className="flex justify-between items-center text-xs text-slate-500 px-1">
        <span>
          Showing <strong>{internships.length}</strong> opportunities
        </span>
        <span className="flex items-center gap-1 text-indigo-600 font-medium">
          <Sparkles className="w-3.5 h-3.5" />
          AI Fit scores calculated dynamically against your profile
        </span>
      </div>

      {/* Grid of Internship Cards */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : internships.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
          <Compass className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No matching internships found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search keywords, broadening your domain filter, or removing work mode restrictions.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedDomain('All');
              setSelectedWorkMode('All');
              fetchInternships();
            }}
            className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {internships.map((intern) => (
            <InternshipCard
              key={intern.id}
              internship={intern}
              onOpenFit={handleOpenFit}
              onOpenTrust={handleOpenTrust}
              onApplyClick={handleApply}
            />
          ))}
        </div>
      )}

      {/* Diagnostic Modals */}
      <FitScoreModal
        isOpen={Boolean(selectedFitInternship)}
        onClose={() => setSelectedFitInternship(null)}
        internshipTitle={selectedFitInternship?.title || ''}
        companyName={selectedFitInternship?.company_name || ''}
        breakdown={selectedFitBreakdown}
      />

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
