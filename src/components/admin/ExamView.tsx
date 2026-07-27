import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Calendar, CheckCircle2, ShieldCheck, MapPin } from 'lucide-react';

export const ExamView: React.FC = () => {
  const { courses } = useApp();
  const [released, setReleased] = useState(false);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      <div>
        <h1 className="text-xl font-bold text-white flex items-center space-x-2">
          <Calendar className="w-6 h-6 text-indigo-400" />
          <span>Examination Office & Seating Planner</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Final exam schedules, invigilator assignments, results verification, and confidential grade appeals.
        </p>
      </div>

      {released && (
        <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/50 text-emerald-200 text-xs flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span className="font-semibold">Official Fall 2026 Examination Results officially published to Student Portals!</span>
        </div>
      )}

      {/* Exam Schedule */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md space-y-4 text-xs">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h2 className="font-bold text-white text-base">Fall 2026 Examination Seating Matrix</h2>
          <button
            onClick={() => setReleased(true)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow transition"
          >
            Release Official Exam Results
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {courses.map(crs => (
            <div key={crs.id} className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-mono font-bold text-indigo-300 text-xs px-2 py-0.5 rounded bg-indigo-500/20">{crs.code}</span>
                <span className="text-[10px] text-emerald-400 font-bold">Seating Plan Ready</span>
              </div>
              <h3 className="font-bold text-white text-sm">{crs.title}</h3>
              <p className="text-slate-400 flex items-center space-x-1">
                <MapPin className="w-3.5 h-3.5 text-blue-400" />
                <span>Venue: Great Hall Auditorium • Capacity 120 Seats</span>
              </p>
              <p className="text-slate-400">Chief Invigilator: {crs.instructorName}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
