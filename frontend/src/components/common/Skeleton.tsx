import React from 'react';

export const CardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-sm animate-pulse space-y-4">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <div className="h-5 w-48 bg-slate-200 rounded"></div>
          <div className="h-4 w-32 bg-slate-100 rounded"></div>
        </div>
        <div className="h-8 w-16 bg-slate-200 rounded-full"></div>
      </div>
      <div className="space-y-2">
        <div className="h-3 w-full bg-slate-100 rounded"></div>
        <div className="h-3 w-3/4 bg-slate-100 rounded"></div>
      </div>
      <div className="flex gap-2">
        <div className="h-6 w-16 bg-slate-100 rounded-full"></div>
        <div className="h-6 w-20 bg-slate-100 rounded-full"></div>
        <div className="h-6 w-14 bg-slate-100 rounded-full"></div>
      </div>
      <div className="flex justify-between items-center pt-2 border-t border-slate-100">
        <div className="h-4 w-24 bg-slate-200 rounded"></div>
        <div className="h-8 w-24 bg-slate-200 rounded-lg"></div>
      </div>
    </div>
  );
};

export const DetailSkeleton: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-pulse p-4">
      <div className="h-8 w-64 bg-slate-200 rounded"></div>
      <div className="h-40 bg-white rounded-xl border border-slate-200 p-6 space-y-4">
        <div className="h-6 w-48 bg-slate-200 rounded"></div>
        <div className="h-4 w-full bg-slate-100 rounded"></div>
        <div className="h-4 w-2/3 bg-slate-100 rounded"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="h-64 bg-white rounded-xl border border-slate-200 p-6"></div>
        <div className="h-64 bg-white rounded-xl border border-slate-200 p-6"></div>
      </div>
    </div>
  );
};
