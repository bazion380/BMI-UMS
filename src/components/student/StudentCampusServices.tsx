import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Building2, 
  Book, 
  Bus, 
  HeartPulse, 
  CheckCircle2, 
  Search, 
  Calendar,
  Sparkles
} from 'lucide-react';

export const StudentCampusServices: React.FC = () => {
  const { students, activeStudentId, libraryBooks, libraryLoans, checkoutLibraryBook, createInvoice } = useApp();
  const student = students.find(s => s.id === activeStudentId) || students[0];

  const [activeTab, setActiveTab] = useState<'hostel' | 'library' | 'transport' | 'health'>('hostel');
  const [bookSearch, setBookSearch] = useState('');
  const [requestSuccess, setRequestSuccess] = useState<string | null>(null);

  // Hostel Maintenance state
  const [showHostelModal, setShowHostelModal] = useState(false);
  const [hostelCategory, setHostelCategory] = useState('Plumbing & Water');
  const [hostelNotes, setHostelNotes] = useState('');
  const [maintenanceTickets, setMaintenanceTickets] = useState<Array<{ id: string; category: string; notes: string; date: string; status: string }>>([
    { id: 'MNT-101', category: 'Electrical', notes: 'Desk lamp outlet loose', date: '2026-07-20', status: 'In Progress' }
  ]);

  // Health appointment state
  const [showHealthModal, setShowHealthModal] = useState(false);
  const [healthType, setHealthType] = useState('Academic Stress & Anxiety');
  const [healthDate, setHealthDate] = useState('2026-08-05');
  const [healthTime, setHealthTime] = useState('02:00 PM');
  const [appointments, setAppointments] = useState<Array<{ id: string; type: string; date: string; time: string; doctor: string }>>([
    { id: 'APT-802', type: 'General Health Checkup', date: '2026-07-30', time: '10:00 AM', doctor: 'Dr. Sarah Jenkins' }
  ]);

  // Transport Pass state
  const [passActive, setPassActive] = useState(true);

  const myLoans = libraryLoans.filter(l => l.studentId === student.id);

  const showSuccess = (msg: string) => {
    setRequestSuccess(msg);
    setTimeout(() => setRequestSuccess(null), 4000);
  };

  const handleBookReserve = (bookId: string) => {
    const res = checkoutLibraryBook(bookId, student.id, 14);
    showSuccess(res.message);
  };

  const handleMaintenanceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hostelNotes) return;
    const newTkt = {
      id: `MNT-${Math.floor(100 + Math.random() * 900)}`,
      category: hostelCategory,
      notes: hostelNotes,
      date: new Date().toISOString().slice(0, 10),
      status: 'Submitted'
    };
    setMaintenanceTickets([newTkt, ...maintenanceTickets]);
    setShowHostelModal(false);
    setHostelNotes('');
    showSuccess(`Hostel maintenance request ${newTkt.id} logged for Housing Office.`);
  };

  const handleHealthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newApt = {
      id: `APT-${Math.floor(100 + Math.random() * 900)}`,
      type: healthType,
      date: healthDate,
      time: healthTime,
      doctor: 'Campus Health Center'
    };
    setAppointments([newApt, ...appointments]);
    setShowHealthModal(false);
    showSuccess(`Health & Wellness consultation booked for ${healthDate} at ${healthTime}.`);
  };

  const handleTransportRenew = () => {
    createInvoice({
      studentId: student.id,
      studentName: `${student.firstName} ${student.lastName}`,
      term: 'Fall 2026 Transit Pass',
      dueDate: '2026-08-20',
      totalAmount: 120,
      scholarshipDiscount: 0,
      items: [{ description: 'Semester Shuttle Pass - Route 4', amount: 120 }]
    });
    setPassActive(true);
    showSuccess('Shuttle Transit Pass fee invoice generated ($120). Check Fees tab to settle.');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Page Header */}
      <div>
        <h1 className="text-xl font-bold text-white flex items-center space-x-2">
          <Building2 className="w-6 h-6 text-indigo-400" />
          <span>Campus Life & Auxiliary Services</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Hostel room allocations, library book loans, campus transit passes, and student wellness support.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 text-xs font-semibold overflow-x-auto space-x-1">
        <button
          onClick={() => setActiveTab('hostel')}
          className={`px-4 py-2.5 rounded-t-xl transition flex items-center space-x-2 ${
            activeTab === 'hostel'
              ? 'bg-slate-900 border-t border-x border-slate-800 text-indigo-400 border-b-transparent'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Hostel Accommodation</span>
        </button>

        <button
          onClick={() => setActiveTab('library')}
          className={`px-4 py-2.5 rounded-t-xl transition flex items-center space-x-2 ${
            activeTab === 'library'
              ? 'bg-slate-900 border-t border-x border-slate-800 text-indigo-400 border-b-transparent'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Book className="w-4 h-4" />
          <span>Library Catalog & Loans</span>
        </button>

        <button
          onClick={() => setActiveTab('transport')}
          className={`px-4 py-2.5 rounded-t-xl transition flex items-center space-x-2 ${
            activeTab === 'transport'
              ? 'bg-slate-900 border-t border-x border-slate-800 text-indigo-400 border-b-transparent'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Bus className="w-4 h-4" />
          <span>Campus Transport</span>
        </button>

        <button
          onClick={() => setActiveTab('health')}
          className={`px-4 py-2.5 rounded-t-xl transition flex items-center space-x-2 ${
            activeTab === 'health'
              ? 'bg-slate-900 border-t border-x border-slate-800 text-indigo-400 border-b-transparent'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <HeartPulse className="w-4 h-4" />
          <span>Student Health & Counseling</span>
        </button>
      </div>

      {/* Alert Banner */}
      {requestSuccess && (
        <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/50 text-emerald-200 text-xs flex items-center space-x-2 shadow-md">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span className="font-semibold">{requestSuccess}</span>
        </div>
      )}

      {/* Tab 1: Hostel */}
      {activeTab === 'hostel' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-md text-xs">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="font-bold text-white text-base">Hostel Allocation & Residence Hall</h2>
              <p className="text-slate-400 text-xs">Current Residence Status for Fall 2026</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
              Assigned & Active
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between">
            <div>
              <span className="text-slate-400 font-semibold text-[10px] uppercase">Allocated Room</span>
              <p className="text-lg font-bold text-white mt-0.5">{student.hostelRoom || 'Hall B - Room 304'}</p>
              <p className="text-slate-400 mt-0.5">Double Occupancy Room • High-Speed Wi-Fi Included</p>
            </div>
            <button
              onClick={() => setShowHostelModal(true)}
              className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition"
            >
              Request Maintenance
            </button>
          </div>

          {/* Logged Maintenance Tickets */}
          <div className="space-y-3">
            <h3 className="font-bold text-slate-300 text-sm">Housing Maintenance Log</h3>
            {maintenanceTickets.map(tkt => (
              <div key={tkt.id} className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-indigo-400">{tkt.id}</span>
                    <span className="text-slate-200 font-semibold">{tkt.category}</span>
                  </div>
                  <p className="text-slate-400 text-[11px] mt-0.5">{tkt.notes} • Submitted {tkt.date}</p>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold text-[10px]">
                  {tkt.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Library */}
      {activeTab === 'library' && (
        <div className="space-y-6">
          
          {/* Active Loans Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md text-xs">
            <h2 className="font-bold text-white text-base mb-3">My Borrowed Books</h2>
            <div className="space-y-2">
              {myLoans.length === 0 ? (
                <p className="text-slate-400 italic">No books currently borrowed.</p>
              ) : (
                myLoans.map(loan => {
                  const book = libraryBooks.find(b => b.id === loan.bookId);
                  return (
                    <div key={loan.id} className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between">
                      <div>
                        <p className="font-bold text-white">{book?.title || 'Library Item'}</p>
                        <p className="text-slate-400 text-[11px] mt-0.5">
                          Borrowed: {loan.borrowDate} • Due: <span className="text-indigo-300 font-semibold">{loan.dueDate}</span>
                        </p>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                        {loan.status}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Catalog Search */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md text-xs space-y-4">
            <h2 className="font-bold text-white text-base">Campus Library Catalog</h2>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={bookSearch}
                onChange={(e) => setBookSearch(e.target.value)}
                placeholder="Search books by title, author, or ISBN..."
                className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-4 py-2.5 text-white placeholder-slate-500 focus:outline-none"
              />
            </div>

            <div className="space-y-2">
              {libraryBooks
                .filter(b => b.title.toLowerCase().includes(bookSearch.toLowerCase()) || b.author.toLowerCase().includes(bookSearch.toLowerCase()))
                .map(bk => (
                  <div key={bk.id} className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-800 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-white">{bk.title}</p>
                      <p className="text-slate-400 text-[11px]">Author: {bk.author} • {bk.locationShelf}</p>
                    </div>
                    <button
                      onClick={() => handleBookReserve(bk.id)}
                      disabled={bk.availableCopies <= 0}
                      className={`px-3 py-1.5 rounded-lg font-medium transition ${
                        bk.availableCopies > 0
                          ? 'bg-indigo-600 hover:bg-indigo-500 text-white'
                          : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      }`}
                    >
                      {bk.availableCopies > 0 ? `Reserve Copy (${bk.availableCopies} left)` : 'Out of Stock'}
                    </button>
                  </div>
                ))}
            </div>
          </div>

        </div>
      )}

      {/* Tab 3: Transport */}
      {activeTab === 'transport' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-md text-xs">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="font-bold text-white text-base">University Shuttle & Bus Pass</h2>
              <p className="text-slate-400">Route 4 Express Pass (North Campus - Main Library - South Housing)</p>
            </div>
            <span className={`px-3 py-1 rounded-full font-bold border ${passActive ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border-rose-500/30'}`}>
              {passActive ? 'Pass Active' : 'Pass Expired'}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-500/30 flex items-center justify-between">
            <div>
              <span className="text-indigo-300 font-bold text-sm">Digital QR Boarding Pass Available</span>
              <p className="text-slate-400 mt-0.5">Scan upon boarding university shuttles.</p>
            </div>
            <button
              onClick={handleTransportRenew}
              className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl transition"
            >
              Renew Pass ($120)
            </button>
          </div>
        </div>
      )}

      {/* Tab 4: Health */}
      {activeTab === 'health' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-md text-xs">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="font-bold text-white text-base">Student Health & Confidential Counseling</h2>
              <p className="text-slate-400">Free medical consultations and academic stress counseling sessions for enrolled students.</p>
            </div>
            <button
              onClick={() => setShowHealthModal(true)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition"
            >
              Schedule Appointment
            </button>
          </div>

          <div className="space-y-3">
            <h3 className="font-bold text-white text-sm">My Upcoming Health Appointments</h3>
            {appointments.map(apt => (
              <div key={apt.id} className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold text-emerald-400">{apt.id}</span>
                    <span className="font-bold text-white text-sm">{apt.type}</span>
                  </div>
                  <p className="text-slate-400 text-xs mt-1">
                    Date: <strong className="text-slate-200">{apt.date} at {apt.time}</strong> • Attending: {apt.doctor}
                  </p>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                  Confirmed
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Hostel Modal */}
      {showHostelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 text-slate-100 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="font-bold text-white text-base">Hostel Maintenance Request</h2>
              <button onClick={() => setShowHostelModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleMaintenanceSubmit} className="space-y-3">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Issue Category</label>
                <select
                  value={hostelCategory}
                  onChange={(e) => setHostelCategory(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                >
                  <option value="Plumbing & Water">Plumbing & Water Leak</option>
                  <option value="Electrical">Electrical / Lighting</option>
                  <option value="Furniture & Locks">Furniture or Door Lock Repairs</option>
                  <option value="Air Conditioning & Wi-Fi">AC Unit or Wi-Fi Signal Issue</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Description of Repair Needed</label>
                <textarea
                  value={hostelNotes}
                  onChange={(e) => setHostelNotes(e.target.value)}
                  rows={3}
                  placeholder="Describe the issue in your room..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition"
              >
                Submit Maintenance Request
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Health Modal */}
      {showHealthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 text-slate-100 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="font-bold text-white text-base">Schedule Health & Counseling Session</h2>
              <button onClick={() => setShowHealthModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleHealthSubmit} className="space-y-3">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Consultation Type</label>
                <select
                  value={healthType}
                  onChange={(e) => setHealthType(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                >
                  <option value="Academic Stress & Anxiety">Academic Stress & Anxiety Counseling</option>
                  <option value="General Health Checkup">General Health & Medical Checkup</option>
                  <option value="Nutrition & Wellness">Nutrition & Wellness Advising</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Appointment Date</label>
                  <input
                    type="date"
                    value={healthDate}
                    onChange={(e) => setHealthDate(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Preferred Time</label>
                  <input
                    type="text"
                    value={healthTime}
                    onChange={(e) => setHealthTime(e.target.value)}
                    placeholder="e.g. 02:00 PM"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition"
              >
                Confirm Appointment
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
