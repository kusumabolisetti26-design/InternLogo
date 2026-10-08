import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Sparkles, Compass, Bookmark, LayoutDashboard, 
  Menu, X, LogOut, User as UserIcon, Building2, Shield, 
  TrendingUp, CheckCircle, MessageSquareCode
} from 'lucide-react';
import { AIChatDrawer } from '../ai/AIChatDrawer';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [aiDrawerOpen, setAiDrawerOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo & Brand Identity */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-blue-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-indigo-100" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                <span className="font-extrabold text-lg tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
                  Intern<span className="text-indigo-600">Logo</span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.2 bg-indigo-50 text-indigo-700 rounded-md border border-indigo-200">
                  AI
                </span>
              </div>
              <span className="text-[9px] text-slate-400 font-medium -mt-1 hidden sm:inline">
                Verified Discovery & Fit
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {!user ? (
              <>
                <Link
                  to="/"
                  className={`text-xs font-semibold px-3 py-2 rounded-lg transition ${
                    isActive('/') ? 'text-indigo-600 bg-indigo-50/70' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  Home
                </Link>
                <Link
                  to="/internships"
                  className={`text-xs font-semibold px-3 py-2 rounded-lg transition ${
                    isActive('/internships') ? 'text-indigo-600 bg-indigo-50/70' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  Explore Internships
                </Link>
                <a
                  href="#how-it-works"
                  className="text-xs font-semibold px-3 py-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition"
                >
                  How It Works
                </a>
                <a
                  href="#for-companies"
                  className="text-xs font-semibold px-3 py-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition"
                >
                  For Companies
                </a>
              </>
            ) : user.role === 'student' ? (
              <>
                <Link
                  to="/dashboard"
                  className={`text-xs font-semibold px-3 py-2 rounded-lg transition flex items-center gap-1.5 ${
                    isActive('/dashboard') ? 'text-indigo-600 bg-indigo-50/70' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  Dashboard
                </Link>
                <Link
                  to="/internships"
                  className={`text-xs font-semibold px-3 py-2 rounded-lg transition flex items-center gap-1.5 ${
                    isActive('/internships') ? 'text-indigo-600 bg-indigo-50/70' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Compass className="w-3.5 h-3.5" />
                  Discover
                </Link>
                <Link
                  to="/skill-gap"
                  className={`text-xs font-semibold px-3 py-2 rounded-lg transition flex items-center gap-1.5 ${
                    isActive('/skill-gap') ? 'text-indigo-600 bg-indigo-50/70' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <TrendingUp className="w-3.5 h-3.5" />
                  Skill Gap
                </Link>
                <Link
                  to="/journey"
                  className={`text-xs font-semibold px-3 py-2 rounded-lg transition flex items-center gap-1.5 ${
                    isActive('/journey') ? 'text-indigo-600 bg-indigo-50/70' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  Journey
                </Link>
                <Link
                  to="/applications"
                  className={`text-xs font-semibold px-3 py-2 rounded-lg transition flex items-center gap-1.5 ${
                    isActive('/applications') ? 'text-indigo-600 bg-indigo-50/70' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  Applications
                </Link>
                <Link
                  to="/saved"
                  className={`text-xs font-semibold px-3 py-2 rounded-lg transition flex items-center gap-1.5 ${
                    isActive('/saved') ? 'text-indigo-600 bg-indigo-50/70' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Bookmark className="w-3.5 h-3.5" />
                  Saved
                </Link>
              </>
            ) : user.role === 'company' ? (
              <Link
                to="/company"
                className={`text-xs font-semibold px-3 py-2 rounded-lg transition flex items-center gap-1.5 ${
                  isActive('/company') ? 'text-indigo-600 bg-indigo-50/70' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                Recruiter Portal
              </Link>
            ) : (
              <Link
                to="/admin"
                className={`text-xs font-semibold px-3 py-2 rounded-lg transition flex items-center gap-1.5 ${
                  isActive('/admin') ? 'text-indigo-600 bg-indigo-50/70' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                Admin Oversight
              </Link>
            )}
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2.5">
            {/* AI Advisor Button */}
            <button
              onClick={() => setAiDrawerOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-indigo-50 to-blue-50 text-indigo-700 border border-indigo-200/80 hover:bg-indigo-100/70 transition shadow-2xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span className="hidden sm:inline">AI Advisor</span>
            </button>

            {!user ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="text-xs font-semibold px-3 py-2 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="text-xs font-semibold px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-xs transition"
                >
                  Get Started
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <div className="hidden sm:flex flex-col text-right">
                  <span className="text-xs font-bold text-slate-900 leading-tight">
                    {user.full_name}
                  </span>
                  <span className="text-[10px] uppercase font-semibold text-indigo-600">
                    {user.role}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1 shadow-lg">
            {!user ? (
              <>
                <Link
                  to="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-sm font-medium py-2 text-slate-700"
                >
                  Home
                </Link>
                <Link
                  to="/internships"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-sm font-medium py-2 text-slate-700"
                >
                  Explore Internships
                </Link>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-sm font-medium py-2 text-slate-700"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-sm font-medium py-2 text-indigo-600"
                >
                  Get Started
                </Link>
              </>
            ) : (
              <>
                {user.role === 'student' && (
                  <>
                    <Link
                      to="/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block text-sm font-medium py-2 text-slate-700"
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/internships"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block text-sm font-medium py-2 text-slate-700"
                    >
                      Explore Internships
                    </Link>
                    <Link
                      to="/skill-gap"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block text-sm font-medium py-2 text-slate-700"
                    >
                      Skill Gap Analysis
                    </Link>
                    <Link
                      to="/journey"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block text-sm font-medium py-2 text-slate-700"
                    >
                      Journey Planner
                    </Link>
                    <Link
                      to="/applications"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block text-sm font-medium py-2 text-slate-700"
                    >
                      Applications
                    </Link>
                    <Link
                      to="/saved"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block text-sm font-medium py-2 text-slate-700"
                    >
                      Saved Internships
                    </Link>
                  </>
                )}
                {user.role === 'company' && (
                  <Link
                    to="/company"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-sm font-medium py-2 text-slate-700"
                  >
                    Company Portal
                  </Link>
                )}
                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-sm font-medium py-2 text-slate-700"
                  >
                    Admin Portal
                  </Link>
                )}
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left text-sm font-medium py-2 text-rose-600"
                >
                  Sign Out
                </button>
              </>
            )}
          </div>
        )}
      </header>

      {/* Global AI Career Assistant Drawer */}
      <AIChatDrawer isOpen={aiDrawerOpen} onClose={() => setAiDrawerOpen(false)} />
    </>
  );
};
