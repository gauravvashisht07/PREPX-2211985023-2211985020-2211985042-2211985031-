import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { AuthProvider } from './context/AuthContext.jsx';
import { ToastProvider } from './context/ToastContext.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import ThreeBackground from './components/ThreeBackground.jsx';
import Sidebar from './components/Sidebar.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import Dashboard from './pages/Dashboard.jsx';
import QuestionBank from './pages/QuestionBank.jsx';
import MCQ from './pages/MCQ.jsx';
import MockInterview from './pages/MockInterview.jsx';
import ResumeBuilder from './pages/ResumeBuilder.jsx';
import Progress from './pages/Progress.jsx';
import DailyChallenge from './pages/DailyChallenge.jsx';
import CompanyWise from './pages/CompanyWise.jsx';
import Notes from './pages/Notes.jsx';
import TodoPlanner from './pages/TodoPlanner.jsx';
import { Bell } from 'lucide-react';

const pageTitles = {
  '/dashboard': 'Dashboard', '/questions': 'Question Bank', '/mcq': 'MCQ Practice',
  '/mock': 'Mock Interview', '/daily': 'Daily Challenge',
  '/progress': 'My Progress', '/companies': 'Company-Wise',
  '/resume': 'Resume Builder', '/notes': 'Notes & Roadmap',
  '/todos': 'To-Do Planner',
};

function AppShell({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const title = pageTitles[location.pathname] || 'Prepx';

  return (
    <div className="app-shell">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="main-content" style={{ position: 'relative', zIndex: 1 }}>
        <header className="topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <button className="hamburger" onClick={() => setSidebarOpen(v => !v)} aria-label="Toggle menu">
              <span /><span /><span />
            </button>
            <span className="topbar-title">{title}</span>
          </div>
          <div className="topbar-actions">
            <button style={{ background: 'none', border: '1px solid var(--border)', borderRadius: '8px', padding: '7px 9px', cursor: 'pointer', color: 'var(--text-secondary)' }}>
              <Bell size={17} />
            </button>
          </div>
        </header>
        <main className="page-content">
          <ErrorBoundary>{children}</ErrorBoundary>
        </main>
      </div>
    </div>
  );
}

function ProtectedShell({ children }) {
  return (
    <ProtectedRoute>
      <AppShell>{children}</AppShell>
    </ProtectedRoute>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ToastProvider>
          <BrowserRouter>
            <ThreeBackground />
            <div style={{ position: 'relative', zIndex: 1, minHeight: '100vh' }}>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/dashboard" element={<ProtectedShell><Dashboard /></ProtectedShell>} />
                <Route path="/questions" element={<ProtectedShell><QuestionBank /></ProtectedShell>} />
                <Route path="/mcq" element={<ProtectedShell><MCQ /></ProtectedShell>} />
                <Route path="/mock" element={<ProtectedShell><MockInterview /></ProtectedShell>} />
                <Route path="/resume" element={<ProtectedShell><ResumeBuilder /></ProtectedShell>} />
                <Route path="/progress" element={<ProtectedShell><Progress /></ProtectedShell>} />
                <Route path="/daily" element={<ProtectedShell><DailyChallenge /></ProtectedShell>} />
                <Route path="/companies" element={<ProtectedShell><CompanyWise /></ProtectedShell>} />
                <Route path="/notes" element={<ProtectedShell><Notes /></ProtectedShell>} />
                <Route path="/todos" element={<ProtectedShell><TodoPlanner /></ProtectedShell>} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </div>
          </BrowserRouter>
        </ToastProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
