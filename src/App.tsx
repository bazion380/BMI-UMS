import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { AuditLogModal } from './components/common/AuditLogModal';
import { GlobalSearchModal } from './components/common/GlobalSearchModal';
import { StudentPortal } from './components/student/StudentPortal';
import { AdminDashboard } from './components/admin/AdminDashboard';

const MainLayout: React.FC = () => {
  const { currentPortal, setCurrentPortal } = useApp();
  const [isAuditLogOpen, setIsAuditLogOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Synchronize route paths with currentPortal state for deep-linking support
  useEffect(() => {
    if (location.pathname.startsWith('/staff') && currentPortal !== 'staff') {
      setCurrentPortal('staff');
    } else if (location.pathname.startsWith('/student') && currentPortal !== 'student') {
      setCurrentPortal('student');
    }
  }, [location.pathname, currentPortal, setCurrentPortal]);

  // Synchronize portal state changes with URL router
  useEffect(() => {
    if (currentPortal === 'staff' && !location.pathname.startsWith('/staff')) {
      navigate('/staff', { replace: true });
    } else if (currentPortal === 'student' && !location.pathname.startsWith('/student')) {
      navigate('/student', { replace: true });
    }
  }, [currentPortal]);

  // Keyboard shortcut for search (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Header Bar */}
      <Header
        onOpenAuditLog={() => setIsAuditLogOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      {/* Primary Client-Side Router View */}
      <main>
        <Routes>
          <Route path="/" element={<Navigate to="/student" replace />} />
          <Route path="/student/*" element={<StudentPortal />} />
          <Route path="/staff/*" element={<AdminDashboard />} />
          <Route path="*" element={<Navigate to={`/${currentPortal}`} replace />} />
        </Routes>
      </main>

      {/* Global Modals */}
      <AuditLogModal
        isOpen={isAuditLogOpen}
        onClose={() => setIsAuditLogOpen(false)}
      />

      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
