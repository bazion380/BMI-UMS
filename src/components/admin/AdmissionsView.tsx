import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  FileCheck, 
  UserPlus, 
  CheckCircle2, 
  Sparkles, 
  Eye, 
  FileText,
  X,
  Check,
  XCircle,
  ShieldCheck,
  Printer
} from 'lucide-react';
import { Application } from '../../types';
import { 
  SecurityWatermark, 
  GuillochePattern, 
  MicrotextBorder, 
  SecuritySealBadge 
} from '../common/DocumentSecurityComponents';

export const AdmissionsView: React.FC = () => {
  const { 
    applications, 
    convertApplicationToStudent, 
    runAutomatedApplicationPipeline,
    addApplication, 
    updateApplicationStatus, 
    updateApplicationDocumentStatus 
  } = useApp();

  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [offerModalApp, setOfferModalApp] = useState<Application | null>(null);
  const [conversionSuccessMsg, setConversionSuccessMsg] = useState<string | null>(null);

  // New Application Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newApplicantName, setNewApplicantName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newProgram, setNewProgram] = useState('B.Sc. Computer Science');
  const [newGPA, setNewGPA] = useState(3.85);

  const handleRunPipeline = (appId: string) => {
    try {
      const res = runAutomatedApplicationPipeline(appId);
      setConversionSuccessMsg(
        `⚡ 100% AUTOMATED PIPELINE EXECUTED! Student ${res.student.firstName} ${res.student.lastName} enrolled! Permanent UID: ${res.student.studentUid} | Registration No: ${res.student.registrationNumber} | Tuition Invoice Settled ($3,800) | Enrolled in ${res.autoEnrolledCoursesCount} core courses!`
      );
      setSelectedApp(null);
      setTimeout(() => setConversionSuccessMsg(null), 8000);
    } catch (e: any) {
      alert(e.message);
    }
  };

  const handleConvert = (appId: string) => {
    try {
      const createdStudent = convertApplicationToStudent(appId);
      setConversionSuccessMsg(
        `SUCCESS! Applicant transformed into SIS Record: ${createdStudent.firstName} ${createdStudent.lastName} (UID: ${createdStudent.studentUid} | Reg No: ${createdStudent.registrationNumber}). Portal login active!`
      );
      setSelectedApp(null);
      setTimeout(() => setConversionSuccessMsg(null), 6000);
    } catch (e: any) {
      alert(e.message);
    }
  };

  const handleAddApplicant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newApplicantName || !newEmail) return;

    addApplication({
      applicantName: newApplicantName,
      email: newEmail,
      phone: newPhone || '+1 (555) 000-1122',
      programApplied: newProgram,
      department: 'School of Computing & Engineering',
      highSchoolGPA: newGPA,
      testScore: 'SAT 1400'
    });

    setShowAddModal(false);
    setNewApplicantName('');
    setNewEmail('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center space-x-2">
            <FileCheck className="w-6 h-6 text-indigo-400" />
            <span>Admissions CRM & Enrollment Pipeline</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Enquiry management, document verification, offer letters, and 1-click conversion to canonical SIS student records.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs shadow-lg transition flex items-center space-x-2 shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          <span>New Prospect Application</span>
        </button>
      </div>

      {conversionSuccessMsg && (
        <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/60 text-emerald-200 text-xs flex items-center space-x-3 shadow-xl animate-bounce">
          <Sparkles className="w-6 h-6 text-emerald-400 shrink-0" />
          <span className="font-semibold leading-relaxed">{conversionSuccessMsg}</span>
        </div>
      )}

      {/* CRM Application Pipeline Cards */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md space-y-4">
        <h2 className="font-bold text-white text-base">Active Applications Pipeline</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase font-bold text-[10px]">
                <th className="p-3">App Number</th>
                <th className="p-3">Applicant Name</th>
                <th className="p-3">Program Applied</th>
                <th className="p-3">High School GPA</th>
                <th className="p-3">Pipeline Stage</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {applications.map(app => (
                <tr key={app.id} className="hover:bg-slate-800/40 transition">
                  <td className="p-3 font-mono font-bold text-emerald-300">{app.applicationNumber}</td>
                  <td className="p-3 font-semibold text-white">{app.applicantName}</td>
                  <td className="p-3 text-slate-300">{app.programApplied}</td>
                  <td className="p-3 font-mono text-white">{app.highSchoolGPA}</td>
                  <td className="p-3">
                    <select
                      value={app.status}
                      onChange={(e) => updateApplicationStatus(app.id, e.target.value as any)}
                      className="bg-slate-800 border border-slate-700 rounded-lg text-xs px-2 py-1 text-indigo-300 font-bold focus:outline-none"
                    >
                      <option value="Under Review">Under Review</option>
                      <option value="Interview Scheduled">Interview Scheduled</option>
                      <option value="Offer Extended">Offer Extended</option>
                      <option value="Accepted">Accepted</option>
                      <option value="Enrolled">Enrolled</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </td>
                  <td className="p-3 text-right space-x-2">
                    <button
                      onClick={() => setSelectedApp(app)}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-medium transition"
                    >
                      Verify Documents
                    </button>

                    <button
                      onClick={() => setOfferModalApp(app)}
                      className="px-2.5 py-1 bg-indigo-900/60 hover:bg-indigo-800/80 text-indigo-300 border border-indigo-500/30 rounded-lg font-medium transition flex items-center space-x-1 inline-flex"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Offer Letter</span>
                    </button>

                    {app.status !== 'Enrolled' && (
                      <button
                        onClick={() => handleConvert(app.id)}
                        className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold transition flex items-center space-x-1 inline-flex"
                      >
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>1-Click SIS Enrollment</span>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspect Application & Verify Documents Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 text-slate-100 rounded-2xl w-full max-w-xl p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="font-bold text-white text-base">Application Verification — #{selectedApp.applicationNumber}</h2>
              <button onClick={() => setSelectedApp(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 p-4 bg-slate-800/60 rounded-xl">
              <p><strong className="text-slate-400">Applicant:</strong> {selectedApp.applicantName}</p>
              <p><strong className="text-slate-400">Email / Phone:</strong> {selectedApp.email} • {selectedApp.phone}</p>
              <p><strong className="text-slate-400">Program:</strong> {selectedApp.programApplied}</p>
              <p><strong className="text-slate-400">Reviewer Notes:</strong> {selectedApp.reviewerNotes || 'Standard candidate'}</p>
            </div>

            <div>
              <h3 className="font-bold text-slate-300 mb-2">Uploaded Verification Documents</h3>
              <div className="space-y-2">
                {selectedApp.documents.map((doc, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-white">{doc.name}</p>
                      <p className="text-[10px] text-slate-400 font-mono">Status: <span className="text-amber-400 font-bold">{doc.status}</span></p>
                    </div>

                    <div className="flex space-x-1.5">
                      <button
                        onClick={() => {
                          updateApplicationDocumentStatus(selectedApp.id, doc.name, 'Verified');
                          setSelectedApp({
                            ...selectedApp,
                            documents: selectedApp.documents.map(d => d.name === doc.name ? { ...d, status: 'Verified' } : d)
                          });
                        }}
                        className="p-1.5 bg-emerald-600/30 text-emerald-300 hover:bg-emerald-600/50 rounded-lg flex items-center space-x-1 text-[10px] font-bold"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Approve</span>
                      </button>
                      <button
                        onClick={() => {
                          updateApplicationDocumentStatus(selectedApp.id, doc.name, 'Rejected');
                          setSelectedApp({
                            ...selectedApp,
                            documents: selectedApp.documents.map(d => d.name === doc.name ? { ...d, status: 'Rejected' } : d)
                          });
                        }}
                        className="p-1.5 bg-rose-600/30 text-rose-300 hover:bg-rose-600/50 rounded-lg flex items-center space-x-1 text-[10px] font-bold"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-3 pt-3">
              {selectedApp.status !== 'Enrolled' && (
                <>
                  <button
                    onClick={() => handleRunPipeline(selectedApp.id)}
                    className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl transition shadow-md flex items-center space-x-1.5"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>⚡ Run 100% Automated Pipeline</span>
                  </button>
                  <button
                    onClick={() => handleConvert(selectedApp.id)}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition flex items-center space-x-1.5"
                  >
                    <FileCheck className="w-4 h-4" />
                    <span>Manual Convert to SIS Record</span>
                  </button>
                </>
              )}
              <button
                onClick={() => setSelectedApp(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium"
              >
                Close Review
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Prospect Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 text-slate-100 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="font-bold text-white text-base">Add New Prospect Application</h2>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddApplicant} className="space-y-3">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Applicant Full Name</label>
                <input
                  type="text"
                  value={newApplicantName}
                  onChange={(e) => setNewApplicantName(e.target.value)}
                  placeholder="e.g. Maya Lin"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Email Address</label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="e.g. maya@example.com"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Program Applied</label>
                  <select
                    value={newProgram}
                    onChange={(e) => setNewProgram(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                  >
                    <option value="B.Sc. Computer Science">B.Sc. Computer Science</option>
                    <option value="B.Sc. Data Science & AI">B.Sc. Data Science & AI</option>
                    <option value="B.A. Business Administration">B.A. Business Administration</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">High School GPA</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newGPA}
                    onChange={(e) => setNewGPA(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition"
              >
                Submit Application
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Add Prospect Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 text-slate-100 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="font-bold text-white text-base">Add New Prospect Application</h2>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddApplicant} className="space-y-3">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Applicant Full Name</label>
                <input
                  type="text"
                  value={newApplicantName}
                  onChange={(e) => setNewApplicantName(e.target.value)}
                  placeholder="e.g. Maya Lin"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Email Address</label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="e.g. maya@example.com"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Program Applied</label>
                  <select
                    value={newProgram}
                    onChange={(e) => setNewProgram(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                  >
                    <option value="B.Sc. Computer Science">B.Sc. Computer Science</option>
                    <option value="B.Sc. Data Science & AI">B.Sc. Data Science & AI</option>
                    <option value="B.A. Business Administration">B.A. Business Administration</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">High School GPA</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newGPA}
                    onChange={(e) => setNewGPA(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition"
              >
                Submit Application
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Official Secured Admission Offer Letter Modal */}
      {offerModalApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white text-slate-900 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            
            {/* Modal Header */}
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span className="font-bold text-sm">Official University Admission Offer Certificate</span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition flex items-center space-x-1"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Certificate</span>
                </button>
                <button
                  onClick={() => setOfferModalApp(null)}
                  className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Printable Offer Document Body */}
            <div className="printable-document p-8 overflow-y-auto space-y-6 text-xs bg-slate-50 relative border-4 border-indigo-900/10">
              
              {/* Security Background Overlay */}
              <GuillochePattern />
              <SecurityWatermark text="BMI OFFICIAL OFFER" subtext="CANONICAL ADMISSIONS RECORD" />

              <MicrotextBorder text="• BMI UNIVERSITY OFFICE OF ADMISSIONS • OFFICIAL PROVISIONAL OFFER SEC-2026 • DO NOT DUPLICATE " />

              {/* Header */}
              <div className="border-b-2 border-slate-900 pb-3 flex items-center justify-between relative z-10">
                <div>
                  <h1 className="text-xl font-black text-slate-900">BMI UNIVERSITY</h1>
                  <p className="text-[10px] uppercase font-bold tracking-widest text-slate-600">OFFICE OF UNDERGRADUATE ADMISSIONS</p>
                </div>
                <div className="text-right font-mono text-[11px]">
                  <p className="font-bold text-indigo-900">OFFER ID: {offerModalApp.applicationNumber}</p>
                  <p className="text-slate-500">DATE: {offerModalApp.submissionDate}</p>
                </div>
              </div>

              {/* Offer Body */}
              <div className="space-y-3 relative z-10 leading-relaxed text-slate-800">
                <p className="font-bold text-sm text-slate-900">Dear {offerModalApp.applicantName},</p>
                <p>
                  On behalf of the Admissions Board at <strong>BMI University</strong>, it is our great pleasure to offer you official admission to the <strong>{offerModalApp.programApplied}</strong> program.
                </p>
                <p>
                  Your exceptional academic record (GPA: <span className="font-mono font-bold">{offerModalApp.highSchoolGPA}</span>) and accomplishments demonstrate the high potential for excellence that we foster across our institution.
                </p>
              </div>

              {/* Offer Details */}
              <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-white/90 border border-slate-200 shadow-sm relative z-10 font-mono">
                <div>
                  <p><strong className="text-slate-700">Applicant:</strong> {offerModalApp.applicantName}</p>
                  <p><strong className="text-slate-700">Email:</strong> {offerModalApp.email}</p>
                </div>
                <div>
                  <p><strong className="text-slate-700">Program:</strong> {offerModalApp.programApplied}</p>
                  <p><strong className="text-slate-700">Status:</strong> <span className="font-bold text-emerald-700">{offerModalApp.status}</span></p>
                </div>
              </div>

              {/* Holographic Security Seal */}
              <div className="relative z-10">
                <SecuritySealBadge
                  docType="Official Offer Letter & Certificate"
                  docId={offerModalApp.applicationNumber}
                  securityHash={`ADM-HASH-${offerModalApp.applicationNumber}-${offerModalApp.applicantName}`}
                />
              </div>

              <MicrotextBorder text="• CANONICAL ADMISSIONS OFFER • IMMUTABLE SHA-256 REGISTRAR ATTESTATION " />

              {/* Signatures */}
              <div className="pt-4 border-t border-slate-300 flex items-center justify-between text-[11px] text-slate-600 relative z-10">
                <div>
                  <p className="font-bold text-slate-900">Dr. Marcus Vance</p>
                  <p>Dean of Admissions, BMI University</p>
                </div>
                <div className="p-2 border-2 border-indigo-900 rounded-xl text-center text-indigo-900 font-bold text-[9px] uppercase tracking-wider bg-indigo-50/80">
                  OFFICIAL ADMISSIONS SEAL<br />VERIFIED ATTESTATION
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};
