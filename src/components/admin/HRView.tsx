import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Users, Briefcase, CheckCircle2, Plus, X, Edit2 } from 'lucide-react';
import { StaffRecord } from '../../types';

export const HRView: React.FC = () => {
  const { staffList, addStaffRecord, updateStaffRecord } = useApp();

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffRecord | null>(null);

  // New Staff State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'lecturer' | 'registrar' | 'finance' | 'admissions' | 'hr' | 'librarian' | 'advisor' | 'alumni' | 'it'>('lecturer');
  const [title, setTitle] = useState('Senior Lecturer');
  const [department, setDepartment] = useState('School of Computing & Engineering');
  const [teachingLoad, setTeachingLoad] = useState(12);

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    addStaffRecord({
      name,
      email,
      role,
      title,
      department,
      teachingLoadCredits: teachingLoad,
      hireDate: new Date().toISOString().split('T')[0]
    });

    setShowAddModal(false);
    setName('');
    setEmail('');
  };

  const handleUpdateStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStaff) return;

    updateStaffRecord(editingStaff.id, editingStaff);
    setEditingStaff(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center space-x-2">
            <Briefcase className="w-6 h-6 text-indigo-400" />
            <span>Human Resources & Staff Management</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Faculty directories, workload credit analysis, tenure track records, and leave requests.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs shadow-lg transition flex items-center space-x-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Onboard New Staff Member</span>
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md text-xs space-y-4">
        <h2 className="font-bold text-white text-base">Academic & Administrative Staff Directory</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase font-bold text-[10px]">
                <th className="p-3">Staff ID</th>
                <th className="p-3">Full Name</th>
                <th className="p-3">Title & Designation</th>
                <th className="p-3">Department</th>
                <th className="p-3">Teaching Load</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {staffList.map(stf => (
                <tr key={stf.id} className="hover:bg-slate-800/40 transition">
                  <td className="p-3 font-mono font-bold text-indigo-300">{stf.staffNumber}</td>
                  <td className="p-3 font-semibold text-white">{stf.name}</td>
                  <td className="p-3 text-slate-300">{stf.title}</td>
                  <td className="p-3 text-slate-400">{stf.department}</td>
                  <td className="p-3 font-mono font-bold text-emerald-400">{stf.teachingLoadCredits} Credits/wk</td>
                  <td className="p-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {stf.status}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => setEditingStaff(stf)}
                      className="p-1.5 bg-slate-800 hover:bg-slate-700 text-indigo-300 rounded-lg transition"
                      title="Edit Staff Record"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Onboard New Staff Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 text-slate-100 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="font-bold text-white text-base">Onboard New Faculty / Administrative Staff</h2>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddStaff} className="space-y-3">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Dr. Arthur Pendelton"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. arthur@brighthorizon.edu"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">System Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white capitalize"
                  >
                    {['lecturer', 'registrar', 'finance', 'admissions', 'hr', 'librarian', 'advisor', 'alumni', 'it'].map(r => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Teaching Load (hrs/wk)</label>
                  <input
                    type="number"
                    value={teachingLoad}
                    onChange={(e) => setTeachingLoad(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition"
              >
                Create Staff Profile
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Staff Modal */}
      {editingStaff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 text-slate-100 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="font-bold text-white text-base">Edit Staff Record — {editingStaff.staffNumber}</h2>
              <button onClick={() => setEditingStaff(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateStaff} className="space-y-3">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Title & Designation</label>
                <input
                  type="text"
                  value={editingStaff.title}
                  onChange={(e) => setEditingStaff({ ...editingStaff, title: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Department</label>
                <input
                  type="text"
                  value={editingStaff.department}
                  onChange={(e) => setEditingStaff({ ...editingStaff, department: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Teaching Load (Credits/wk)</label>
                <input
                  type="number"
                  value={editingStaff.teachingLoadCredits}
                  onChange={(e) => setEditingStaff({ ...editingStaff, teachingLoadCredits: Number(e.target.value) })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white font-mono"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition"
              >
                Save Record Updates
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
