import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Users, 
  BookOpen, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Edit3, 
  Award,
  Save,
  Megaphone,
  FileText,
  Send
} from 'lucide-react';

export const LecturerView: React.FC = () => {
  const { courses, students, enrollments, updateStudentGrade, recordAttendance, logAudit } = useApp();
  
  const [selectedCourseId, setSelectedCourseId] = useState<string>(courses[0]?.id || '');
  const activeCourse = courses.find(c => c.id === selectedCourseId) || courses[0];

  const courseEnrollments = enrollments.filter(e => e.courseId === activeCourse?.id);

  // Announcement State
  const [announcementText, setAnnouncementText] = useState('');
  const [announcements, setAnnouncements] = useState<Record<string, string[]>>({
    'crs-301': ['Midterm Examination will cover Weeks 1-4 topics. Bring your scientific calculator and student ID.']
  });

  // Grade Edit State
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);
  const [gradeInput, setGradeInput] = useState<string>('A');
  const [scoreInput, setScoreInput] = useState<number>(92);
  const [savedNotice, setSavedNotice] = useState<string | null>(null);

  const handleSaveGrade = (studentId: string) => {
    updateStudentGrade(studentId, activeCourse.id, gradeInput, scoreInput);
    setEditingStudentId(null);
    setSavedNotice(`Grade updated to ${gradeInput} (${scoreInput}/100) for student. Transcripts updated.`);
    setTimeout(() => setSavedNotice(null), 3000);
  };

  const handlePostAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!announcementText.trim()) return;

    setAnnouncements(prev => ({
      ...prev,
      [activeCourse.id]: [announcementText.trim(), ...(prev[activeCourse.id] || [])]
    }));

    logAudit('Faculty Announcement', `Broadcasted announcement for course ${activeCourse.code}: "${announcementText.trim().slice(0, 50)}..."`);
    setAnnouncementText('');
    setSavedNotice(`Announcement broadcasted to all ${courseEnrollments.length} enrolled students.`);
    setTimeout(() => setSavedNotice(null), 3000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-white flex items-center space-x-2">
          <BookOpen className="w-6 h-6 text-indigo-400" />
          <span>Faculty & Lecturer Management Console</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Live class rosters, attendance taking grid, gradebook editor, and class announcements.
        </p>
      </div>

      {savedNotice && (
        <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/50 text-emerald-200 text-xs flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span className="font-semibold">{savedNotice}</span>
        </div>
      )}

      {/* Course Selector Tabs */}
      <div className="flex border-b border-slate-800 text-xs font-semibold space-x-1 overflow-x-auto">
        {courses.map(crs => (
          <button
            key={crs.id}
            onClick={() => setSelectedCourseId(crs.id)}
            className={`px-4 py-2.5 rounded-t-xl transition flex items-center space-x-2 ${
              crs.id === activeCourse?.id
                ? 'bg-slate-900 border-t border-x border-slate-800 text-indigo-400 border-b-transparent'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className="font-mono font-bold text-xs">{crs.code}</span>
            <span className="hidden sm:inline">{crs.title}</span>
          </button>
        ))}
      </div>

      {/* Active Course Overview */}
      {activeCourse && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md space-y-6 text-xs">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono font-bold">
                  {activeCourse.code}
                </span>
                <h2 className="text-xl font-bold text-white">{activeCourse.title}</h2>
              </div>
              <p className="text-slate-400 mt-1">{activeCourse.schedule} • Room: {activeCourse.room}</p>
            </div>

            <div className="flex items-center space-x-4 font-mono">
              <div className="p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-center">
                <span className="text-[10px] text-slate-400 block uppercase">Enrolled</span>
                <span className="font-bold text-white text-sm">{courseEnrollments.length} / {activeCourse.capacity}</span>
              </div>
            </div>
          </div>

          {/* Broadcast Announcement Section */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
            <h3 className="font-bold text-white text-xs flex items-center space-x-2">
              <Megaphone className="w-4 h-4 text-amber-400" />
              <span>Broadcast Class Announcement</span>
            </h3>

            <form onSubmit={handlePostAnnouncement} className="flex gap-2">
              <input
                type="text"
                placeholder="Type an announcement or lecture update to broadcast to students..."
                value={announcementText}
                onChange={(e) => setAnnouncementText(e.target.value)}
                className="flex-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-indigo-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition flex items-center space-x-1 shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Post</span>
              </button>
            </form>

            {announcements[activeCourse.id]?.length > 0 && (
              <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
                <p className="text-[10px] text-slate-500 uppercase font-bold">Active Broadcasts:</p>
                {announcements[activeCourse.id].map((msg, i) => (
                  <div key={i} className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 text-xs">
                    "{msg}"
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Roster Table */}
          <div className="overflow-x-auto">
            <h3 className="font-bold text-white text-sm mb-3">Roster, Attendance Grid & Gradebook</h3>
            
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase font-bold text-[10px]">
                  <th className="p-3">Student Number</th>
                  <th className="p-3">Student Name</th>
                  <th className="p-3">Attendance %</th>
                  <th className="p-3">Live Attendance</th>
                  <th className="p-3">Grade</th>
                  <th className="p-3 text-right">Gradebook Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {courseEnrollments.map(enr => {
                  const student = students.find(s => s.id === enr.studentId);
                  if (!student) return null;

                  const isEditing = editingStudentId === student.id;

                  return (
                    <tr key={student.id} className="hover:bg-slate-800/40 transition">
                      <td className="p-3 font-mono font-bold text-indigo-300">{student.studentNumber}</td>
                      <td className="p-3 font-semibold text-white flex items-center space-x-2">
                        <img src={student.avatarUrl} className="w-6 h-6 rounded-full object-cover" />
                        <span>{student.firstName} {student.lastName}</span>
                      </td>

                      <td className="p-3 font-mono font-bold text-emerald-400">{enr.attendancePercentage}%</td>

                      {/* Attendance Buttons */}
                      <td className="p-3">
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => recordAttendance(student.id, activeCourse.id, 'Present')}
                            className="p-1 rounded bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/40 text-[10px] font-bold"
                            title="Mark Present"
                          >
                            P
                          </button>
                          <button
                            onClick={() => recordAttendance(student.id, activeCourse.id, 'Late')}
                            className="p-1 rounded bg-amber-500/20 text-amber-300 hover:bg-amber-500/40 text-[10px] font-bold"
                            title="Mark Late"
                          >
                            L
                          </button>
                          <button
                            onClick={() => recordAttendance(student.id, activeCourse.id, 'Absent')}
                            className="p-1 rounded bg-rose-500/20 text-rose-300 hover:bg-rose-500/40 text-[10px] font-bold"
                            title="Mark Absent"
                          >
                            A
                          </button>
                        </div>
                      </td>

                      {/* Grade Column */}
                      <td className="p-3 font-mono font-bold">
                        {isEditing ? (
                          <div className="flex items-center space-x-2">
                            <select
                              value={gradeInput}
                              onChange={(e) => setGradeInput(e.target.value)}
                              className="bg-slate-800 border border-slate-700 rounded p-1 text-xs text-white"
                            >
                              {['A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'D', 'F'].map(g => (
                                <option key={g} value={g}>{g}</option>
                              ))}
                            </select>
                            <input
                              type="number"
                              value={scoreInput}
                              onChange={(e) => setScoreInput(Number(e.target.value))}
                              className="w-14 bg-slate-800 border border-slate-700 rounded p-1 text-xs text-white font-mono"
                            />
                          </div>
                        ) : (
                          <span className="px-2.5 py-1 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                            {enr.grade || 'In Progress'} ({enr.numericScore || 90}%)
                          </span>
                        )}
                      </td>

                      <td className="p-3 text-right">
                        {isEditing ? (
                          <button
                            onClick={() => handleSaveGrade(student.id)}
                            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold flex items-center space-x-1 ml-auto"
                          >
                            <Save className="w-3.5 h-3.5" />
                            <span>Save Grade</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setEditingStudentId(student.id);
                              setGradeInput(enr.grade || 'A');
                              setScoreInput(enr.numericScore || 90);
                            }}
                            className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-indigo-300 rounded-lg font-medium"
                          >
                            Edit Grade
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

        </div>
      )}

    </div>
  );
};
