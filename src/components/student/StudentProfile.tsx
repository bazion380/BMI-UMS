import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { User, ShieldCheck, FileCheck, Phone, Mail, MapPin, QrCode, Edit2, X, CheckCircle2, Lock, Printer } from 'lucide-react';
import { 
  SecurityWatermark, 
  GuillochePattern, 
  MicrotextBorder, 
  SecuritySealBadge 
} from '../common/DocumentSecurityComponents';

export const StudentProfile: React.FC = () => {
  const { students, activeStudentId, updateStudentProfile } = useApp();
  const student = students.find(s => s.id === activeStudentId) || students[0];

  const [showDigitalIdModal, setShowDigitalIdModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Profile Form State
  const [phone, setPhone] = useState(student.phone);
  const [email, setEmail] = useState(student.email);
  const [guardianName, setGuardianName] = useState(student.guardianName);
  const [guardianPhone, setGuardianPhone] = useState(student.guardianPhone);
  const [guardianEmail, setGuardianEmail] = useState(student.guardianEmail);
  const [guardianRelation, setGuardianRelation] = useState(student.guardianRelation);
  const [avatarUrl, setAvatarUrl] = useState(student.avatarUrl);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateStudentProfile(student.id, {
      phone,
      email,
      guardianName,
      guardianPhone,
      guardianEmail,
      guardianRelation,
      avatarUrl
    });

    setShowEditModal(false);
    setSuccessMsg('Student profile and emergency contact information updated successfully.');
    setTimeout(() => setSuccessMsg(null), 3500);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center space-x-2">
            <User className="w-6 h-6 text-indigo-400" />
            <span>Canonical Student Record & Profile</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Personal biographic information, emergency contacts, verified document vault, and biometric ID pass.
          </p>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={() => setShowEditModal(true)}
            className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-300 font-medium text-xs border border-slate-700 transition flex items-center space-x-1.5"
          >
            <Edit2 className="w-4 h-4" />
            <span>Edit Profile Details</span>
          </button>
          <button
            onClick={() => setShowDigitalIdModal(true)}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs shadow-lg shadow-indigo-600/30 transition flex items-center space-x-2 shrink-0"
          >
            <QrCode className="w-4 h-4" />
            <span>View Digital Student ID Card</span>
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/50 text-emerald-200 text-xs flex items-center space-x-2 shadow-md">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-semibold">{successMsg}</span>
        </div>
      )}

      {/* Profile Overview Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md space-y-6 text-xs">
        
        {/* Top Avatar & Name */}
        <div className="flex items-center space-x-4 border-b border-slate-800 pb-5">
          <img
            src={student.avatarUrl}
            alt={student.firstName}
            className="w-20 h-20 rounded-2xl object-cover ring-2 ring-indigo-500 shadow-xl"
          />
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-bold text-white">{student.firstName} {student.lastName}</h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {student.studentNumber}
              </span>
            </div>
            <p className="text-slate-400 mt-1">{student.program} • {student.department}</p>
            <p className="text-emerald-400 font-semibold mt-0.5">Status: {student.academicStatus} Student</p>
          </div>
        </div>

        {/* Personal Details Grid */}
        <div>
          <h3 className="font-bold text-slate-400 uppercase text-[10px] tracking-wider mb-3">Biographic & Identification Credentials</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-3.5 rounded-xl bg-indigo-950/60 border border-indigo-700/60">
              <span className="text-indigo-300 text-[10px] font-bold uppercase tracking-wider block">#1. Permanent Lifetime Student UID</span>
              <span className="font-bold font-mono text-base text-white mt-1 block">{student.studentUid || 'BMI00002T'}</span>
              <span className="text-[10px] text-indigo-400/80 block mt-0.5">Immutable lifetime key across all university records</span>
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-700/60">
              <span className="text-emerald-300 text-[10px] font-bold uppercase tracking-wider block">#2. Primary Career Registration No</span>
              <span className="font-bold font-mono text-base text-white mt-1 block">{student.registrationNumber || student.studentNumber}</span>
              <span className="text-[10px] text-emerald-400/80 block mt-0.5">Career path & program registration ID ({student.career || 'UG'})</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
              <span className="text-slate-400 text-[10px] block">University Email</span>
              <span className="font-bold text-white mt-1 block">{student.email}</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
              <span className="text-slate-400 text-[10px] block">Phone Number</span>
              <span className="font-bold text-white mt-1 block">{student.phone}</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
              <span className="text-slate-400 text-[10px] block">Date of Birth</span>
              <span className="font-bold text-white mt-0.5 block">{student.dateOfBirth}</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
              <span className="text-slate-400 text-[10px] block">National Identity No.</span>
              <span className="font-bold font-mono text-white mt-0.5 block">{student.nationalId}</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
              <span className="text-slate-400 text-[10px] block">Gender / Nationality</span>
              <span className="font-bold text-white mt-0.5 block">{student.gender} • {student.nationality}</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
              <span className="text-slate-400 text-[10px] block">Cohort Year</span>
              <span className="font-bold text-white mt-0.5 block">Class of {student.cohortYear + 4} (Entry {student.cohortYear})</span>
            </div>
          </div>
        </div>

        {/* Guardian & Emergency Info */}
        <div className="pt-4 border-t border-slate-800">
          <h3 className="font-bold text-slate-400 uppercase text-[10px] tracking-wider mb-3">Guardian & Emergency Contact</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
              <p className="font-bold text-white">{student.guardianName} ({student.guardianRelation})</p>
              <p className="text-slate-400 mt-1">Phone: {student.guardianPhone}</p>
              <p className="text-slate-400">Email: {student.guardianEmail}</p>
            </div>
          </div>
        </div>

        {/* Verified Document Vault */}
        <div className="pt-4 border-t border-slate-800">
          <h3 className="font-bold text-slate-400 uppercase text-[10px] tracking-wider mb-3">Verified Document Vault</h3>
          <div className="space-y-2">
            {[
              { title: 'High School Official Transcript.pdf', date: 'Verified 2024-08-01' },
              { title: 'National Identity / Passport Copy.pdf', date: 'Verified 2024-08-01' },
              { title: 'Medical Fitness & Immunization Pass.pdf', date: 'Verified 2024-08-05' }
            ].map((doc, i) => (
              <div key={i} className="p-3 rounded-xl bg-slate-800/40 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <FileCheck className="w-4 h-4 text-emerald-400" />
                  <span className="font-medium text-white">{doc.title}</span>
                </div>
                <span className="text-[10px] text-emerald-400 font-mono">{doc.date}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Digital Student ID Modal */}
      {showDigitalIdModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-slate-900 border border-indigo-500/40 rounded-3xl p-6 max-w-md w-full text-white space-y-4 shadow-2xl relative overflow-hidden">
            <button
              onClick={() => setShowDigitalIdModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white z-20"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Visual Student ID Card */}
            <div className="printable-document bg-gradient-to-br from-indigo-950 via-slate-900 to-blue-950 p-6 rounded-2xl border-2 border-indigo-500/50 shadow-2xl text-center space-y-3 relative overflow-hidden">
              <GuillochePattern />
              <SecurityWatermark text="BMI DIGITAL PASSPORT" subtext="VERIFIED CREDENTIAL" />

              <div className="text-center relative z-10 border-b border-indigo-900/60 pb-2">
                <p className="font-bold text-sm tracking-widest text-white">BMI UNIVERSITY</p>
                <p className="text-[9px] uppercase tracking-widest text-indigo-300 font-bold">OFFICIAL DIGITAL STUDENT PASSPORT</p>
              </div>

              <div className="relative z-10">
                <img
                  src={student.avatarUrl}
                  alt={student.firstName}
                  className="w-24 h-24 rounded-2xl object-cover ring-2 ring-indigo-400 mx-auto shadow-lg"
                />
              </div>

              <div className="relative z-10">
                <h2 className="text-lg font-bold text-white">{student.firstName} {student.lastName}</h2>
                <p className="text-xs text-indigo-300 font-mono font-bold">{student.studentNumber}</p>
                <p className="text-[11px] text-slate-300 mt-1">{student.program}</p>
                <p className="text-[10px] text-slate-400">Department: {student.department}</p>
              </div>

              <MicrotextBorder text="• BMI DIGITAL PASSPORT SEC-2026 • REGISTRAR AUTHENTICATED CREDENTIAL " />

              <div className="relative z-10">
                <SecuritySealBadge
                  docType="Digital Student Passport"
                  docId={student.studentNumber}
                  securityHash={`SEC-ID-${student.id}-${student.studentNumber}`}
                />
              </div>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition flex items-center justify-center space-x-1"
              >
                <Printer className="w-4 h-4" />
                <span>Print / Save Passport PDF</span>
              </button>
              <button
                onClick={() => setShowDigitalIdModal(false)}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 text-slate-100 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="font-bold text-white text-base">Edit Student Profile Information</h2>
              <button onClick={() => setShowEditModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Avatar Image URL</label>
                <input
                  type="text"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                  required
                />
              </div>

              <div className="pt-2 border-t border-slate-800">
                <h3 className="font-bold text-slate-300 mb-2">Guardian / Emergency Contact</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Guardian Name</label>
                    <input
                      type="text"
                      value={guardianName}
                      onChange={(e) => setGuardianName(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Relationship</label>
                    <input
                      type="text"
                      value={guardianRelation}
                      onChange={(e) => setGuardianRelation(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Guardian Phone</label>
                    <input
                      type="text"
                      value={guardianPhone}
                      onChange={(e) => setGuardianPhone(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Guardian Email</label>
                    <input
                      type="email"
                      value={guardianEmail}
                      onChange={(e) => setGuardianEmail(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                      required
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition mt-4"
              >
                Save Profile Changes
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
