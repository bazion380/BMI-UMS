import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { AuditLogModal } from './components/common/AuditLogModal';
import { GlobalSearchModal } from './components/common/GlobalSearchModal';
import { StudentPortal } from './components/student/StudentPortal';
import { AdminDashboard } from './components/admin/AdminDashboard';

const MainLayout: React.FC = () => {
  const { currentPortal } = useApp();
  const [isAuditLogOpen, setIsAuditLogOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

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

      {/* Primary Portal Switch View */}
      {currentPortal === 'student' ? (
        <StudentPortal />
      ) : (
        <AdminDashboard />
      )}

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
