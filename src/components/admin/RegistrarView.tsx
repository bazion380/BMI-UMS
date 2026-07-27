import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  BookOpen, 
  Search, 
  Award, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  UserCheck, 
  Plus,
  X,
  Edit2,
  Trash2,
  Printer,
  ShieldCheck,
  Building2
} from 'lucide-react';
import { Student, Course } from '../../types';
import { 
  SecurityWatermark, 
  GuillochePattern, 
  MicrotextBorder, 
  SecuritySealBadge 
} from '../common/DocumentSecurityComponents';

export const RegistrarView: React.FC = () => {
  const { students, courses, enrollments, addCourse, updateCourse, deleteCourse, graduateStudent, toggleStudentHold } = useApp();
  
  const [activeTab, setActiveTab] = useState<'students' | 'courses'>('students');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showTranscript, setShowTranscript] = useState(false);
  
  // Edit Course Modal State
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  // Add Course Modal State
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [newCode, setNewCode] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newCredits, setNewCredits] = useState(3);
  const [newDept, setNewDept] = useState('School of Computing & Engineering');
  const [newInstructor, setNewInstructor] = useState('Dr. Marcus Vance');

  const filteredStudents = students.filter(s =>
    s.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.studentNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.program.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCourses = courses.filter(c =>
    c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode || !newTitle) return;

    addCourse({
      code: newCode,
      title: newTitle,
      credits: newCredits,
      department: newDept,
      instructorName: newInstructor,
      instructorId: 'stf-201',
      schedule: 'Mon, Wed 02:00 - 03:30 PM',
      room: 'Turing Hall 201',
      capacity: 35,
      prerequisites: [],
      description: 'Newly created course added via Office of the Registrar.',
      syllabus: ['Week 1: Foundations & Overview']
    });

    setShowCourseModal(false);
    setNewCode('');
    setNewTitle('');
  };

  const handleUpdateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCourse) return;
    updateCourse(editingCourse.id, editingCourse);
    setEditingCourse(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center space-x-2">
            <BookOpen className="w-6 h-6 text-indigo-400" />
            <span>Office of the Registrar — SIS & Curriculum</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Canonical student records, academic standing flags, program setup, and official transcripts.
          </p>
        </div>

        <button
          onClick={() => setShowCourseModal(true)}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs shadow-lg transition flex items-center space-x-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Course to Curriculum</span>
        </button>
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 rounded-2xl">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveTab('students')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'students' ? 'bg-indigo-600 text-white shadow' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Student Master Records ({students.length})
          </button>
          <button
            onClick={() => setActiveTab('courses')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'courses' ? 'bg-indigo-600 text-white shadow' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Curriculum Catalog ({courses.length})
          </button>
        </div>

        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={activeTab === 'students' ? "Search students by name, ID, or program..." : "Search courses by code, title..."}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-4 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Students View */}
      {activeTab === 'students' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase font-bold text-[10px]">
                  <th className="p-3">Registration No / UID</th>
                  <th className="p-3">Full Name</th>
                  <th className="p-3">Program</th>
                  <th className="p-3">CGPA</th>
                  <th className="p-3">Credits</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Holds</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredStudents.map(std => (
                  <tr key={std.id} className="hover:bg-slate-800/40 transition">
                    <td className="p-3 font-mono">
                      <div className="font-bold text-emerald-300">{std.registrationNumber || std.studentNumber}</div>
                      <div className="text-[10px] text-indigo-300/80 font-bold">UID: {std.studentUid || 'BMI00002T'}</div>
                    </td>
                    <td className="p-3 font-semibold text-white">
                      {std.firstName} {std.lastName}
                    </td>
                    <td className="p-3 text-slate-300">{std.program}</td>
                    <td className="p-3 font-mono font-bold text-white">{std.cgpa}</td>
                    <td className="p-3 font-mono text-slate-400">{std.creditsEarned} / {std.creditsRequired}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          std.academicStatus === 'Active'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : std.academicStatus === 'Probation'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                        }`}
                      >
                        {std.academicStatus}
                      </span>
                    </td>
                    <td className="p-3">
                      {std.financialHold ? (
                        <span className="px-2 py-0.5 rounded text-[10px] bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30">
                          Financial
                        </span>
                      ) : (
                        <span className="text-slate-500 text-[10px]">Clear</span>
                      )}
                    </td>
                    <td className="p-3 text-right space-x-2">
                      <button
                        onClick={() => {
                          setSelectedStudent(std);
                          setShowTranscript(false);
                        }}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-[11px] font-medium transition"
                      >
                        Inspect Record
                      </button>
                      {std.academicStatus !== 'Graduated' && (
                        <button
                          onClick={() => {
                            if (confirm(`Officially graduate student ${std.firstName} ${std.lastName}?`)) {
                              graduateStudent(std.id);
                            }
                          }}
                          className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-[11px] font-bold transition"
                        >
                          Graduation
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Courses Catalog View */}
      {activeTab === 'courses' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase font-bold text-[10px]">
                  <th className="p-3">Course Code</th>
                  <th className="p-3">Title</th>
                  <th className="p-3">Department</th>
                  <th className="p-3">Credits</th>
                  <th className="p-3">Instructor</th>
                  <th className="p-3">Capacity</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredCourses.map(c => (
                  <tr key={c.id} className="hover:bg-slate-800/40 transition">
                    <td className="p-3 font-mono font-bold text-indigo-400">{c.code}</td>
                    <td className="p-3 font-bold text-white">{c.title}</td>
                    <td className="p-3 text-slate-300">{c.department}</td>
                    <td className="p-3 font-mono text-emerald-400 font-bold">{c.credits} Cr</td>
                    <td className="p-3 text-slate-300">{c.instructorName}</td>
                    <td className="p-3 text-slate-400 font-mono">{c.enrolledCount} / {c.capacity}</td>
                    <td className="p-3 text-right space-x-2">
                      <button
                        onClick={() => setEditingCourse(c)}
                        className="p-1.5 bg-slate-800 hover:bg-slate-700 text-indigo-300 rounded-lg transition"
                        title="Edit Course Details"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Are you sure you want to delete course ${c.code}?`)) {
                            deleteCourse(c.id);
                          }
                        }}
                        className="p-1.5 bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 rounded-lg transition"
                        title="Delete Course"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Inspect Student / Official Transcript Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-800 text-slate-100 rounded-2xl w-full max-w-2xl p-6 shadow-2xl space-y-4 text-xs relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="font-bold text-white text-base flex items-center space-x-2">
                <BookOpen className="w-5 h-5 text-indigo-400" />
                <span>SIS Master Student Record — {selectedStudent.registrationNumber || selectedStudent.studentNumber}</span>
              </h2>
              <button onClick={() => setSelectedStudent(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {!showTranscript ? (
              <>
                <div className="grid grid-cols-2 gap-3 p-4 bg-slate-800/60 rounded-xl">
                  <div><strong className="text-slate-400">Permanent Student UID:</strong> <span className="font-mono text-indigo-300 font-bold">{selectedStudent.studentUid || 'BMI00002T'}</span></div>
                  <div><strong className="text-slate-400">Registration Number:</strong> <span className="font-mono text-emerald-300 font-bold">{selectedStudent.registrationNumber || selectedStudent.studentNumber}</span></div>
                  <div><strong className="text-slate-400">Full Name:</strong> {selectedStudent.firstName} {selectedStudent.lastName}</div>
                  <div><strong className="text-slate-400">Email:</strong> {selectedStudent.email}</div>
                  <div><strong className="text-slate-400">Program:</strong> {selectedStudent.program}</div>
                  <div><strong className="text-slate-400">Department:</strong> {selectedStudent.department}</div>
                  <div><strong className="text-slate-400">CGPA:</strong> <span className="font-mono text-emerald-400 font-bold">{selectedStudent.cgpa}</span></div>
                  <div><strong className="text-slate-400">Credits Earned:</strong> {selectedStudent.creditsEarned} / {selectedStudent.creditsRequired}</div>
                  <div><strong className="text-slate-400">Academic Standing:</strong> {selectedStudent.academicStatus}</div>
                  <div><strong className="text-slate-400">Financial Hold:</strong> {selectedStudent.financialHold ? 'Active Hold' : 'Cleared'}</div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        toggleStudentHold(selectedStudent.id, 'academic', !selectedStudent.academicHold);
                        setSelectedStudent(null);
                      }}
                      className="px-3 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl transition"
                    >
                      Toggle Academic Hold
                    </button>
                    <button
                      onClick={() => setShowTranscript(true)}
                      className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition flex items-center space-x-1.5"
                    >
                      <FileText className="w-4 h-4" />
                      <span>View Official Transcript</span>
                    </button>
                  </div>

                  <button
                    onClick={() => setSelectedStudent(null)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-xl"
                  >
                    Close
                  </button>
                </div>
              </>
            ) : (
              /* Official Transcript View */
              <div className="printable-document space-y-4 bg-slate-950 p-6 rounded-2xl border-2 border-indigo-900/40 relative overflow-hidden">
                
                {/* Security Background Overlay */}
                <GuillochePattern />
                <SecurityWatermark text="BMI REGISTRAR MASTER RECORD" subtext="CANONICAL ATTESTATION" />

                <MicrotextBorder text="• BMI UNIVERSITY REGISTRAR OFFICIAL TRANSCRIPT • CANONICAL RECORD SEC-2026 • DO NOT DUPLICATE " />

                <div className="flex items-center justify-between border-b border-slate-800 pb-4 relative z-10">
                  <div className="flex items-center space-x-3">
                    <Building2 className="w-8 h-8 text-indigo-400" />
                    <div>
                      <h3 className="font-bold text-white text-base">BRIGHTHORIZON MANAGEMENT INSTITUTE</h3>
                      <p className="text-[10px] text-slate-400">OFFICIAL ACADEMIC TRANSCRIPT & CREDENTIAL RECORD</p>
                    </div>
                  </div>
                  <ShieldCheck className="w-8 h-8 text-emerald-400" />
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-900/80 p-3 rounded-xl border border-slate-800 relative z-10">
                  <div><strong>Registration No:</strong> <span className="font-mono font-bold text-emerald-300">{selectedStudent.registrationNumber || selectedStudent.studentNumber}</span></div>
                  <div><strong>Permanent UID:</strong> <span className="font-mono font-bold text-indigo-300">{selectedStudent.studentUid || 'BMI00002T'}</span></div>
                  <div><strong>Name:</strong> {selectedStudent.firstName} {selectedStudent.lastName}</div>
                  <div><strong>Degree Program:</strong> {selectedStudent.program}</div>
                  <div><strong>Cumulative GPA:</strong> {selectedStudent.cgpa}</div>
                </div>

                <div className="relative z-10">
                  <h4 className="font-bold text-slate-300 mb-2 text-xs">Semester Course Enrolments & Grades</h4>
                  <div className="space-y-1.5">
                    {enrollments.filter(e => e.studentId === selectedStudent.id).map(e => {
                      const crs = courses.find(c => c.id === e.courseId);
                      return (
                        <div key={e.courseId} className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800 font-mono text-[11px]">
                          <div>
                            <span className="font-bold text-indigo-300">{crs?.code}</span> — {crs?.title}
                          </div>
                          <div className="space-x-3">
                            <span className="text-slate-400">{crs?.credits} Cr</span>
                            <span className="font-bold text-emerald-400">Grade: {e.grade || 'A'}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="relative z-10">
                  <SecuritySealBadge
                    docType="Official Academic Transcript"
                    docId={selectedStudent.studentNumber}
                    securityHash={`REG-TR-${selectedStudent.studentNumber}-${selectedStudent.cgpa}`}
                  />
                </div>

                <MicrotextBorder text="• CANONICAL REGISTRAR RECORD • 256-BIT CRYPTOGRAPHIC DIGEST ATTESTED " />

                <div className="flex items-center justify-between pt-3 border-t border-slate-800 relative z-10">
                  <p className="text-[10px] text-slate-500">Digitally Verified & Sealed by Office of the University Registrar</p>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setShowTranscript(false)}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg"
                    >
                      Back
                    </button>
                    <button
                      onClick={() => window.print()}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg flex items-center space-x-1"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print Document</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Edit Course Modal */}
      {editingCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 text-slate-100 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="font-bold text-white text-base">Edit Course Details</h2>
              <button onClick={() => setEditingCourse(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateCourse} className="space-y-3">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Course Code</label>
                <input
                  type="text"
                  value={editingCourse.code}
                  onChange={(e) => setEditingCourse({ ...editingCourse, code: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Course Title</label>
                <input
                  type="text"
                  value={editingCourse.title}
                  onChange={(e) => setEditingCourse({ ...editingCourse, title: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Credits</label>
                  <input
                    type="number"
                    value={editingCourse.credits}
                    onChange={(e) => setEditingCourse({ ...editingCourse, credits: Number(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Capacity</label>
                  <input
                    type="number"
                    value={editingCourse.capacity}
                    onChange={(e) => setEditingCourse({ ...editingCourse, capacity: Number(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition"
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Add Course Modal */}
      {showCourseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 text-slate-100 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="font-bold text-white text-base">Add New Course to Curriculum</h2>
              <button onClick={() => setShowCourseModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCourse} className="space-y-3">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Course Code</label>
                <input
                  type="text"
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  placeholder="e.g. CSC405"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Course Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Artificial Intelligence & Machine Learning"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Credits</label>
                  <input
                    type="number"
                    value={newCredits}
                    onChange={(e) => setNewCredits(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Department</label>
                  <select
                    value={newDept}
                    onChange={(e) => setNewDept(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                  >
                    <option value="School of Computing & Engineering">School of Computing & Engineering</option>
                    <option value="School of Business & Economics">School of Business & Economics</option>
                    <option value="School of Mathematics">School of Mathematics</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition"
              >
                Create & Publish Course
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
