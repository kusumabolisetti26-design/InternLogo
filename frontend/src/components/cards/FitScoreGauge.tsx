import React from 'react';
import { Sparkles } from 'lucide-react';

interface FitScoreGaugeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const FitScoreGauge: React.FC<FitScoreGaugeProps> = ({
  score,
  size = 'md',
  showLabel = true,
}) => {
  const getColor = (s: number) => {
    if (s >= 85) return { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', fill: 'bg-emerald-500' };
    if (s >= 70) return { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200', fill: 'bg-indigo-500' };
    if (s >= 50) return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', fill: 'bg-amber-500' };
    return { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', fill: 'bg-rose-500' };
  };

  const theme = getColor(score);

  if (size === 'sm') {
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${theme.bg} ${theme.text} border ${theme.border}`}>
        <Sparkles className="w-3 h-3" />
        {score}% Fit
      </span>
    );
  }

  if (size === 'lg') {
    return (
      <div className={`flex flex-col items-center justify-center p-4 rounded-2xl ${theme.bg} border ${theme.border}`}>
        <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
          <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
          AI Fit Score
        </div>
        <div className={`text-4xl font-extrabold ${theme.text}`}>
          {score}%
        </div>
        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mt-3 max-w-[120px]">
          <div className={`h-full ${theme.fill} rounded-full`} style={{ width: `${score}%` }}></div>
        </div>
      </div>
    );
  }

  // Medium default
  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${theme.bg} ${theme.text} border ${theme.border}`}>
      <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
      <span>{score}% Fit</span>
    </div>
  );
};
