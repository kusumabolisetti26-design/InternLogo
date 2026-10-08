import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { TrustAnalysis } from '../../types';
import { trustService } from '../../services/api';
import { ShieldCheck, ShieldAlert, CheckCircle2, AlertTriangle, ExternalLink, HelpCircle } from 'lucide-react';

interface TrustScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  internshipId: number;
  internshipTitle: string;
  companyName: string;
}

export const TrustScannerModal: React.FC<TrustScannerModalProps> = ({
  isOpen,
  onClose,
  internshipId,
  internshipTitle,
  companyName
}) => {
  const [data, setData] = useState<TrustAnalysis | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (isOpen && internshipId) {
      setLoading(true);
      trustService.getScan(internshipId)
        .then((res) => setData(res))
        .catch((err) => console.error('Failed to load trust scan', err))
        .finally(() => setLoading(false));
    }
  }, [isOpen, internshipId]);

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="AI Opportunity Trust Scanner" maxWidth="xl">
      {loading ? (
        <div className="py-12 flex flex-col items-center justify-center space-y-3">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs text-slate-500 font-medium">Scanning opportunity credibility signals...</p>
        </div>
      ) : data ? (
        <div className="space-y-6">
          {/* Header Score Card */}
          <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className={`p-3 rounded-2xl flex flex-col items-center justify-center min-w-[90px] ${
              data.trust_score >= 85 ? 'bg-emerald-100 text-emerald-800' :
              data.trust_score >= 65 ? 'bg-blue-100 text-blue-800' :
              'bg-amber-100 text-amber-800'
            }`}>
              <span className="text-xs font-semibold">Trust Index</span>
              <span className="text-3xl font-extrabold">{data.trust_score}</span>
            </div>
            <div>
              <span className={`inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full font-bold mb-1 ${
                data.trust_score >= 85 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                data.trust_score >= 65 ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                'bg-amber-50 text-amber-700 border border-amber-200'
              }`}>
                {data.trust_score >= 85 ? <ShieldCheck className="w-3.5 h-3.5" /> : <ShieldAlert className="w-3.5 h-3.5" />}
                {data.trust_level}
              </span>
              <h4 className="font-semibold text-slate-900 text-sm">{internshipTitle}</h4>
              <p className="text-xs text-slate-500">{companyName}</p>
            </div>
          </div>

          {/* AI Explanation Alert */}
          <div className="p-3.5 rounded-xl bg-indigo-50/60 border border-indigo-100 text-xs text-slate-700 leading-relaxed">
            <p className="font-semibold text-indigo-900 mb-1 flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-indigo-600" />
              Scanner Diagnostic Analysis
            </p>
            {data.explanation}
          </div>

          {/* Positive vs Risk Indicators */}
          <div className="space-y-4">
            <div>
              <h5 className="text-xs font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5 mb-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Verified Trust Indicators ({data.positive_indicators.length})
              </h5>
              <div className="space-y-1.5">
                {data.positive_indicators.map((ind, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-slate-700 bg-emerald-50/30 p-2 rounded-lg border border-emerald-100/60">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <span>{ind}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 mb-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                Cautionary Checks & Notes ({data.risk_indicators.length})
              </h5>
              {data.risk_indicators.length > 0 ? (
                <div className="space-y-1.5">
                  {data.risk_indicators.map((risk, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-amber-900 bg-amber-50 p-2 rounded-lg border border-amber-200">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600 mt-0.5 flex-shrink-0" />
                      <span>{risk}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-100">
                  ✓ No red flags or suspicious financial solicitation signals detected.
                </div>
              )}
            </div>
          </div>

          <div className="pt-2 flex justify-between items-center border-t border-slate-100">
            <span className="text-xs text-slate-400">
              Audited by InternLogo Signal Verification Engine
            </span>
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition"
            >
              Close
            </button>
          </div>
        </div>
      ) : (
        <div className="p-4 text-center text-xs text-slate-500">Scan details unavailable</div>
      )}
    </Modal>
  );
};
