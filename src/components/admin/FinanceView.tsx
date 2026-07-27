import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  CreditCard, 
  DollarSign, 
  Lock, 
  CheckCircle2, 
  AlertTriangle, 
  Plus, 
  X,
  FileCheck2,
  Award,
  Receipt
} from 'lucide-react';
import { FeeInvoice } from '../../types';

export const FinanceView: React.FC = () => {
  const { invoices, students, toggleStudentHold, processInvoicePayment, createInvoice, applyScholarshipToInvoice } = useApp();

  const [showCreateInvoice, setShowCreateInvoice] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState(students[0]?.id || '');
  const [invoiceTerm, setInvoiceTerm] = useState('Fall 2026');
  const [tuitionFee, setTuitionFee] = useState(6500);
  const [techFee, setTechFee] = useState(450);

  // Scholarship Modal State
  const [scholarshipInvoice, setScholarshipInvoice] = useState<FeeInvoice | null>(null);
  const [scholarshipName, setScholarshipName] = useState('Presidential Merit Grant');
  const [scholarshipAmount, setScholarshipAmount] = useState(1500);

  const totalInvoiced = invoices.reduce((acc, i) => acc + i.totalAmount, 0);
  const totalCollected = invoices.reduce((acc, i) => acc + i.amountPaid, 0);
  const totalOutstanding = totalInvoiced - totalCollected;

  const handleCreateInvoiceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentId) return;

    createInvoice(selectedStudentId, invoiceTerm, [
      { description: 'Tuition Fee (12-18 Credits)', amount: tuitionFee },
      { description: 'Technology & Lab Infrastructure Fee', amount: techFee }
    ]);

    setShowCreateInvoice(false);
  };

  const handleApplyScholarship = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scholarshipInvoice) return;

    applyScholarshipToInvoice(scholarshipInvoice.id, scholarshipAmount, scholarshipName);
    setScholarshipInvoice(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center space-x-2">
            <CreditCard className="w-6 h-6 text-emerald-400" />
            <span>Finance Officer & Bursar Console</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Bursar revenue tracking, financial hold enforcement, tuition invoice generation, and scholarship grants.
          </p>
        </div>

        <button
          onClick={() => setShowCreateInvoice(true)}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs shadow-lg transition flex items-center space-x-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Issue Tuition Invoice</span>
        </button>
      </div>

      {/* Financial KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
          <span className="text-slate-400 font-semibold">Total Invoiced (Term)</span>
          <div className="text-2xl font-bold text-white mt-2">${totalInvoiced.toLocaleString()}</div>
          <p className="text-slate-400 text-[11px] mt-1">Tuition & Lab Fees</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
          <span className="text-slate-400 font-semibold">Total Collected</span>
          <div className="text-2xl font-bold text-emerald-400 mt-2">${totalCollected.toLocaleString()}</div>
          <p className="text-emerald-400 text-[11px] mt-1">Reconciled Payments</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
          <span className="text-slate-400 font-semibold">Outstanding Balance</span>
          <div className="text-2xl font-bold text-rose-400 mt-2">${totalOutstanding.toLocaleString()}</div>
          <p className="text-slate-400 text-[11px] mt-1">Active Holds Placed</p>
        </div>
      </div>

      {/* Financial Holds Enforcement Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md space-y-4">
        <h2 className="font-bold text-white text-base flex items-center space-x-2">
          <Lock className="w-5 h-5 text-rose-400" />
          <span>Student Account Financial Holds Manager</span>
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase font-bold text-[10px]">
                <th className="p-3">Student Number</th>
                <th className="p-3">Student Name</th>
                <th className="p-3">Program</th>
                <th className="p-3">Financial Hold Status</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {students.map(std => (
                <tr key={std.id} className="hover:bg-slate-800/40 transition">
                  <td className="p-3 font-mono font-bold text-indigo-300">{std.studentNumber}</td>
                  <td className="p-3 font-semibold text-white">{std.firstName} {std.lastName}</td>
                  <td className="p-3 text-slate-300">{std.program}</td>
                  <td className="p-3">
                    {std.financialHold ? (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                        ACTIVE HOLD (LOCKED)
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        CLEAR / GOOD STANDING
                      </span>
                    )}
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => toggleStudentHold(std.id, 'financial', !std.financialHold)}
                      className={`px-3 py-1 rounded-lg text-[11px] font-bold transition ${
                        std.financialHold
                          ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                          : 'bg-rose-600 hover:bg-rose-500 text-white'
                      }`}
                    >
                      {std.financialHold ? 'Clear Financial Hold' : 'Impose Hold'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoices Reconciled Ledger */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md space-y-4">
        <h2 className="font-bold text-white text-base">Invoices Ledger Reconciliation</h2>

        <div className="space-y-3 text-xs">
          {invoices.map(inv => {
            const student = students.find(s => s.id === inv.studentId);
            const remaining = inv.totalAmount - inv.amountPaid;
            return (
              <div key={inv.id} className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-indigo-300">{inv.invoiceNumber}</span>
                    <span className="text-white font-semibold">{student?.firstName} {student?.lastName} ({student?.studentNumber})</span>
                  </div>
                  <p className="text-slate-400 text-[11px] mt-0.5">Term: {inv.term} • Issue Date: {inv.issueDate}</p>
                </div>

                <div className="flex items-center space-x-4 shrink-0">
                  <div className="text-right">
                    <span className="font-mono font-bold text-white text-sm">${inv.amountPaid.toLocaleString()} / ${inv.totalAmount.toLocaleString()}</span>
                    <span className={`block text-[10px] font-bold uppercase mt-0.5 ${inv.status === 'Paid' ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {inv.status}
                    </span>
                  </div>

                  <div className="flex items-center space-x-1.5">
                    {remaining > 0 && (
                      <button
                        onClick={() => setScholarshipInvoice(inv)}
                        className="px-2.5 py-1.5 bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 font-bold rounded-lg transition flex items-center space-x-1 text-[11px]"
                      >
                        <Award className="w-3.5 h-3.5" />
                        <span>Apply Scholarship</span>
                      </button>
                    )}

                    {remaining > 0 && (
                      <button
                        onClick={() => processInvoicePayment(inv.id, remaining)}
                        className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg transition flex items-center space-x-1 text-[11px]"
                      >
                        <DollarSign className="w-3.5 h-3.5" />
                        <span>Reconcile Full Payment</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Create Invoice Modal */}
      {showCreateInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 text-slate-100 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="font-bold text-white text-base">Issue New Tuition & Fee Invoice</h2>
              <button onClick={() => setShowCreateInvoice(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateInvoiceSubmit} className="space-y-3">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Select Student</label>
                <select
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                >
                  {students.map(s => (
                    <option key={s.id} value={s.id}>{s.firstName} {s.lastName} ({s.studentNumber})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Academic Term</label>
                <input
                  type="text"
                  value={invoiceTerm}
                  onChange={(e) => setInvoiceTerm(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Tuition Fee ($)</label>
                  <input
                    type="number"
                    value={tuitionFee}
                    onChange={(e) => setTuitionFee(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Tech/Lab Fee ($)</label>
                  <input
                    type="number"
                    value={techFee}
                    onChange={(e) => setTechFee(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition"
              >
                Generate & Post Invoice
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Apply Scholarship Modal */}
      {scholarshipInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 text-slate-100 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="font-bold text-white text-base">Apply Scholarship or Grant</h2>
              <button onClick={() => setScholarshipInvoice(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleApplyScholarship} className="space-y-3">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Scholarship / Grant Title</label>
                <input
                  type="text"
                  value={scholarshipName}
                  onChange={(e) => setScholarshipName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Discount Amount ($)</label>
                <input
                  type="number"
                  value={scholarshipAmount}
                  onChange={(e) => setScholarshipAmount(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white font-mono"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition"
              >
                Apply Financial Aid
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
