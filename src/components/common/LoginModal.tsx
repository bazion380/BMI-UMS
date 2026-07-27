import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { 
  ShieldCheck, 
  KeyRound, 
  UserCheck, 
  Lock, 
  X, 
  CheckCircle2, 
  AlertCircle,
  Building2,
  GraduationCap
} from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { setActiveRole, setAuthToken, authToken, authUser, setAuthUser } = useApp();
  
  const [selectedRole, setSelectedRole] = useState<UserRole>('president');
  const [passcode, setPasscode] = useState('123456');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const staffRoles: { role: UserRole; title: string; category: string; description: string }[] = [
    { role: 'president', title: 'President / Vice-Chancellor', category: 'Executive', description: 'Full executive approval override & institutional governance' },
    { role: 'registrar', title: 'Registrar', category: 'Academic Admin', description: 'SIS master records, registration numbers & transcript issuance' },
    { role: 'admissions', title: 'Admissions Officer', category: 'Student Intake', description: 'Application processing, CRM pipeline & automated student enrollment' },
    { role: 'finance', title: 'Finance Officer / Bursar', category: 'Financial Services', description: 'Fee invoices, payment processing & financial holds clearance' },
    { role: 'lecturer', title: 'Lecturer / Faculty', category: 'Academic Staff', description: 'Course grading, attendance logs & academic submissions' },
    { role: 'exam_officer', title: 'Examination Officer', category: 'Academic Admin', description: 'Grade auditing, GPA calculations & academic transcript verification' },
    { role: 'advisor', title: 'Student Advisor', category: 'Student Life', description: 'Academic counseling, advising logs & probation overrides' },
    { role: 'student', title: 'Student Portal User', category: 'Student Self-Service', description: 'Course registration, grade view, transcript download & fee payment' },
  ];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: selectedRole, passcode }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      // Store JWT token & Auth User
      setAuthToken(data.token);
      setAuthUser(data.user);
      setActiveRole(selectedRole);
      
      setSuccessMsg(`Authenticated as ${data.user.name}`);
      setTimeout(() => {
        onClose();
      }, 800);
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Top Banner */}
        <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white flex items-center space-x-2">
                <span>BMI UMS Security Gateway</span>
              </h2>
              <p className="text-xs text-slate-400">Bearer JWT Credential Verification & Role-Based Access Control</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800/80 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleLogin} className="p-6 space-y-6">
          {authToken && authUser && (
            <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-xl p-3 flex items-center justify-between text-xs text-emerald-300">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Currently authenticated as <strong>{authUser.name}</strong> ({authUser.role})</span>
              </div>
              <span className="font-mono text-[10px] bg-emerald-900/50 px-2 py-0.5 rounded border border-emerald-500/30">Token Active</span>
            </div>
          )}

          {error && (
            <div className="bg-red-950/40 border border-red-500/30 rounded-xl p-3 flex items-center space-x-2 text-xs text-red-300">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="bg-indigo-950/40 border border-indigo-500/30 rounded-xl p-3 flex items-center space-x-2 text-xs text-indigo-300">
              <CheckCircle2 className="w-4 h-4 text-indigo-400 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Select Institutional Role to Authenticate
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
              {staffRoles.map(item => (
                <button
                  type="button"
                  key={item.role}
                  onClick={() => setSelectedRole(item.role)}
                  className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                    selectedRole === item.role
                      ? 'bg-indigo-600/20 border-indigo-500 text-white ring-2 ring-indigo-500/30'
                      : 'bg-slate-800/40 border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs flex items-center space-x-1.5">
                      {item.role === 'student' ? <GraduationCap className="w-3.5 h-3.5 text-indigo-400" /> : <Building2 className="w-3.5 h-3.5 text-blue-400" />}
                      <span>{item.title}</span>
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-900/60 font-medium text-slate-400">
                      {item.category}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-2">{item.description}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Passcode / Security Key
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={passcode}
                  onChange={e => setPasscode(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 font-mono"
                  placeholder="Enter passcode"
                />
                <KeyRound className="absolute right-3 top-3 w-4 h-4 text-slate-500" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Security Standard
              </label>
              <div className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-400 flex items-center justify-between h-[42px]">
                <span className="flex items-center space-x-1.5">
                  <Lock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Base64 JWT API Token</span>
                </span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-mono font-bold">256-BIT</span>
              </div>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end space-x-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition flex items-center space-x-2 shadow-lg shadow-indigo-600/30"
            >
              <UserCheck className="w-4 h-4" />
              <span>{isSubmitting ? 'Authenticating...' : 'Authenticate & Issue Token'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
