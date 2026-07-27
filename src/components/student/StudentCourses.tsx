import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BookOpen, User, Clock, MapPin, FileText, CheckCircle, MessageSquare, Send, CheckCircle2, Upload, X } from 'lucide-react';

export const StudentCourses: React.FC = () => {
  const { students, activeStudentId, enrollments, courses } = useApp();
  const student = students.find(s => s.id === activeStudentId) || students[0];

  const myEnrollments = enrollments.filter(e => e.studentId === student.id && e.status === 'Enrolled');
  const myCourses = courses.filter(c => myEnrollments.some(e => e.courseId === c.id));

  const [selectedCourseId, setSelectedCourseId] = useState<string>(myCourses[0]?.id || '');
  const activeCourse = myCourses.find(c => c.id === selectedCourseId) || myCourses[0];

  // Contact Instructor Modal & Message State
  const [showContactModal, setShowContactModal] = useState(false);
  const [msgSubject, setMsgSubject] = useState('');
  const [msgBody, setMsgBody] = useState('');
  const [messages, setMessages] = useState<Array<{ id: string; courseCode: string; instructor: string; subject: string; body: string; date: string }>>([
    { id: 'msg-1', courseCode: activeCourse?.code || 'CSC301', instructor: activeCourse?.instructorName || 'Dr. Alan Vance', subject: 'Office Hours Appointment', body: 'Requesting clarification on Assignment 2 problem set.', date: '2026-07-22' }
  ]);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  // Homework Assignment Submission state
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);
  const [submissionText, setSubmissionText] = useState('');
  const [submittedAssignments, setSubmittedAssignments] = useState<Array<{ id: string; courseCode: string; title: string; date: string; status: string }>>([
    { id: 'SUB-901', courseCode: 'CSC301', title: 'Midterm Research Paper - Algorithms', date: '2026-07-15', status: 'Graded (A)' }
  ]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!msgSubject || !msgBody || !activeCourse) return;

    const newMsg = {
      id: `msg-${Date.now()}`,
      courseCode: activeCourse.code,
      instructor: activeCourse.instructorName,
      subject: msgSubject,
      body: msgBody,
      date: new Date().toISOString().slice(0, 10)
    };

    setMessages([newMsg, ...messages]);
    setShowContactModal(false);
    setMsgSubject('');
    setMsgBody('');
    setSuccessBanner(`Message sent directly to ${activeCourse.instructorName}. Response will arrive via student portal.`);
    setTimeout(() => setSuccessBanner(null), 4000);
  };

  const handleSubmitHomework = (e: React.FormEvent) => {
    e.preventDefault();
    if (!submissionText || !activeCourse) return;

    const newSub = {
      id: `SUB-${Math.floor(100 + Math.random() * 900)}`,
      courseCode: activeCourse.code,
      title: `${activeCourse.code} Assignment Submission`,
      date: new Date().toISOString().slice(0, 10),
      status: 'Submitted for Review'
    };

    setSubmittedAssignments([newSub, ...submittedAssignments]);
    setShowSubmissionModal(false);
    setSubmissionText('');
    setSuccessBanner(`Assignment successfully submitted for ${activeCourse.code}.`);
    setTimeout(() => setSuccessBanner(null), 4000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Page Header */}
      <div>
        <h1 className="text-xl font-bold text-white flex items-center space-x-2">
          <BookOpen className="w-6 h-6 text-indigo-400" />
          <span>My Enrolled Courses (Fall 2026)</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Access course syllabus, lecturer details, assignment submissions, and instructor messages.
        </p>
      </div>

      {successBanner && (
        <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/50 text-emerald-200 text-xs flex items-center space-x-2 shadow-md">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-semibold">{successBanner}</span>
        </div>
      )}

      {myCourses.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-slate-400 text-xs">
          You are currently not enrolled in any courses for Fall 2026. Please visit the Registration tab.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Course Navigation List */}
          <div className="space-y-3">
            {myCourses.map(course => {
              const enrollment = myEnrollments.find(e => e.courseId === course.id);
              const isSelected = course.id === activeCourse?.id;

              return (
                <div
                  key={course.id}
                  onClick={() => setSelectedCourseId(course.id)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-indigo-950/60 border-indigo-500/80 shadow-lg text-white ring-1 ring-indigo-500/30'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/80'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      {course.code}
                    </span>
                    <span className="text-[11px] font-mono text-emerald-400">
                      Attn: {enrollment?.attendancePercentage || 100}%
                    </span>
                  </div>
                  <h3 className="font-bold text-sm mt-2">{course.title}</h3>
                  <p className="text-xs text-slate-400 mt-1 flex items-center space-x-2">
                    <User className="w-3 h-3 text-slate-500" />
                    <span>{course.instructorName}</span>
                  </p>
                </div>
              );
            })}
          </div>

          {/* Right Detailed View */}
          {activeCourse && (
            <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-md">
              
              {/* Course Title Banner */}
              <div className="border-b border-slate-800 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-1 rounded-lg bg-indigo-600 text-white font-mono text-xs font-bold">
                      {activeCourse.code}
                    </span>
                    <span className="text-xs font-medium text-slate-400">
                      {activeCourse.credits} Academic Credits
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-white mt-2">{activeCourse.title}</h2>
                  <p className="text-xs text-slate-300 leading-relaxed mt-2">{activeCourse.description}</p>
                </div>

                <button
                  onClick={() => setShowSubmissionModal(true)}
                  className="px-3.5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md transition flex items-center space-x-1.5 shrink-0"
                >
                  <Upload className="w-4 h-4" />
                  <span>Submit Assignment</span>
                </button>
              </div>

              {/* Schedule Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-indigo-400 shrink-0" />
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-bold">Lecture Schedule</span>
                    <p className="font-semibold text-white mt-0.5">{activeCourse.schedule}</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-blue-400 shrink-0" />
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-bold">Classroom Location</span>
                    <p className="font-semibold text-white mt-0.5">{activeCourse.room}</p>
                  </div>
                </div>
              </div>

              {/* Syllabus Breakdown */}
              <div>
                <h3 className="font-bold text-white text-sm flex items-center space-x-2 mb-3">
                  <FileText className="w-4 h-4 text-indigo-400" />
                  <span>Syllabus & Learning Outcomes</span>
                </h3>
                <div className="space-y-2 text-xs">
                  {activeCourse.syllabus.map((item, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-800/40 border border-slate-800 flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span className="text-slate-300">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submitted Homework Submissions */}
              <div className="pt-4 border-t border-slate-800 space-y-3 text-xs">
                <h3 className="font-bold text-white text-sm">Course Submissions & Grades</h3>
                <div className="space-y-2">
                  {submittedAssignments
                    .filter(s => s.courseCode === activeCourse.code)
                    .map(sub => (
                      <div key={sub.id} className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-800 flex items-center justify-between">
                        <div>
                          <p className="font-bold text-white">{sub.title}</p>
                          <p className="text-slate-400 text-[11px]">ID: {sub.id} • Submitted: {sub.date}</p>
                        </div>
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                          {sub.status}
                        </span>
                      </div>
                    ))}
                </div>
              </div>

              {/* Instructor Contact Footer */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold">Course Lecturer</span>
                  <p className="font-bold text-white">{activeCourse.instructorName}</p>
                  <p className="text-slate-400">Department: {activeCourse.department}</p>
                </div>
                <button
                  onClick={() => setShowContactModal(true)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-300 font-medium border border-slate-700 transition flex items-center space-x-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Contact Instructor</span>
                </button>
              </div>

            </div>
          )}

        </div>
      )}

      {/* Contact Instructor Modal */}
      {showContactModal && activeCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 text-slate-100 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h2 className="font-bold text-white text-base">Send Message to Lecturer</h2>
                <p className="text-slate-400">{activeCourse.instructorName} ({activeCourse.code})</p>
              </div>
              <button onClick={() => setShowContactModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendMessage} className="space-y-3">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Subject</label>
                <input
                  type="text"
                  value={msgSubject}
                  onChange={(e) => setMsgSubject(e.target.value)}
                  placeholder="e.g. Question regarding Lab Assignment #3"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Message Content</label>
                <textarea
                  value={msgBody}
                  onChange={(e) => setMsgBody(e.target.value)}
                  rows={4}
                  placeholder="Type your question or request..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition flex items-center justify-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>Dispatch Message</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Assignment Submission Modal */}
      {showSubmissionModal && activeCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 text-slate-100 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h2 className="font-bold text-white text-base">Submit Assignment Homework</h2>
                <p className="text-slate-400">{activeCourse.code} • {activeCourse.title}</p>
              </div>
              <button onClick={() => setShowSubmissionModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitHomework} className="space-y-3">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Assignment Response / Link / Notes</label>
                <textarea
                  value={submissionText}
                  onChange={(e) => setSubmissionText(e.target.value)}
                  rows={4}
                  placeholder="Paste GitHub repository URL, essay summary, or research project notes..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                  required
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700 text-slate-400 text-[11px]">
                📄 Official plagiarism scanner check will be automatically run upon submission.
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition flex items-center justify-center space-x-2"
              >
                <Upload className="w-4 h-4" />
                <span>Submit Assignment</span>
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
