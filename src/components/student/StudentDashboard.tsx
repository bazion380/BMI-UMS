import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  GraduationCap, 
  BookOpen, 
  DollarSign, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  ArrowRight,
  Download,
  CreditCard,
  UserCheck
} from 'lucide-react';

interface StudentDashboardProps {
  onNavigateTab: (tab: string) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ onNavigateTab }) => {
  const { students, activeStudentId, enrollments, courses, invoices } = useApp();

  const student = students.find(s => s.id === activeStudentId) || students[0];

  // Calculate current student statistics
  const myEnrollments = enrollments.filter(e => e.studentId === student.id && e.status === 'Enrolled');
  const myCourses = courses.filter(c => myEnrollments.some(e => e.courseId === c.id));
  
  const myInvoices = invoices.filter(i => i.studentId === student.id);
  const totalDue = myInvoices.reduce((acc, inv) => acc + (inv.totalAmount - inv.amountPaid), 0);
  const totalEnrolledCredits = myCourses.reduce((acc, c) => acc + c.credits, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 md:p-8 border border-slate-800 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <img
              src={student.avatarUrl}
              alt={student.firstName}
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-indigo-500/50 shadow-lg"
            />
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-bold text-white">Welcome back, {student.firstName}! 👋</h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {student.program}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Lifetime Student UID: <span className="font-mono text-indigo-300 font-bold">{student.studentUid || 'BMI00002T'}</span> • Reg No: <span className="font-mono text-emerald-300 font-bold">{student.registrationNumber || student.studentNumber}</span> • Semester {student.currentSemester}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <button
              onClick={() => onNavigateTab('registration')}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs shadow-lg shadow-indigo-600/30 transition flex items-center space-x-2"
            >
              <BookOpen className="w-4 h-4" />
              <span>Register Courses</span>
            </button>
            <button
              onClick={() => onNavigateTab('fees')}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs border border-slate-700 transition flex items-center space-x-2"
            >
              <CreditCard className="w-4 h-4 text-emerald-400" />
              <span>Pay Fees (${totalDue})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Holds Alert Notice */}
      {student.financialHold && (
        <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-200 flex items-start space-x-3 shadow-md animate-pulse">
          <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div className="flex-1 text-xs">
            <h3 className="font-bold text-rose-300 text-sm">Action Required: Active Financial Hold</h3>
            <p className="mt-0.5 text-rose-200/90">
              You have an outstanding fee balance of <strong>${totalDue}</strong>. Course registration and official transcript requests are currently locked until the balance is resolved.
            </p>
            <button
              onClick={() => onNavigateTab('fees')}
              className="mt-2 px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white font-semibold rounded-lg text-xs transition inline-flex items-center space-x-1"
            >
              <span>Go to Payment Sandbox</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Cumulative GPA */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Cumulative GPA</span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
              <GraduationCap className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-white">{student.cgpa}</span>
            <span className="text-xs text-slate-400">/ 4.00 scale</span>
          </div>
          <p className="text-[11px] text-emerald-400 mt-1 flex items-center space-x-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>Dean's Honor Roll Eligible</span>
          </p>
        </div>

        {/* Enrolled Credits */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Enrolled Credits</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-white">{totalEnrolledCredits}</span>
            <span className="text-xs text-slate-400">credits ({myCourses.length} courses)</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Earned: {student.creditsEarned} / {student.creditsRequired} total
          </p>
        </div>

        {/* Fee Balance */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Fee Balance</span>
            <div className={`p-2 rounded-xl ${totalDue > 0 ? 'bg-rose-500/10 text-rose-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className={`text-2xl font-bold ${totalDue > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
              ${totalDue}
            </span>
            <span className="text-xs text-slate-400">Fall 2026 Term</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            {totalDue > 0 ? 'Due Date: Aug 15, 2026' : 'Account Fully Paid'}
          </p>
        </div>

        {/* Academic Status */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Academic Standing</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <UserCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-xl font-bold text-white">{student.academicStatus}</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Advisor: {student.advisorName}
          </p>
        </div>

      </div>

      {/* Main Grid: Enrolled Courses & Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Enrolled Courses list */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-white text-base flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-indigo-400" />
              <span>Current Enrolled Courses (Fall 2026)</span>
            </h2>
            <button
              onClick={() => onNavigateTab('courses')}
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition flex items-center space-x-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {myCourses.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-4 text-center">No enrolled courses yet. Head to Registration to add courses.</p>
            ) : (
              myCourses.map(course => {
                const enrollment = myEnrollments.find(e => e.courseId === course.id);
                return (
                  <div
                    key={course.id}
                    className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 hover:border-slate-600 transition flex items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono text-xs font-bold border border-indigo-500/30">
                          {course.code}
                        </span>
                        <h3 className="font-semibold text-white text-sm">{course.title}</h3>
                      </div>
                      <p className="text-xs text-slate-400 mt-1 flex items-center space-x-3">
                        <span className="flex items-center space-x-1">
                          <Clock className="w-3 h-3 text-slate-500" />
                          <span>{course.schedule}</span>
                        </span>
                        <span>•</span>
                        <span>{course.room}</span>
                        <span>•</span>
                        <span>{course.credits} Credits</span>
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs font-bold text-indigo-300">Grade: {enrollment?.grade || 'In Progress'}</span>
                      <p className="text-[10px] text-emerald-400 font-mono mt-0.5">
                        Attendance: {enrollment?.attendancePercentage || 100}%
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Sidebar: Advisor & Quick Shortcuts */}
        <div className="space-y-6">
          
          {/* Assigned Advisor Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Academic Advisor</h3>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-indigo-600/20 border border-indigo-500/40 text-indigo-300 flex items-center justify-center font-bold text-sm">
                MV
              </div>
              <div>
                <p className="text-sm font-bold text-white">{student.advisorName}</p>
                <p className="text-xs text-slate-400">{student.advisorEmail}</p>
              </div>
            </div>
            <button
              onClick={() => onNavigateTab('support')}
              className="mt-4 w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-xl border border-slate-700 transition"
            >
              Book Advising Session
            </button>
          </div>

          {/* Quick Actions */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Self-Service Actions</h3>
            <div className="space-y-2 text-xs">
              <button
                onClick={() => onNavigateTab('grades')}
                className="w-full text-left px-3 py-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white flex items-center justify-between transition"
              >
                <span>Download Official Transcript</span>
                <Download className="w-4 h-4 text-indigo-400" />
              </button>

              <button
                onClick={() => onNavigateTab('timetable')}
                className="w-full text-left px-3 py-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white flex items-center justify-between transition"
              >
                <span>Weekly Lecture Timetable</span>
                <Calendar className="w-4 h-4 text-blue-400" />
              </button>

              <button
                onClick={() => onNavigateTab('campus_services')}
                className="w-full text-left px-3 py-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white flex items-center justify-between transition"
              >
                <span>Hostel & Library Services</span>
                <ArrowRight className="w-4 h-4 text-emerald-400" />
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
