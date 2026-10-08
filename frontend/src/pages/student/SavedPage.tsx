import React, { useState, useEffect } from 'react';
import { savedService, applicationService } from '../../services/api';
import { Internship } from '../../types';
import { InternshipCard } from '../../components/cards/InternshipCard';
import { CardSkeleton } from '../../components/common/Skeleton';
import { Bookmark, Compass, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const SavedPage: React.FC = () => {
  const [savedInternships, setSavedInternships] = useState<Internship[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSaved = async () => {
    setLoading(true);
    try {
      const data = await savedService.list();
      setSavedInternships(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSaved();
  }, []);

  const handleApply = (internship: Internship) => {
    applicationService.apply({ internship_id: internship.id })
      .then(() => {
        alert(`Application submitted successfully for ${internship.title}!`);
        fetchSaved();
      })
      .catch((err) => {
        alert(err?.response?.data?.detail || 'Application already recorded');
      });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Page Title */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <Bookmark className="w-6 h-6 text-indigo-600" />
            Saved Internships
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Bookmarked opportunities for future review and application.
          </p>
        </div>
        <span className="text-xs font-bold text-slate-400">
          {savedInternships.length} Saved
        </span>
      </div>

      {/* Grid or Empty State */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : savedInternships.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-4 max-w-lg mx-auto my-8">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
            <Bookmark className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-900">You haven't saved any internships yet.</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            As you browse openings, click the bookmark icon on any card to save it for side-by-side comparison.
          </p>
          <div>
            <Link
              to="/internships"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition"
            >
              <span>Explore Internships</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {savedInternships.map((internship) => (
            <InternshipCard
              key={internship.id}
              internship={internship}
              onApplyClick={handleApply}
            />
          ))}
        </div>
      )}

    </div>
  );
};
