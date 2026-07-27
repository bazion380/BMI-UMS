import React from 'react';
import { useApp } from '../../context/AppContext';
import { Calendar, MapPin, User, Clock } from 'lucide-react';

export const StudentTimetable: React.FC = () => {
  const { students, activeStudentId, enrollments, courses } = useApp();
  const student = students.find(s => s.id === activeStudentId) || students[0];

  const myEnrollments = enrollments.filter(e => e.studentId === student.id && e.status === 'Enrolled');
  const myCourses = courses.filter(c => myEnrollments.some(e => e.courseId === c.id));

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  const timeSlots = [
    '09:00 AM - 10:00 AM',
    '10:00 AM - 11:30 AM',
    '11:30 AM - 01:00 PM',
    '01:00 PM - 02:30 PM',
    '02:30 PM - 04:00 PM'
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Page Header */}
      <div>
        <h1 className="text-xl font-bold text-white flex items-center space-x-2">
          <Calendar className="w-6 h-6 text-indigo-400" />
          <span>Weekly Lecture & Exam Timetable</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Interactive schedule matrix mapping lecture hours, room numbers, and faculty assignments.
        </p>
      </div>

      {/* Timetable Grid */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl overflow-x-auto">
        <table className="w-full text-xs text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b border-slate-800">
              <th className="p-3 text-slate-400 font-bold uppercase tracking-wider w-32">Time Slot</th>
              {days.map(day => (
                <th key={day} className="p-3 text-slate-200 font-bold uppercase tracking-wider text-center">
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {timeSlots.map((slot, sIdx) => (
              <tr key={sIdx} className="hover:bg-slate-800/30 transition">
                <td className="p-3 font-mono text-slate-400 text-[11px] font-semibold border-r border-slate-800">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3 text-indigo-400" />
                    <span>{slot}</span>
                  </div>
                </td>

                {days.map(day => {
                  // Find course matching day & time
                  const matchingCourse = myCourses.find(c => {
                    const sched = c.schedule.toLowerCase();
                    const dayAbbr = day.substring(0, 3).toLowerCase();
                    return sched.includes(dayAbbr);
                  });

                  // Render logic for grid matching
                  const isSlotActive = matchingCourse && (
                    (sIdx === 0 && matchingCourse.schedule.includes('09:00')) ||
                    (sIdx === 1 && matchingCourse.schedule.includes('10:00')) ||
                    (sIdx === 3 && matchingCourse.schedule.includes('01:00')) ||
                    (sIdx === 4 && matchingCourse.schedule.includes('02:00'))
                  );

                  return (
                    <td key={day} className="p-2 border-r border-slate-800/40 min-h-[90px] vertical-top">
                      {isSlotActive && matchingCourse ? (
                        <div className="p-3 rounded-xl bg-indigo-950/70 border border-indigo-500/50 text-indigo-100 shadow-md">
                          <span className="font-mono font-bold text-xs bg-indigo-500/20 px-1.5 py-0.5 rounded border border-indigo-500/30 text-indigo-300">
                            {matchingCourse.code}
                          </span>
                          <p className="font-semibold text-white text-xs mt-1 truncate">{matchingCourse.title}</p>
                          <p className="text-[10px] text-slate-300 mt-1 flex items-center space-x-1">
                            <MapPin className="w-2.5 h-2.5 text-indigo-400" />
                            <span>{matchingCourse.room}</span>
                          </p>
                          <p className="text-[10px] text-slate-400 flex items-center space-x-1 mt-0.5">
                            <User className="w-2.5 h-2.5 text-slate-500" />
                            <span className="truncate">{matchingCourse.instructorName}</span>
                          </p>
                        </div>
                      ) : (
                        <div className="h-full min-h-[60px] rounded-lg border border-dashed border-slate-800/40 bg-slate-950/20"></div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer Notes */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400 flex items-center justify-between">
        <span>Need classroom change or room booking? Contact the Registrar's Office.</span>
        <button
          onClick={() => window.print()}
          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition font-medium"
        >
          Print Timetable PDF
        </button>
      </div>

    </div>
  );
};
