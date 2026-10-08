import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ShieldCheck, Heart, Github, Linkedin, Twitter } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-lg text-white">
                Intern<span className="text-indigo-400">Logo</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              "Find the Right Internship. Build the Right Future."
            </p>
            <p className="text-xs text-slate-500 leading-relaxed">
              AI-powered internship discovery that matches student skills, audits opportunity trust signals, and bridges capability gaps.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">For Students</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link to="/internships" className="hover:text-white transition">Explore Internships</Link></li>
              <li><Link to="/skill-gap" className="hover:text-white transition">Skill Gap Analysis</Link></li>
              <li><Link to="/journey" className="hover:text-white transition">Journey Roadmap</Link></li>
              <li><Link to="/applications" className="hover:text-white transition">Application Kanban</Link></li>
            </ul>
          </div>

          {/* For Employers & Admin */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">Organizations</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link to="/company" className="hover:text-white transition">Recruiter Dashboard</Link></li>
              <li><Link to="/admin" className="hover:text-white transition">Admin Verification Portal</Link></li>
              <li><Link to="/register" className="hover:text-white transition">Hire Student Interns</Link></li>
            </ul>
          </div>

          {/* Trust & Transparency */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-1 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Trust Scanner Notice
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed bg-slate-800/80 p-3 rounded-xl border border-slate-700/60">
              InternLogo Opportunity Scanner highlights verified corporate signals and flags unverified risks. Students are advised to practice standard safety and never remit upfront processing fees.
            </p>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} InternLogo Inc. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-400 cursor-pointer">Security Center</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
