import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Award, FileText, Download, CheckCircle2, X, Printer, ShieldCheck } from 'lucide-react';
import { 
  SecurityWatermark, 
  GuillochePattern, 
  MicrotextBorder, 
  SecuritySealBadge, 
  DocumentVerificationModal 
} from '../common/DocumentSecurityComponents';
import { generateDocumentHash } from '../../utils/documentSecurity';

export const StudentGrades: React.FC = () => {
  const { students, activeStudentId, enrollments, courses } = useApp();
  const student = students.find(s => s.id === activeStudentId) || students[0];

  const myEnrollments = enrollments.filter(e => e.studentId === student.id);
  const [showTranscriptModal, setShowTranscriptModal] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [docHash, setDocHash] = useState('8f9a2b71c4d0e192f8a11bc3');

  useEffect(() => {
    generateDocumentHash({
      documentId: `BMI-TR-2026-${student.studentNumber.slice(-4)}`,
      documentType: 'Official Academic Transcript',
      studentId: student.id,
      studentName: `${student.firstName} ${student.lastName}`,
      issueDate: new Date().toISOString().slice(0, 10),
      payload: { cgpa: student.cgpa, enrollmentsCount: myEnrollments.length }
    }).then(h => setDocHash(h));
  }, [student, myEnrollments.length]);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center space-x-2">
            <Award className="w-6 h-6 text-indigo-400" />
            <span>Academic Performance & Grades</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Track term GPA, cumulative credit accumulation, and generate verified transcripts.
          </p>
        </div>

        <button
          onClick={() => setShowTranscriptModal(true)}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs shadow-lg shadow-indigo-600/30 transition flex items-center space-x-2 shrink-0"
        >
          <FileText className="w-4 h-4" />
          <span>Official Transcript Preview</span>
        </button>
      </div>

      {/* GPA Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
          <span className="text-slate-400 font-semibold">Cumulative GPA (CGPA)</span>
          <div className="text-3xl font-bold text-white mt-2">{student.cgpa}</div>
          <p className="text-emerald-400 text-[11px] mt-1 font-medium">Class Rank: Top 5%</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
          <span className="text-slate-400 font-semibold">Credits Earned</span>
          <div className="text-3xl font-bold text-indigo-400 mt-2">{student.creditsEarned}</div>
          <p className="text-slate-400 text-[11px] mt-1">Required: {student.creditsRequired} Credits</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
          <span className="text-slate-400 font-semibold">Academic Status</span>
          <div className="text-2xl font-bold text-emerald-400 mt-2">{student.academicStatus}</div>
          <p className="text-slate-400 text-[11px] mt-1">Good Standing • No Holds</p>
        </div>
      </div>

      {/* Course Grade Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md">
        <h2 className="text-base font-bold text-white mb-4">Course Grade Ledger (Fall 2026)</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase font-bold text-[10px] tracking-wider">
                <th className="p-3">Course Code</th>
                <th className="p-3">Course Title</th>
                <th className="p-3">Credits</th>
                <th className="p-3">Score (100)</th>
                <th className="p-3">Letter Grade</th>
                <th className="p-3">Grade Points</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {myEnrollments.map(e => {
                const course = courses.find(c => c.id === e.courseId);
                if (!course) return null;

                const score = e.numericScore || 90;
                const letter = e.grade || 'A';
                const points = letter === 'A' ? 4.0 : letter === 'A-' ? 3.7 : letter === 'B+' ? 3.3 : 3.0;

                return (
                  <tr key={e.courseId} className="hover:bg-slate-800/40 transition">
                    <td className="p-3 font-mono font-bold text-indigo-300">{course.code}</td>
                    <td className="p-3 font-medium text-white">{course.title}</td>
                    <td className="p-3 text-slate-300">{course.credits}</td>
                    <td className="p-3 font-mono text-slate-200">{score}%</td>
                    <td className="p-3">
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        {letter}
                      </span>
                    </td>
                    <td className="p-3 font-mono font-bold text-white">{points.toFixed(1)}</td>
                    <td className="p-3 text-emerald-400 font-semibold flex items-center space-x-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{e.status}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Official Transcript Modal */}
      {showTranscriptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-white text-slate-900 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span className="font-bold text-sm">Official Verification Document</span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium transition flex items-center space-x-1"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print / Save PDF</span>
                </button>
                <button
                  onClick={() => setShowTranscriptModal(false)}
                  className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Printable Transcript Document */}
            <div className="printable-document p-8 overflow-y-auto space-y-6 text-xs bg-slate-50 font-sans relative border-4 border-indigo-900/10">
              
              {/* Security Background Features */}
              <GuillochePattern />
              <SecurityWatermark text="BMI OFFICIAL TRANSCRIPT" subtext="CANONICAL REGISTRAR RECORD" />

              {/* Top Microtext Security Border */}
              <MicrotextBorder text="• BMI UNIVERSITY OFFICIAL ACADEMIC TRANSCRIPT • CANONICAL RECORD SEC-2026 • DO NOT DUPLICATE " />

              {/* Document Header */}
              <div className="border-b-2 border-slate-900 pb-4 text-center relative z-10">
                <h1 className="text-xl font-bold tracking-tight text-slate-900">BMI UNIVERSITY</h1>
                <p className="text-[10px] uppercase font-bold tracking-widest text-slate-600">OFFICIAL ACADEMIC TRANSCRIPT</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Office of the University Registrar • Document ID: <span className="font-mono font-bold text-slate-900">BMI-TR-2026-{student.studentNumber.slice(-4)}</span></p>
              </div>

              {/* Student Metadata */}
              <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-white/90 border border-slate-200 shadow-sm text-xs relative z-10">
                <div>
                  <p><strong className="text-slate-700">Student Name:</strong> {student.firstName} {student.lastName}</p>
                  <p><strong className="text-slate-700">Student Number:</strong> {student.studentNumber}</p>
                  <p><strong className="text-slate-700">Date of Birth:</strong> {student.dateOfBirth}</p>
                </div>
                <div>
                  <p><strong className="text-slate-700">Degree Program:</strong> {student.program}</p>
                  <p><strong className="text-slate-700">Department:</strong> {student.department}</p>
                  <p><strong className="text-slate-700">Cumulative GPA:</strong> {student.cgpa} / 4.00</p>
                </div>
              </div>

              {/* Course History Table */}
              <div className="relative z-10">
                <h3 className="font-bold text-slate-900 mb-2 border-b border-slate-300 pb-1">ACADEMIC RECORD SUMMARY</h3>
                <table className="w-full text-left text-xs border border-slate-300 bg-white/80">
                  <thead className="bg-slate-200 text-slate-800 uppercase font-bold text-[10px]">
                    <tr>
                      <th className="p-2 border">Course Code</th>
                      <th className="p-2 border">Course Title</th>
                      <th className="p-2 border">Credits</th>
                      <th className="p-2 border">Grade</th>
                      <th className="p-2 border">Grade Points</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myEnrollments.map(e => {
                      const course = courses.find(c => c.id === e.courseId);
                      if (!course) return null;
                      return (
                        <tr key={e.courseId} className="border-b">
                          <td className="p-2 font-mono font-bold border">{course.code}</td>
                          <td className="p-2 border">{course.title}</td>
                          <td className="p-2 border">{course.credits}</td>
                          <td className="p-2 font-bold border">{e.grade || 'A'}</td>
                          <td className="p-2 font-mono border">4.0</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Holographic Security Seal & QR Attestation */}
              <div className="relative z-10 my-4">
                <SecuritySealBadge
                  docType="Official Academic Transcript"
                  docId={`BMI-TR-2026-${student.studentNumber.slice(-4)}`}
                  securityHash={docHash}
                />
              </div>

              {/* Bottom Microtext Security Border */}
              <MicrotextBorder text="• CANONICAL UNALTERED ACADEMIC RECORD • IMMUTABLE SHA-256 REGISTRAR ATTESTATION " />

              {/* Official Seal Footer */}
              <div className="pt-4 border-t border-slate-300 flex items-center justify-between text-[11px] text-slate-600 relative z-10">
                <div>
                  <p className="font-bold text-slate-900">Dr. Claire Beauchamp</p>
                  <p>University Registrar, BMI University</p>
                  <button
                    onClick={() => setShowVerifyModal(true)}
                    className="mt-1 text-[10px] text-indigo-600 font-bold hover:underline print:hidden flex items-center space-x-1"
                  >
                    <ShieldCheck className="w-3 h-3 text-indigo-600" />
                    <span>Test Document Authenticity Check</span>
                  </button>
                </div>
                <div className="p-2 border-2 border-indigo-900 rounded-xl text-center text-indigo-900 font-bold text-[9px] uppercase tracking-wider bg-indigo-50/80">
                  OFFICIAL DIGITAL SEAL<br />VERIFIED ATTESTATION
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* Verification Modal */}
      <DocumentVerificationModal
        isOpen={showVerifyModal}
        onClose={() => setShowVerifyModal(false)}
        documentData={{
          id: `BMI-TR-2026-${student.studentNumber.slice(-4)}`,
          title: 'Official Academic Transcript',
          studentName: `${student.firstName} ${student.lastName}`,
          studentNumber: student.studentNumber,
          hash: docHash,
          date: new Date().toISOString().slice(0, 10)
        }}
      />

    </div>
  );
};
