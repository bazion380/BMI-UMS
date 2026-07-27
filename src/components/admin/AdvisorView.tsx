import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AlertCircle, UserCheck, Plus, FileText, CheckCircle2 } from 'lucide-react';

export const AdvisorView: React.FC = () => {
  const { students, advisingNotes, addAdvisingNote, resolveAdvisingNote } = useApp();

  const [studentId, setStudentId] = useState(students[0]?.id || '');
  const [topic, setTopic] = useState('');
  const [content, setContent] = useState('');
  const [atRisk, setAtRisk] = useState(false);

  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic || !content) return;

    addAdvisingNote({
      studentId,
      advisorName: 'Dr. Marcus Vance',
      topic,
      content,
      isConfidential: true,
      atRiskFlag: atRisk
    });

    setTopic('');
    setContent('');
    setAtRisk(false);
  };

  const atRiskStudents = students.filter(s => s.academicStatus === 'Probation' || s.financialHold);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      <div>
        <h1 className="text-xl font-bold text-white flex items-center space-x-2">
          <UserCheck className="w-6 h-6 text-indigo-400" />
          <span>Student Affairs & Academic Advising Console</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          At-risk student tracking, confidential counseling logs, academic recovery plans, and intervention alerts.
        </p>
      </div>

      {/* At Risk Students Alert */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md space-y-4 text-xs">
        <h2 className="font-bold text-white text-base flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 text-amber-400" />
          <span>At-Risk Student Early Warning Dashboard</span>
        </h2>

        <div className="space-y-2">
          {atRiskStudents.map(std => (
            <div key={std.id} className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-800/40 flex items-center justify-between text-amber-200">
              <div>
                <p className="font-bold text-white text-sm">{std.firstName} {std.lastName} ({std.studentNumber})</p>
                <p className="text-[11px] text-amber-300">Issue: {std.academicStatus === 'Probation' ? 'Academic Probation (CGPA ' + std.cgpa + ')' : 'Active Financial Hold'}</p>
              </div>
              <span className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                Intervention Priority
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Add Advising Note Form */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md text-xs space-y-4">
        <h2 className="font-bold text-white text-base">Log Confidential Advising Session</h2>

        <form onSubmit={handleSaveNote} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Select Student</label>
              <select
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
              >
                {students.map(s => (
                  <option key={s.id} value={s.id}>{s.firstName} {s.lastName} ({s.studentNumber})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Session Topic</label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Midterm Academic Recovery & Tutoring Plan"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">Confidential Counseling Details</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={3}
              placeholder="Record counseling notes and agreed action items..."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
              required
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="atRisk"
              checked={atRisk}
              onChange={(e) => setAtRisk(e.target.checked)}
              className="rounded bg-slate-800 border-slate-700 text-indigo-600 focus:ring-0"
            />
            <label htmlFor="atRisk" className="text-slate-300 font-semibold">Flag student as At-Risk for monitoring</label>
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition"
          >
            Save Advising Note
          </button>
        </form>
      </div>

      {/* Advising Notes History */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md text-xs space-y-4">
        <h2 className="font-bold text-white text-base">Recorded Advising Session History</h2>

        <div className="space-y-3">
          {advisingNotes.map(note => {
            const student = students.find(s => s.id === note.studentId);
            return (
              <div key={note.id} className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-white text-sm">{note.topic}</span>
                    {note.atRiskFlag && (
                      <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold text-[10px]">At Risk</span>
                    )}
                    {note.resolved && (
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold text-[10px]">Resolved</span>
                    )}
                  </div>
                  <p className="text-indigo-300 font-semibold">Student: {student?.firstName} {student?.lastName} ({student?.studentNumber}) • Date: {note.date}</p>
                  <p className="text-slate-300 leading-relaxed mt-1">{note.content}</p>
                </div>

                {!note.resolved && (
                  <button
                    onClick={() => resolveAdvisingNote(note.id)}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition flex items-center space-x-1 shrink-0"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Resolve Note</span>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
