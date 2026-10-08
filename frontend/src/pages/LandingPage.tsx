import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, ShieldCheck, Target, TrendingUp, CheckCircle2, 
  ArrowRight, Search, Building2, Users, Compass, 
  Award, Briefcase, ChevronRight, Lock, Eye
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  return (
    <div className="bg-slate-50 min-h-screen">
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28">
        {/* Subtle background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-500/10 blur-[100px] -z-10 pointer-events-none rounded-full" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-700 text-xs font-semibold mb-6 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>AI-Powered Internship Discovery & Career Intelligence</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15] max-w-4xl mx-auto mb-6">
            Find Internships That <span className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-blue-600 bg-clip-text text-transparent">Actually Fit Your Future.</span>
          </h1>

          {/* Subheading */}
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto mb-9 leading-relaxed font-normal">
            AI-powered internship discovery that matches your skills, verifies opportunity credibility signals, scores your fit, and helps you bridge the skills you need.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-md mx-auto mb-14">
            <Link
              to="/register"
              className="w-full sm:w-auto px-7 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 transition"
            >
              <span>Find My Internship</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/internships"
              className="w-full sm:w-auto px-7 py-3.5 bg-white hover:bg-slate-50 text-slate-800 font-semibold rounded-xl border border-slate-300 shadow-2xs flex items-center justify-center gap-2 transition"
            >
              <Search className="w-4 h-4 text-slate-500" />
              <span>Explore Internships</span>
            </Link>
          </div>

          {/* Hero Interactive Preview Card */}
          <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-slate-200/90 shadow-xl overflow-hidden p-6 sm:p-8 text-left">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-slate-100 gap-4">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
                  Live Opportunity Preview
                </span>
                <h3 className="text-xl font-bold text-slate-900">AI / Machine Learning Research Intern</h3>
                <p className="text-xs text-slate-500">NeuralGrid AI • Bengaluru / Remote</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  94% AI Fit Score
                </div>
                <div className="bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Trust: 95/100
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Matched Skills</span>
                <div className="flex flex-wrap gap-1.5">
                  <span className="text-xs px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded-md font-medium">Python ✓</span>
                  <span className="text-xs px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded-md font-medium">Scikit-learn ✓</span>
                  <span className="text-xs px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded-md font-medium">SQL ✓</span>
                </div>
              </div>
              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Identified Skill Gap</span>
                <div className="flex flex-wrap gap-1.5">
                  <span className="text-xs px-2.5 py-1 bg-amber-50 text-amber-800 rounded-md font-medium">PyTorch (Week 1)</span>
                  <span className="text-xs px-2.5 py-1 bg-amber-50 text-amber-800 rounded-md font-medium">Transformers</span>
                </div>
              </div>
              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Compensation & Term</span>
                <p className="text-xs font-bold text-slate-900">₹35,000 / month • 6 Months</p>
                <p className="text-[11px] text-slate-500">Verified Direct Corporate Application</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* THE 4 FUNDAMENTAL QUESTIONS / PROBLEM SECTION */}
      <section className="py-16 bg-white border-y border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-2">
              The Problem with Internship Searching
            </h2>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Internship hunt is broken for students.
            </h3>
            <p className="text-sm text-slate-600 mt-2">
              Thousands of scattered listings, hidden scams, ambiguous requirements, and zero actionable feedback.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold mb-4">
                1
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-2">Scattered Listings</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Opportunities are fragmented across LinkedIn, WhatsApp groups, Telegram channels, and opaque job boards.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold mb-4">
                2
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-2">Suspicious Postings</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Fraudulent listings asking for upfront "training" or "processing" fees without legitimate mentors.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold mb-4">
                3
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-2">Unclear Eligibility</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Students apply blindly without knowing if their graduation year, branch, or current skills actually qualify.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold mb-4">
                4
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-2">Unknown Skill Gaps</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                When rejected, students receive radio silence instead of knowing which 2 skills to learn to pass the bar.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SOLUTION: 4 PILLARS */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-2">
              The InternLogo Solution
            </h2>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Four Answers For Every Opportunity
            </h3>
            <p className="text-sm text-slate-600 mt-2">
              We never show a listing without answering: Is it relevant? Can I trust it? How well do I fit? What must I bridge?
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Card 1: AI Matching */}
            <div className="bg-white p-7 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-5">
                <Target className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">1. AI Internship Matching</h4>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Ranks internships by calculating semantic alignment across your technical skills, career goal, academic background, and work preferences.
              </p>
              <div className="text-xs font-semibold text-indigo-600 flex items-center gap-1">
                Weighted scoring formula (Skills 35%, Career 25%, Qual 15%) →
              </div>
            </div>

            {/* Card 2: Trust Scanner */}
            <div className="bg-white p-7 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-5">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">2. Opportunity Trust Scanner</h4>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Audits employer credentials, detects suspicious upfront payment solicitation, verifies company domains, and rates listing legitimacy.
              </p>
              <div className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                Zero fake certainty: transparent positive & caution indicators →
              </div>
            </div>

            {/* Card 3: Fit Score */}
            <div className="bg-white p-7 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-5">
                <Sparkles className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">3. Explainable Fit Score</h4>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                No black-box mystery. Every fit score breaks down into Skill Match, Career Alignment, and explicit matched vs missing prerequisite tags.
              </p>
              <div className="text-xs font-semibold text-blue-600 flex items-center gap-1">
                Diagnostic reports available for every single listing →
              </div>
            </div>

            {/* Card 4: Skill Gap Analysis */}
            <div className="bg-white p-7 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition">
              <div className="w-12 h-12 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center mb-5">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">4. Skill Gap & Journey Planner</h4>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Transforms missing requirements into structured, milestone-driven learning steps so students can prepare proactively before applying.
              </p>
              <div className="text-xs font-semibold text-violet-600 flex items-center gap-1">
                Curated learning paths with progress checkboxes →
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* HOW IT WORKS (5 STEPS) */}
      <section id="how-it-works" className="py-20 bg-white border-y border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-2">
              Simple 5-Step Process
            </h2>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              How InternLogo Works
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              { step: '01', title: 'Create Profile', desc: 'Enter college, degree, branch, and current technical toolkit.' },
              { step: '02', title: 'State Career Goal', desc: 'Specify your target role (e.g. AI Engineer, Full Stack, SRE).' },
              { step: '03', title: 'AI Match Engine', desc: 'Our engine runs weighted multi-factor scoring against listings.' },
              { step: '04', title: 'Check Fit & Trust', desc: 'Inspect confidence indicators and bridge identified skill gaps.' },
              { step: '05', title: 'Apply & Track', desc: 'Submit and manage interview milestones on your Kanban board.' },
            ].map((s, idx) => (
              <div key={idx} className="relative p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
                <div>
                  <span className="text-3xl font-black text-indigo-200 block mb-2">{s.step}</span>
                  <h4 className="text-sm font-bold text-slate-900 mb-1.5">{s.title}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOR COMPANIES & STUDENTS DUAL BENEFIT SECTION */}
      <section id="for-companies" className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            
            {/* Student benefits */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xs">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full mb-4">
                <Users className="w-3.5 h-3.5" />
                For College Students
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">
                Fast-track your career with confidence
              </h3>
              <ul className="space-y-3 text-xs text-slate-600">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>Discover genuine, non-scam internships verified by our Trust Scanner.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>Understand exactly why you scored an 85% or 92% match.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>Receive custom roadmaps to bridge prerequisite skill gaps.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>Track applications through Assessment, Interview, and Selection on Kanban.</span>
                </li>
              </ul>
              <div className="mt-6">
                <Link to="/register" className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
                  Create Student Profile →
                </Link>
              </div>
            </div>

            {/* Company benefits */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xs">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full mb-4">
                <Building2 className="w-3.5 h-3.5" />
                For Hiring Teams & Startups
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">
                Reach pre-ranked, highly qualified interns
              </h3>
              <ul className="space-y-3 text-xs text-slate-600">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span>Post opportunities and specify mandatory vs preferred skill requirements.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span>Candidates automatically ordered by AI Fit Score (e.g. 94% Match, 89% Match).</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span>Verify employer credibility to attract top college performers.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span>Streamlined applicant status management directly from your dashboard.</span>
                </li>
              </ul>
              <div className="mt-6">
                <Link to="/register" className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1">
                  Register as Recruiter →
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section className="py-20 bg-indigo-900 text-white relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
            Ready to find the internship that fits your future?
          </h2>
          <p className="text-sm text-indigo-200 max-w-xl mx-auto mb-8">
            Join thousands of college students discovering trusted, AI-matched career opportunities today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="px-8 py-3.5 bg-white text-indigo-900 hover:bg-indigo-50 font-bold rounded-xl transition shadow-lg"
            >
              Get Started for Free
            </Link>
            <Link
              to="/internships"
              className="px-8 py-3.5 bg-indigo-800/80 hover:bg-indigo-800 text-white font-semibold rounded-xl border border-indigo-700 transition"
            >
              Browse 25+ Openings
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};
