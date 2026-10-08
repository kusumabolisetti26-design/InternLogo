import React from 'react';
import { ShieldCheck, ShieldAlert, Shield } from 'lucide-react';

interface TrustBadgeProps {
  score: number;
  status?: string;
  size?: 'sm' | 'md';
  onClick?: () => void;
}

export const TrustBadge: React.FC<TrustBadgeProps> = ({
  score,
  status,
  size = 'md',
  onClick,
}) => {
  const getTrustConfig = (s: number) => {
    if (s >= 85) {
      return {
        label: 'High Trust',
        icon: ShieldCheck,
        bg: 'bg-emerald-50',
        text: 'text-emerald-700',
        border: 'border-emerald-200/80',
        ring: 'ring-emerald-500/20'
      };
    }
    if (s >= 65) {
      return {
        label: 'Verified Signals',
        icon: Shield,
        bg: 'bg-blue-50',
        text: 'text-blue-700',
        border: 'border-blue-200/80',
        ring: 'ring-blue-500/20'
      };
    }
    if (s >= 40) {
      return {
        label: 'Review Needed',
        icon: ShieldAlert,
        bg: 'bg-amber-50',
        text: 'text-amber-700',
        border: 'border-amber-200/80',
        ring: 'ring-amber-500/20'
      };
    }
    return {
      label: 'Caution Flag',
      icon: ShieldAlert,
      bg: 'bg-rose-50',
      text: 'text-rose-700',
      border: 'border-rose-200/80',
      ring: 'ring-rose-500/20'
    };
  };

  const config = getTrustConfig(score);
  const Icon = config.icon;

  if (size === 'sm') {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${config.bg} ${config.text} ${config.border} hover:opacity-90 transition`}
        title={`Trust Score: ${score}/100 (${config.label})`}
      >
        <Icon className="w-3 h-3" />
        <span>Trust: {score}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${config.bg} ${config.text} ${config.border} hover:opacity-90 transition shadow-sm`}
    >
      <Icon className="w-3.5 h-3.5" />
      <span>{config.label} ({score}/100)</span>
    </button>
  );
};
