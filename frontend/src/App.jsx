import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext.jsx';
import { ToastProvider } from './context/ToastContext.jsx';
import { NotificationProvider } from './context/NotificationContext.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import ThreeBackground from './components/ThreeBackground.jsx';
import Sidebar from './components/Sidebar.jsx';
import NavBar from './components/NavBar.jsx';
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
import Profile from './pages/Profile.jsx';
import { AnimatePresence, motion } from 'framer-motion';

const pageVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 }
};

function AppShell({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <div className={`layout-container ${collapsed ? 'sidebar-collapsed' : 'sidebar-expanded'}`}>
      <Sidebar 
        collapsed={collapsed} 
        setCollapsed={setCollapsed} 
        open={mobileOpen} 
        onClose={() => setMobileOpen(false)} 
      />
      
      <div className="main-wrapper">
        <NavBar onMenuClick={() => setMobileOpen(true)} />
        <main className="page-content" style={{ padding: '24px', flex: 1 }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={location.key}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              <ErrorBoundary>{children}</ErrorBoundary>
            </motion.div>
          </AnimatePresence>
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
        <NotificationProvider>
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
                  <Route path="/profile" element={<ProtectedShell><Profile /></ProtectedShell>} />
                  <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
              </div>
            </BrowserRouter>
          </ToastProvider>
        </NotificationProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
