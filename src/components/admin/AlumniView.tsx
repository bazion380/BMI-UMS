import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { GraduationCap, Heart, DollarSign, Plus, X, Award } from 'lucide-react';
import { AlumniRecord } from '../../types';

export const AlumniView: React.FC = () => {
  const { alumniList, recordAlumniDonation, updateAlumniRecord } = useApp();

  const [selectedAlumni, setSelectedAlumni] = useState<AlumniRecord | null>(null);
  const [donationAmount, setDonationAmount] = useState(500);

  const totalDonations = alumniList.reduce((acc, a) => acc + a.totalDonations, 0);

  const handleRecordDonation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAlumni || donationAmount <= 0) return;

    recordAlumniDonation(selectedAlumni.id, donationAmount);
    setSelectedAlumni(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      <div>
        <h1 className="text-xl font-bold text-white flex items-center space-x-2">
          <GraduationCap className="w-6 h-6 text-indigo-400" />
          <span>Alumni Relations & Advancement Office</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Graduation transitions, alumni directory, endowment donation tracking, and industry mentorship matching.
        </p>
      </div>

      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 text-xs shadow-md flex items-center justify-between">
        <div>
          <span className="text-slate-400 font-semibold">Total Endowment Donations Received</span>
          <div className="text-2xl font-bold text-emerald-400 mt-2">${totalDonations.toLocaleString()}</div>
          <p className="text-slate-400 text-[11px] mt-1">Active Alumni Mentors: {alumniList.filter(a => a.mentorshipStatus === 'Active Mentor').length}</p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md text-xs space-y-4">
        <h2 className="font-bold text-white text-base">Graduated Alumni Directory</h2>

        <div className="space-y-3">
          {alumniList.map(alm => (
            <div key={alm.id} className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between">
              <div>
                <p className="font-bold text-white text-sm">{alm.name} ('{alm.graduationYear})</p>
                <p className="text-slate-300 text-[11px] mt-0.5">{alm.degree} • {alm.currentRole} at <strong className="text-indigo-300">{alm.currentCompany}</strong></p>
                <p className="text-slate-400 text-[10px] mt-0.5">Email: {alm.email}</p>
              </div>

              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <span className="px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                    ${alm.totalDonations.toLocaleString()} Donated
                  </span>
                  <p className="text-[10px] text-slate-400 mt-1">{alm.mentorshipStatus}</p>
                </div>

                <div className="flex flex-col space-y-1">
                  <button
                    onClick={() => setSelectedAlumni(alm)}
                    className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-[10px] transition"
                  >
                    Record Donation
                  </button>
                  <button
                    onClick={() => {
                      const nextStatus = alm.mentorshipStatus === 'Active Mentor' ? 'Not Opted' : 'Active Mentor';
                      updateAlumniRecord(alm.id, { mentorshipStatus: nextStatus });
                    }}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-indigo-300 font-bold rounded-lg text-[10px] transition"
                  >
                    Toggle Mentor
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Record Donation Modal */}
      {selectedAlumni && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 text-slate-100 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="font-bold text-white text-base">Record Endowment Gift</h2>
              <button onClick={() => setSelectedAlumni(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRecordDonation} className="space-y-3">
              <p className="text-slate-300">Donor: <strong>{selectedAlumni.name}</strong></p>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Gift / Donation Amount ($)</label>
                <input
                  type="number"
                  value={donationAmount}
                  onChange={(e) => setDonationAmount(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white font-mono"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition"
              >
                Record Donation to Endowment
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
