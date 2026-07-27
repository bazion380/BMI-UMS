import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  BookOpen, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  Users, 
  Clock, 
  Lock,
  Search
} from 'lucide-react';

export const StudentRegistration: React.FC = () => {
  const { students, activeStudentId, courses, enrollments, enrollStudentInCourse, dropStudentFromCourse } = useApp();
  const student = students.find(s => s.id === activeStudentId) || students[0];

  const [searchQuery, setSearchQuery] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const myEnrollments = enrollments.filter(e => e.studentId === student.id && e.status === 'Enrolled');
  const myEnrolledCourseIds = myEnrollments.map(e => e.courseId);

  const handleEnroll = (courseId: string) => {
    setFeedback(null);
    const result = enrollStudentInCourse(student.id, courseId);
    if (result.success) {
      setFeedback({ type: 'success', text: result.message });
    } else {
      setFeedback({ type: 'error', text: result.message });
    }
  };

  const handleDrop = (courseId: string) => {
    dropStudentFromCourse(student.id, courseId);
    setFeedback({ type: 'success', text: 'Course successfully dropped.' });
  };

  const filteredCourses = courses.filter(c =>
    c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.instructorName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Page Header */}
      <div>
        <h1 className="text-xl font-bold text-white flex items-center space-x-2">
          <BookOpen className="w-6 h-6 text-indigo-400" />
          <span>Course Add / Drop Registration Engine</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Enforces capacity limits, prerequisite checks, timetable conflict alerts, and financial hold verification.
        </p>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center space-x-3 shadow-md animate-in fade-in ${
            feedback.type === 'success'
              ? 'bg-emerald-950/60 border border-emerald-500/50 text-emerald-200'
              : 'bg-rose-950/60 border border-rose-500/50 text-rose-200'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          )}
          <span className="font-semibold">{feedback.text}</span>
        </div>
      )}

      {/* Holds Alert Notice */}
      {student.financialHold && (
        <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-200 flex items-center space-x-3">
          <Lock className="w-5 h-5 text-rose-400 shrink-0" />
          <div className="text-xs">
            <span className="font-bold text-rose-300">Registration Locked:</span>
            <span> You have an active Financial Hold. Course add operations are disabled until fee invoice is settled.</span>
          </div>
        </div>
      )}

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter catalog by course code, title, or lecturer..."
          className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
        />
      </div>

      {/* Catalog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredCourses.map(course => {
          const isEnrolled = myEnrolledCourseIds.includes(course.id);
          const isFull = course.enrolledCount >= course.capacity;

          return (
            <div
              key={course.id}
              className={`p-5 rounded-2xl border transition-all ${
                isEnrolled
                  ? 'bg-indigo-950/30 border-indigo-500/50 shadow-md'
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {course.code}
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  {course.credits} Credits
                </span>
              </div>

              <h3 className="font-bold text-white text-base mt-2">{course.title}</h3>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">{course.description}</p>

              {/* Course Meta Info */}
              <div className="mt-3 space-y-1.5 text-xs text-slate-300">
                <div className="flex items-center space-x-2 text-slate-400">
                  <Clock className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{course.schedule} • {course.room}</span>
                </div>
                <div className="flex items-center space-x-2 text-slate-400">
                  <Users className="w-3.5 h-3.5 text-blue-400" />
                  <span>Instructor: {course.instructorName}</span>
                </div>
                {course.prerequisites.length > 0 && (
                  <div className="text-[11px] text-slate-400">
                    Prereqs: <span className="text-indigo-300 font-mono font-semibold">{course.prerequisites.join(', ')}</span>
                  </div>
                )}
              </div>

              {/* Capacity Progress Bar */}
              <div className="mt-4 pt-3 border-t border-slate-800">
                <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                  <span>Class Seat Capacity</span>
                  <span className={isFull ? 'text-rose-400 font-bold' : 'text-slate-300'}>
                    {course.enrolledCount} / {course.capacity} filled
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      isFull ? 'bg-rose-500' : 'bg-indigo-500'
                    }`}
                    style={{ width: `${Math.min(100, (course.enrolledCount / course.capacity) * 100)}%` }}
                  />
                </div>
              </div>

              {/* Add / Drop Action Button */}
              <div className="mt-4">
                {isEnrolled ? (
                  <button
                    onClick={() => handleDrop(course.id)}
                    className="w-full py-2 bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-800/60 font-semibold rounded-xl text-xs transition flex items-center justify-center space-x-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Drop Course</span>
                  </button>
                ) : (
                  <button
                    onClick={() => handleEnroll(course.id)}
                    disabled={student.financialHold || isFull}
                    className={`w-full py-2 rounded-xl text-xs font-semibold transition flex items-center justify-center space-x-1.5 ${
                      student.financialHold || isFull
                        ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                        : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30'
                    }`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{isFull ? 'Course Full' : 'Add Course'}</span>
                  </button>
                )}
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
