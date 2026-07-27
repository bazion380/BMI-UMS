import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  CreditCard, 
  CheckCircle2, 
  AlertTriangle, 
  DollarSign, 
  ShieldCheck, 
  Download, 
  X,
  FileCheck2,
  Sparkles,
  Printer,
  FileText
} from 'lucide-react';
import { FeeInvoice } from '../../types';
import { 
  SecurityWatermark, 
  GuillochePattern, 
  MicrotextBorder, 
  SecuritySealBadge 
} from '../common/DocumentSecurityComponents';

export const StudentFees: React.FC = () => {
  const { students, activeStudentId, invoices, processInvoicePayment } = useApp();
  const student = students.find(s => s.id === activeStudentId) || students[0];

  const myInvoices = invoices.filter(i => i.studentId === student.id);
  const totalBalance = myInvoices.reduce((acc, inv) => acc + (inv.totalAmount - inv.amountPaid), 0);

  // Payment Sandbox Modal State
  const [activeInvoice, setActiveInvoice] = useState<FeeInvoice | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<'Credit Card' | 'Bank Transfer' | 'Mobile Payment' | 'Scholarship Voucher'>('Credit Card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccessMessage, setPaymentSuccessMessage] = useState<string | null>(null);
  const [receiptInvoice, setReceiptInvoice] = useState<FeeInvoice | null>(null);

  const openPaymentModal = (inv: FeeInvoice) => {
    setActiveInvoice(inv);
    setPaymentAmount(inv.totalAmount - inv.amountPaid);
    setPaymentSuccessMessage(null);
  };

  const handleExecutePayment = () => {
    if (!activeInvoice || paymentAmount <= 0) return;

    setIsProcessing(true);
    setTimeout(() => {
      processInvoicePayment(activeInvoice.id, paymentAmount, paymentMethod);
      setIsProcessing(false);
      setPaymentSuccessMessage(`Payment of $${paymentAmount} successfully processed! Invoice updated.`);
      
      setTimeout(() => {
        setActiveInvoice(null);
        setPaymentSuccessMessage(null);
      }, 2000);
    }, 1200);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header Banner */}
      <div>
        <h1 className="text-xl font-bold text-white flex items-center space-x-2">
          <CreditCard className="w-6 h-6 text-emerald-400" />
          <span>Fees, Invoices & Payment Gateway</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Review itemized tuition invoices, scholarship credits, and pay outstanding balances securely in sandbox.
        </p>
      </div>

      {/* Holds Status Banner */}
      {student.financialHold ? (
        <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-200 flex items-start space-x-3 shadow-md">
          <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div className="text-xs">
            <h3 className="font-bold text-rose-300 text-sm">Financial Hold Active</h3>
            <p className="mt-0.5">
              Course registration and official transcript services are currently restricted due to an overdue balance of <strong>${totalBalance}</strong>. Paying the invoice below will automatically lift the hold immediately.
            </p>
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-emerald-200 flex items-center space-x-3 shadow-md">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <div className="text-xs">
            <h3 className="font-bold text-emerald-300 text-sm">Financial Account in Good Standing</h3>
            <p className="mt-0.5">No active financial holds detected. Full access to registration, grades, and services.</p>
          </div>
        </div>
      )}

      {/* Invoices List */}
      <div className="space-y-4">
        {myInvoices.map(inv => {
          const balance = inv.totalAmount - inv.amountPaid;
          const isPaid = inv.status === 'Paid';

          return (
            <div
              key={inv.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-md hover:border-slate-700 transition"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold text-indigo-400 bg-indigo-500/20 px-2.5 py-0.5 rounded border border-indigo-500/30">
                      {inv.invoiceNumber}
                    </span>
                    <span className="text-xs text-slate-400">{inv.term}</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Issue Date: {inv.issueDate} • Due Date: <span className="text-slate-200 font-semibold">{inv.dueDate}</span>
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase font-mono ${
                      isPaid
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-rose-500/20 text-rose-300 border border-rose-500/30 animate-pulse'
                    }`}
                  >
                    {inv.status}
                  </span>

                  <button
                    onClick={() => setReceiptInvoice(inv)}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-300 font-medium text-xs border border-slate-700 transition flex items-center space-x-1"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Official Secured Receipt</span>
                  </button>

                  {!isPaid && (
                    <button
                      onClick={() => openPaymentModal(inv)}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs shadow-lg shadow-emerald-600/30 transition flex items-center space-x-1.5"
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>Pay ${balance} Now</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Itemized Line Items */}
              <div className="space-y-2 text-xs">
                <p className="font-semibold text-slate-400 uppercase text-[10px] tracking-wider">Itemized Ledger Charges</p>
                {inv.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between py-1 border-b border-slate-800/50 text-slate-300">
                    <span>{item.description}</span>
                    <span className="font-mono font-bold text-white">${item.amount}</span>
                  </div>
                ))}

                {inv.scholarshipDiscount > 0 && (
                  <div className="flex items-center justify-between py-1 text-emerald-400 font-medium">
                    <span className="flex items-center space-x-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Scholarship Merit Grant Applied</span>
                    </span>
                    <span className="font-mono font-bold">-${inv.scholarshipDiscount}</span>
                  </div>
                )}
              </div>

              {/* Invoice Totals Bar */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs font-mono">
                <div>
                  <span className="text-slate-400">Total Invoice: </span>
                  <span className="font-bold text-white">${inv.totalAmount}</span>
                </div>
                <div>
                  <span className="text-slate-400">Amount Paid: </span>
                  <span className="font-bold text-emerald-400">${inv.amountPaid}</span>
                </div>
                <div>
                  <span className="text-slate-400">Remaining Balance: </span>
                  <span className={`font-bold ${balance > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    ${balance}
                  </span>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Payment Gateway Sandbox Modal */}
      {activeInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 text-slate-100 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-5">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h2 className="font-bold text-white text-base">BMI Payment Sandbox Gateway</h2>
              </div>
              <button
                onClick={() => setActiveInvoice(null)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {paymentSuccessMessage ? (
              <div className="p-6 rounded-xl bg-emerald-950/60 border border-emerald-500/50 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
                <h3 className="text-base font-bold text-white">Payment Successful!</h3>
                <p className="text-xs text-emerald-200">{paymentSuccessMessage}</p>
                <p className="text-[11px] text-slate-400">Financial Hold status updated automatically across system.</p>
              </div>
            ) : (
              <div className="space-y-4 text-xs">
                <div>
                  <span className="text-slate-400 font-semibold">Paying Invoice:</span>
                  <p className="font-mono font-bold text-indigo-300 text-sm">{activeInvoice.invoiceNumber} ({activeInvoice.term})</p>
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Select Payment Method</label>
                  <select
                    value={paymentMethod}
                    onChange={(e: any) => setPaymentMethod(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Credit Card">Credit Card (Visa / Mastercard)</option>
                    <option value="Bank Transfer">Direct Wire Transfer</option>
                    <option value="Mobile Payment">Mobile Money / Apple Pay</option>
                    <option value="Scholarship Voucher">Scholarship Voucher Code</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Payment Amount ($)</label>
                  <input
                    type="number"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(Number(e.target.value))}
                    max={activeInvoice.totalAmount - activeInvoice.amountPaid}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white font-mono text-base font-bold focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400">
                  ⚡ <strong>Auto-Unblock Guarantee:</strong> Paying the full remaining balance automatically clears active financial holds on your student account instantly.
                </div>

                <button
                  onClick={handleExecutePayment}
                  disabled={isProcessing}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition shadow-lg shadow-emerald-600/30 flex items-center justify-center space-x-2"
                >
                  {isProcessing ? (
                    <span>Processing Sandbox Payment...</span>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4" />
                      <span>Confirm & Pay ${paymentAmount}</span>
                    </>
                  )}
                </button>
              </div>
            )}

          </div>
        </div>
      )}

      {/* Official Secured Financial Receipt Modal */}
      {receiptInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white text-slate-900 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            
            {/* Modal Header */}
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span className="font-bold text-sm">Official Financial Statement & Receipt</span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition flex items-center space-x-1"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print / Save Receipt PDF</span>
                </button>
                <button
                  onClick={() => setReceiptInvoice(null)}
                  className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Printable Document Body */}
            <div className="printable-document p-8 overflow-y-auto space-y-6 text-xs bg-slate-50 relative border-4 border-emerald-900/10">
              
              {/* Security Background Features */}
              <GuillochePattern />
              <SecurityWatermark text="BMI OFFICIAL RECEIPT" subtext="FINANCIAL OFFICE ATTESTATION" />

              {/* Microtext Border */}
              <MicrotextBorder text="• BMI UNIVERSITY BURSAR & FINANCE OFFICE • CANONICAL FINANCIAL RECEIPT SEC-2026 • DO NOT DUPLICATE " />

              {/* Header */}
              <div className="border-b-2 border-slate-900 pb-3 flex items-center justify-between relative z-10">
                <div>
                  <h1 className="text-xl font-black text-slate-900">BMI UNIVERSITY</h1>
                  <p className="text-[10px] uppercase font-bold tracking-widest text-slate-600">OFFICIAL BURSAR FEE RECEIPT</p>
                </div>
                <div className="text-right font-mono text-[11px]">
                  <p className="font-bold text-indigo-900">{receiptInvoice.invoiceNumber}</p>
                  <p className="text-slate-500">{receiptInvoice.term}</p>
                </div>
              </div>

              {/* Metadata */}
              <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-white/90 border border-slate-200 shadow-sm relative z-10">
                <div>
                  <p><strong className="text-slate-700">Student Name:</strong> {student.firstName} {student.lastName}</p>
                  <p><strong className="text-slate-700">Student ID:</strong> {student.studentNumber}</p>
                  <p><strong className="text-slate-700">Academic Program:</strong> {student.program}</p>
                </div>
                <div>
                  <p><strong className="text-slate-700">Issue Date:</strong> {receiptInvoice.issueDate}</p>
                  <p><strong className="text-slate-700">Due Date:</strong> {receiptInvoice.dueDate}</p>
                  <p><strong className="text-slate-700">Payment Status:</strong> <span className="font-bold text-emerald-700">{receiptInvoice.status}</span></p>
                </div>
              </div>

              {/* Line Items Table */}
              <div className="relative z-10">
                <h3 className="font-bold text-slate-900 mb-2 border-b border-slate-300 pb-1">ITEMIZED BURSAR CHARGES</h3>
                <table className="w-full text-left text-xs border border-slate-300 bg-white/90">
                  <thead className="bg-slate-200 text-slate-800 font-bold uppercase text-[10px]">
                    <tr>
                      <th className="p-2 border">Description</th>
                      <th className="p-2 border text-right">Amount ($)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {receiptInvoice.items.map((it, idx) => (
                      <tr key={idx} className="border-b">
                        <td className="p-2 border">{it.description}</td>
                        <td className="p-2 border text-right font-mono font-bold">${it.amount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals Summary */}
              <div className="p-4 rounded-xl bg-slate-900 text-white flex items-center justify-between font-mono relative z-10">
                <div>
                  <p className="text-[10px] text-slate-400">Total Billed: ${receiptInvoice.totalAmount}</p>
                  <p className="text-[10px] text-emerald-400">Amount Paid: ${receiptInvoice.amountPaid}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block">Balance Outstanding</span>
                  <span className="text-lg font-bold text-emerald-300">${receiptInvoice.totalAmount - receiptInvoice.amountPaid}</span>
                </div>
              </div>

              {/* Holographic Security Seal */}
              <div className="relative z-10">
                <SecuritySealBadge
                  docType="Tuition Fee Invoice & Receipt"
                  docId={receiptInvoice.invoiceNumber}
                  securityHash={`FIN-HASH-${receiptInvoice.invoiceNumber}-${receiptInvoice.totalAmount}`}
                />
              </div>

              {/* Microtext Border */}
              <MicrotextBorder text="• BURSAR OFFICE OFFICIAL ATTESTATION • SECURE IMMUTABLE PAYMENT RECEIPT " />

            </div>

          </div>
        </div>
      )}

    </div>
  );
};
