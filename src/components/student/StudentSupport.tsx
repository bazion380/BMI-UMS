import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  HelpCircle, 
  UserCheck, 
  FileText, 
  Send, 
  CheckCircle2, 
  AlertCircle,
  GraduationCap
} from 'lucide-react';

export const StudentSupport: React.FC = () => {
  const { students, activeStudentId, advisingNotes, addAdvisingNote } = useApp();
  const student = students.find(s => s.id === activeStudentId) || students[0];

  const myNotes = advisingNotes.filter(n => n.studentId === student.id);

  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketCategory, setTicketCategory] = useState('Academic Advising');
  const [ticketBody, setTicketBody] = useState('');
  const [ticketSubmitted, setTicketSubmitted] = useState(false);

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject || !ticketBody) return;

    addAdvisingNote({
      studentId: student.id,
      studentName: `${student.firstName} ${student.lastName}`,
      topic: `[Support Ticket] ${ticketSubject}`,
      content: `Category: ${ticketCategory} | Description: ${ticketBody}`,
      advisorName: student.advisorName || 'Academic HelpDesk',
      atRiskFlag: false
    });

    setTicketSubmitted(true);
    setTicketSubject('');
    setTicketBody('');
    setTimeout(() => setTicketSubmitted(false), 4000);
  };

  const auditProgressPct = Math.round((student.creditsEarned / student.creditsRequired) * 100);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-white flex items-center space-x-2">
          <HelpCircle className="w-6 h-6 text-indigo-400" />
          <span>Academic Support & Advising Hub</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Review official advisor meeting logs, track degree audit progress, and submit help desk tickets.
        </p>
      </div>

      {/* Degree Audit Tracker Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-bold text-white text-base">Degree Audit Progress Meter</h2>
              <p className="text-xs text-slate-400">{student.program} • Expected Graduation: May 2028</p>
            </div>
          </div>
          <span className="text-xl font-bold text-indigo-400 font-mono">{auditProgressPct}% Complete</span>
        </div>

        <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-blue-400 rounded-full transition-all duration-500"
            style={{ width: `${auditProgressPct}%` }}
          />
        </div>

        <div className="flex justify-between text-xs text-slate-400 font-mono">
          <span>Earned: <strong>{student.creditsEarned} Credits</strong></span>
          <span>Remaining: <strong>{student.creditsRequired - student.creditsEarned} Credits</strong></span>
          <span>Required Total: <strong>{student.creditsRequired} Credits</strong></span>
        </div>
      </div>

      {/* Main Grid: Advising Notes & Support Ticket Form */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Advising Notes History */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md space-y-4">
          <h2 className="font-bold text-white text-base flex items-center space-x-2">
            <UserCheck className="w-5 h-5 text-indigo-400" />
            <span>Academic Advisor Meeting Logs</span>
          </h2>

          <div className="space-y-3">
            {myNotes.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No formal advising meeting logs recorded yet.</p>
            ) : (
              myNotes.map(note => (
                <div key={note.id} className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">{note.topic}</span>
                    <span className="font-mono text-[10px] text-slate-400">{note.date}</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">{note.content}</p>
                  <p className="text-[11px] text-slate-400 italic">Advisor: {note.advisorName}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Raise Support Ticket Form */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md space-y-4 text-xs">
          <h2 className="font-bold text-white text-base flex items-center space-x-2">
            <FileText className="w-5 h-5 text-emerald-400" />
            <span>Submit Student Help Ticket</span>
          </h2>

          {ticketSubmitted && (
            <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-500/50 text-emerald-200 flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Help Ticket submitted successfully! Ticket ID #TK-2026-88.</span>
            </div>
          )}

          <form onSubmit={handleTicketSubmit} className="space-y-3">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Issue Category</label>
              <select
                value={ticketCategory}
                onChange={(e) => setTicketCategory(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none"
              >
                <option value="Academic Advising">Academic Advising / Degree Audit</option>
                <option value="Grade Appeal">Grade Re-Evaluation Appeal</option>
                <option value="Transcript Request">Transcript / Document Verification Issue</option>
                <option value="Financial Inquiry">Tuition / Fee Invoice Question</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Subject</label>
              <input
                type="text"
                value={ticketSubject}
                onChange={(e) => setTicketSubject(e.target.value)}
                placeholder="e.g. Inquiry regarding CSC301 prerequisites"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white placeholder-slate-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Detailed Description</label>
              <textarea
                value={ticketBody}
                onChange={(e) => setTicketBody(e.target.value)}
                rows={3}
                placeholder="Explain your inquiry in detail..."
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white placeholder-slate-500 focus:outline-none"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition shadow-lg shadow-indigo-600/30 flex items-center justify-center space-x-2"
            >
              <Send className="w-4 h-4" />
              <span>Submit Ticket</span>
            </button>
          </form>
        </div>

      </div>

    </div>
  );
};
