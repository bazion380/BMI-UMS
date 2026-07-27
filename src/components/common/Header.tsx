import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { 
  GraduationCap, 
  ShieldCheck, 
  Search, 
  Bell, 
  FileText, 
  UserCheck, 
  Sparkles, 
  ChevronDown,
  RotateCcw,
  Globe,
  ExternalLink
} from 'lucide-react';

interface HeaderProps {
  onOpenAuditLog: () => void;
  onOpenSearch: () => void;
  onOpenLogin: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenAuditLog, onOpenSearch, onOpenLogin }) => {
  const { 
    currentPortal, 
    setCurrentPortal, 
    activeRole, 
    setActiveRole, 
    students, 
    activeStudentId, 
    setActiveStudentId,
    auditLogs,
    resetDemoData,
    authToken,
    authUser
  } = useApp();

  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showStudentDropdown, setShowStudentDropdown] = useState(false);

  const activeStudent = students.find(s => s.id === activeStudentId) || students[0];

  const staffRoles: { role: UserRole; title: string; category: string }[] = [
    { role: 'president', title: 'President / Vice-Chancellor', category: 'Executive' },
    { role: 'registrar', title: 'Registrar', category: 'Academic Admin' },
    { role: 'lecturer', title: 'Lecturer / Faculty', category: 'Academic Staff' },
    { role: 'admissions', title: 'Admissions Officer', category: 'Student Intake' },
    { role: 'finance', title: 'Finance Officer / Bursar', category: 'Financial Services' },
    { role: 'exam_officer', title: 'Examination Officer', category: 'Academic Admin' },
    { role: 'hr_manager', title: 'HR Manager', category: 'Operations' },
    { role: 'advisor', title: 'Student Affairs / Advisor', category: 'Student Life' },
    { role: 'librarian', title: 'Librarian', category: 'Campus Resources' },
    { role: 'alumni_officer', title: 'Alumni Relations Officer', category: 'External Relations' },
    { role: 'it_admin', title: 'IT / System Admin', category: 'System Operations' },
  ];

  const getRoleLabel = (r: UserRole) => {
    if (r === 'student') return 'Student Portal';
    const found = staffRoles.find(item => item.role === r);
    return found ? found.title : r.toUpperCase();
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900 text-white border-b border-slate-800 shadow-md">
      {/* Top Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center shadow-lg shadow-indigo-500/30 ring-2 ring-indigo-400/20">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg tracking-tight text-white">BMI UNIVERSITY</span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  UMS
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">Unified Lifecycle Platform</p>
            </div>
          </div>

          {/* Center: UMS Internal Portal Switcher Pill */}
          <div className="hidden md:flex items-center bg-slate-800/80 p-1 rounded-xl border border-slate-700/60 shadow-inner">
            <button
              onClick={() => setCurrentPortal('student')}
              className={`flex items-center space-x-2 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentPortal === 'student'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Student Portal</span>
            </button>

            <button
              onClick={() => setCurrentPortal('staff')}
              className={`flex items-center space-x-2 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentPortal === 'staff'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Staff / Admin</span>
            </button>
          </div>

          {/* Right Controls */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* Link to Separate Public University Website */}
            <a
              href="https://www.bmi.edu"
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => {
                e.preventDefault();
                alert('Redirecting to the separate Public University Website (https://www.bmi.edu).\n\nThe Public Website operates on a separate domain/URL and connects to this UMS via secure API integration.');
              }}
              className="hidden lg:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/70 hover:bg-emerald-900/90 text-emerald-300 border border-emerald-800/60 text-xs font-semibold transition"
              title="Open Separate Public University Website (www.bmi.edu)"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              <span>Public Website</span>
              <ExternalLink className="w-3 h-3 text-emerald-400 opacity-75" />
            </a>
            
            {/* Search Trigger */}
            <button
              onClick={onOpenSearch}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700/80 text-slate-300 hover:text-white border border-slate-700 transition flex items-center space-x-2 text-xs"
              title="Global Search"
            >
              <Search className="w-4 h-4 text-indigo-400" />
              <span className="hidden lg:inline text-slate-400">Search... (Ctrl+K)</span>
            </button>

            {/* Security Login Trigger */}
            <button
              onClick={onOpenLogin}
              className={`p-2 rounded-lg border transition flex items-center space-x-1.5 text-xs ${
                authToken
                  ? 'bg-emerald-950/80 hover:bg-emerald-900 border-emerald-700/60 text-emerald-300'
                  : 'bg-indigo-950/80 hover:bg-indigo-900 border-indigo-700/60 text-indigo-300'
              }`}
              title={authToken ? `Authenticated as ${authUser?.name}` : 'Login & Issue JWT Token'}
            >
              <ShieldCheck className={`w-4 h-4 ${authToken ? 'text-emerald-400' : 'text-indigo-400'}`} />
              <span className="hidden sm:inline font-semibold">
                {authToken ? (authUser?.role || 'Auth Active') : 'Login'}
              </span>
            </button>

            {/* Audit Trail Badge Trigger */}
            <button
              onClick={onOpenAuditLog}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition flex items-center space-x-1.5 text-xs relative"
              title="View Security & Audit Trail"
            >
              <FileText className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline font-mono text-[11px] text-emerald-300 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/50">
                Audit ({auditLogs.length})
              </span>
            </button>

            {/* Student Switcher Dropdown (when in Student Portal) */}
            {currentPortal === 'student' && (
              <div className="relative">
                <button
                  onClick={() => setShowStudentDropdown(!showStudentDropdown)}
                  className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-white"
                >
                  <img
                    src={activeStudent?.avatarUrl}
                    alt={activeStudent?.firstName}
                    className="w-5 h-5 rounded-full object-cover ring-1 ring-indigo-400"
                  />
                  <span className="font-medium max-w-[100px] truncate">
                    {activeStudent?.firstName} {activeStudent?.lastName}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {showStudentDropdown && (
                  <div className="absolute right-0 mt-2 w-64 bg-slate-800 rounded-xl shadow-2xl border border-slate-700 p-2 z-50 text-xs">
                    <p className="text-[10px] uppercase font-bold text-slate-400 px-2 py-1 tracking-wider">
                      Switch Student Profile
                    </p>
                    <div className="space-y-1">
                      {students.map(std => (
                        <button
                          key={std.id}
                          onClick={() => {
                            setActiveStudentId(std.id);
                            setShowStudentDropdown(false);
                          }}
                          className={`w-full text-left px-2.5 py-2 rounded-lg flex items-center space-x-2.5 transition ${
                            std.id === activeStudentId
                              ? 'bg-indigo-600/30 border border-indigo-500/50 text-indigo-200'
                              : 'hover:bg-slate-700 text-slate-300'
                          }`}
                        >
                          <img src={std.avatarUrl} className="w-6 h-6 rounded-full object-cover" />
                          <div className="truncate">
                            <p className="font-semibold text-white truncate">{std.firstName} {std.lastName}</p>
                            <p className="text-[10px] text-slate-400">{std.studentNumber} • GPA: {std.gpa}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Role Switcher Dropdown (when in Staff Portal) */}
            {currentPortal === 'staff' && (
              <div className="relative">
                <button
                  onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                  className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-700 to-indigo-700 text-white font-medium text-xs shadow-md ring-1 ring-blue-400/30"
                >
                  <Sparkles className="w-3.5 h-3.5 text-blue-200" />
                  <span>Role: {getRoleLabel(activeRole)}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-blue-200" />
                </button>

                {showRoleDropdown && (
                  <div className="absolute right-0 mt-2 w-72 bg-slate-900 rounded-xl shadow-2xl border border-slate-700 p-2 z-50 text-xs max-h-96 overflow-y-auto">
                    <p className="text-[10px] uppercase font-bold text-slate-400 px-2.5 py-1 tracking-wider">
                      Switch Staff View (11 Roles)
                    </p>
                    <div className="space-y-1 mt-1">
                      {staffRoles.map(item => (
                        <button
                          key={item.role}
                          onClick={() => {
                            setActiveRole(item.role);
                            setShowRoleDropdown(false);
                          }}
                          className={`w-full text-left px-2.5 py-2 rounded-lg flex items-center justify-between transition ${
                            activeRole === item.role
                              ? 'bg-blue-600 text-white font-semibold'
                              : 'hover:bg-slate-800 text-slate-300'
                          }`}
                        >
                          <span>{item.title}</span>
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                            {item.category}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Reset Demo Data Button */}
            <button
              onClick={() => {
                if (confirm('Reset all demo data back to initial seed state?')) {
                  resetDemoData();
                }
              }}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 border border-slate-700 transition"
              title="Reset Demo Data"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

          </div>
        </div>
      </div>

      {/* Mobile Portal Navigation Bar */}
      <div className="md:hidden bg-slate-950 border-t border-slate-800 px-4 py-2 flex items-center justify-around text-xs">
        <button
          onClick={() => setCurrentPortal('student')}
          className={`flex items-center space-x-1.5 px-3 py-1 rounded-md font-medium ${
            currentPortal === 'student' ? 'bg-indigo-600 text-white' : 'text-slate-400'
          }`}
        >
          <UserCheck className="w-3.5 h-3.5" />
          <span>Student Portal</span>
        </button>
        <button
          onClick={() => setCurrentPortal('staff')}
          className={`flex items-center space-x-1.5 px-3 py-1 rounded-md font-medium ${
            currentPortal === 'staff' ? 'bg-blue-600 text-white' : 'text-slate-400'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Staff Dashboard</span>
        </button>
      </div>
    </header>
  );
};
