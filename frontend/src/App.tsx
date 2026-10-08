import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';
import { OnboardingWizard } from './pages/onboarding/OnboardingWizard';
import { StudentDashboard } from './pages/student/StudentDashboard';
import { InternshipExplore } from './pages/student/InternshipExplore';
import { InternshipDetailPage } from './pages/student/InternshipDetailPage';
import { SkillGapPage } from './pages/student/SkillGapPage';
import { JourneyPage } from './pages/student/JourneyPage';
import { SavedPage } from './pages/student/SavedPage';
import { ApplicationsKanban } from './pages/student/ApplicationsKanban';
import { CompanyDashboard } from './pages/company/CompanyDashboard';
import { AdminDashboard } from './pages/admin/AdminDashboard';

// Route guards
const ProtectedRoute: React.FC<{ children: React.ReactNode; allowedRoles?: string[] }> = ({
  children,
  allowedRoles,
}) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === 'student') return <Navigate to="/dashboard" replace />;
    if (user.role === 'company') return <Navigate to="/company" replace />;
    if (user.role === 'admin') return <Navigate to="/admin" replace />;
  }

  return <>{children}</>;
};

export const AppContent: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      <Navbar />
      <main className="flex-1">
        <Routes>
          {/* Public Pages */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/internships" element={<InternshipExplore />} />
          <Route path="/internships/:id" element={<InternshipDetailPage />} />

          {/* Student Flow */}
          <Route
            path="/onboarding"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <OnboardingWizard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/skill-gap"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <SkillGapPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/journey"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <JourneyPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/saved"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <SavedPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/applications"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <ApplicationsKanban />
              </ProtectedRoute>
            }
          />

          {/* Company Portal */}
          <Route
            path="/company"
            element={
              <ProtectedRoute allowedRoles={['company', 'admin']}>
                <CompanyDashboard />
              </ProtectedRoute>
            }
          />

          {/* Admin Oversight */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}
