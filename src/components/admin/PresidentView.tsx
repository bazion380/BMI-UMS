import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Building2, 
  TrendingUp, 
  Users, 
  GraduationCap, 
  DollarSign, 
  CheckCircle2, 
  ShieldCheck,
  Award,
  Plus,
  FileCheck,
  X
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  BarChart, 
  Bar, 
  CartesianGrid 
} from 'recharts';

export const PresidentView: React.FC = () => {
  const { students, staffList, invoices, auditLogs, executiveApprovals, approveExecutiveSignoff, addExecutiveProposal } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDept, setNewDept] = useState('Academic Affairs');
  const [newPriority, setNewPriority] = useState<'High' | 'Medium' | 'Low'>('High');

  const totalStudents = students.length + 1420; // total campus count
  const totalFaculty = staffList.length + 180;
  const totalRevenue = invoices.reduce((acc, inv) => acc + inv.amountPaid, 0) + 14200000;

  const handleCreateProposal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    addExecutiveProposal(newTitle.trim(), newDept, newPriority);
    setNewTitle('');
    setShowModal(false);
  };

  // Enrollment & Revenue Trends Data
  const trendData = [
    { year: '2022', enrollment: 1120, revenue: 9.8 },
    { year: '2023', enrollment: 1250, revenue: 11.2 },
    { year: '2024', enrollment: 1380, revenue: 12.6 },
    { year: '2025', enrollment: 1450, revenue: 13.9 },
    { year: '2026', enrollment: 1520, revenue: 15.1 },
  ];

  const departmentData = [
    { name: 'Computing & AI', students: 580, satisfaction: 94 },
    { name: 'Business & Econ', students: 420, satisfaction: 89 },
    { name: 'Mathematics', students: 210, satisfaction: 91 },
    { name: 'Humanities', students: 180, satisfaction: 88 },
    { name: 'Engineering', students: 310, satisfaction: 95 },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Executive Role Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/30 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/30">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">President & Vice-Chancellor Executive Dashboard</h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Institution-wide strategic analytics, financial performance, and cross-departmental benchmarks.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition shadow-lg flex items-center space-x-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Executive Proposal</span>
        </button>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
          <span className="text-slate-400 font-semibold">Total Campus Enrollment</span>
          <div className="text-2xl font-bold text-white mt-2">{totalStudents.toLocaleString()} Students</div>
          <p className="text-emerald-400 text-[11px] mt-1 flex items-center space-x-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+4.8% YoY Growth</span>
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
          <span className="text-slate-400 font-semibold">Academic & Administrative Faculty</span>
          <div className="text-2xl font-bold text-indigo-400 mt-2">{totalFaculty} Staff Members</div>
          <p className="text-slate-400 text-[11px] mt-1">Student-Faculty Ratio: 14:1</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
          <span className="text-slate-400 font-semibold">Annual Revenue Collected</span>
          <div className="text-2xl font-bold text-emerald-400 mt-2">${(totalRevenue / 1000000).toFixed(2)}M</div>
          <p className="text-emerald-400 text-[11px] mt-1">98.2% Collection Efficiency</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
          <span className="text-slate-400 font-semibold">Institutional Quality Score</span>
          <div className="text-2xl font-bold text-amber-400 mt-2">A+ Rating</div>
          <p className="text-slate-400 text-[11px] mt-1">Accreditation Verified</p>
        </div>

      </div>

      {/* Recharts Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Revenue & Enrollment Trends Area Chart */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md text-xs">
          <h2 className="font-bold text-white text-base mb-4">5-Year Revenue Growth ($ Millions)</h2>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="year" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }} />
                <Area type="monotone" dataKey="revenue" stroke="#6366f1" fillOpacity={1} fill="url(#revenueGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Department Benchmarks Bar Chart */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md text-xs">
          <h2 className="font-bold text-white text-base mb-4">Department Student Distribution</h2>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }} />
                <Bar dataKey="students" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Executive Approvals Sign-off Panel */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md text-xs space-y-4">
        <h2 className="font-bold text-white text-base flex items-center space-x-2">
          <ShieldCheck className="w-5 h-5 text-amber-400" />
          <span>Executive Sign-Offs & Governance Approvals</span>
        </h2>

        <div className="space-y-3">
          {executiveApprovals.map(item => (
            <div key={item.id} className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-2">
                  <p className="font-bold text-white text-sm">{item.title}</p>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    item.priority === 'High' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-amber-500/20 text-amber-400'
                  }`}>
                    {item.priority} Priority
                  </span>
                </div>
                <p className="text-slate-400 text-[11px] mt-1">Department: {item.dept}</p>
                {item.signed && (
                  <p className="text-emerald-400 text-[10px] mt-0.5 flex items-center space-x-1">
                    <FileCheck className="w-3 h-3" />
                    <span>Signed on {item.signedDate} by {item.signerName}</span>
                  </p>
                )}
              </div>
              <div>
                {item.signed ? (
                  <span className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold text-xs flex items-center space-x-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Approved & Sealed</span>
                  </span>
                ) : (
                  <button
                    onClick={() => approveExecutiveSignoff(item.id)}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition flex items-center space-x-1.5 shadow-md"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Sign & Approve</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* New Proposal Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 text-xs text-slate-200 shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <Building2 className="w-5 h-5 text-indigo-400" />
                <span>Submit Executive Proposal</span>
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProposal} className="space-y-4">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Proposal Title & Scope</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Center for Quantum AI Infrastructure Grant"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Originating Department</label>
                  <select
                    value={newDept}
                    onChange={(e) => setNewDept(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Academic Affairs">Academic Affairs</option>
                    <option value="Facilities & Planning">Facilities & Planning</option>
                    <option value="School of Computing">School of Computing</option>
                    <option value="School of Business">School of Business</option>
                    <option value="Finance & Operations">Finance & Operations</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Priority Level</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="High">High Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="Low">Low Priority</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition shadow-lg"
                >
                  Submit Charter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
