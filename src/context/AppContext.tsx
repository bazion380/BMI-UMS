import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Student, 
  Application, 
  Course, 
  StudentCourseEnrollment, 
  FeeInvoice, 
  StaffRecord, 
  AuditLog, 
  LibraryBook, 
  LibraryLoan, 
  AdvisingNote, 
  AlumniRecord,
  UserRole,
  AcademicCareer
} from '../types';
import { 
  INITIAL_STUDENTS, 
  INITIAL_APPLICATIONS, 
  INITIAL_COURSES, 
  INITIAL_ENROLLMENTS, 
  INITIAL_INVOICES, 
  INITIAL_STAFF, 
  INITIAL_AUDIT_LOGS, 
  INITIAL_BOOKS, 
  INITIAL_LOANS, 
  INITIAL_ADVISING_NOTES, 
  INITIAL_ALUMNI 
} from '../data/mockData';
import {
  generateStudentUid,
  extractProgramCode,
  extractCareer,
  generateRegistrationNumber
} from '../utils/studentIdGenerator';

interface AppContextType {
  // Navigation & Role State
  currentPortal: 'student' | 'staff';
  setCurrentPortal: (portal: 'student' | 'staff') => void;
  activeRole: UserRole;
  setActiveRole: (role: UserRole) => void;
  activeStudentId: string;
  setActiveStudentId: (id: string) => void;
  
  // Data State
  students: Student[];
  applications: Application[];
  courses: Course[];
  enrollments: StudentCourseEnrollment[];
  invoices: FeeInvoice[];
  staffList: StaffRecord[];
  auditLogs: AuditLog[];
  libraryBooks: LibraryBook[];
  libraryLoans: LibraryLoan[];
  advisingNotes: AdvisingNote[];
  alumniList: AlumniRecord[];
  
  // Executive Governance & System Settings
  executiveApprovals: { id: number; title: string; dept: string; priority: 'High' | 'Medium' | 'Low'; signed: boolean; signedDate?: string; signerName?: string }[];
  systemFlags: { mfaRequired: boolean; maintenanceMode: boolean; autoClearHolds: boolean; openEnrollment: boolean };

  // Actions
  logAudit: (action: string, details: string, severity?: 'Info' | 'Warning' | 'Security') => void;
  enrollStudentInCourse: (studentId: string, courseId: string) => { success: boolean; message: string };
  dropStudentFromCourse: (studentId: string, courseId: string) => void;
  processInvoicePayment: (invoiceId: string, amountPaid: number, paymentMethod: 'Credit Card' | 'Bank Transfer' | 'Mobile Payment' | 'Scholarship Voucher') => void;
  convertApplicationToStudent: (applicationId: string) => Student;
  runAutomatedApplicationPipeline: (applicationId: string) => { student: Student; invoice: FeeInvoice; autoEnrolledCoursesCount: number };
  updateStudentGrade: (studentId: string, courseId: string, grade: string, numericScore: number) => void;
  toggleStudentHold: (studentId: string, holdType: 'financial' | 'academic', value: boolean) => void;
  recordAttendance: (studentId: string, courseId: string, status: 'Present' | 'Absent' | 'Late') => void;
  addApplication: (appData: Omit<Application, 'id' | 'applicationNumber' | 'appliedDate' | 'status' | 'documents'>) => void;
  updateApplicationStatus: (appId: string, status: Application['status'], notes?: string) => void;
  updateApplicationDocumentStatus: (appId: string, docIndex: number, status: 'Pending' | 'Verified' | 'Rejected') => void;
  addCourse: (courseData: Omit<Course, 'id' | 'enrolledCount'>) => void;
  updateCourse: (courseId: string, data: Partial<Course>) => void;
  deleteCourse: (courseId: string) => void;
  createInvoice: (invoiceData: Omit<FeeInvoice, 'id' | 'invoiceNumber' | 'issueDate' | 'amountPaid' | 'status'>) => void;
  applyScholarshipToInvoice: (invoiceId: string, scholarshipAmount: number) => void;
  addStaffRecord: (staffData: Omit<StaffRecord, 'id' | 'staffNumber' | 'joinedDate'>) => void;
  updateStaffRecord: (staffId: string, data: Partial<StaffRecord>) => void;
  addLibraryBook: (bookData: Omit<LibraryBook, 'id' | 'availableCopies'>) => void;
  checkoutLibraryBook: (bookId: string, studentId: string, daysToBorrow?: number) => { success: boolean; message: string };
  returnLibraryBook: (loanId: string) => void;
  addAdvisingNote: (note: Omit<AdvisingNote, 'id' | 'date'>) => void;
  resolveAdvisingNote: (noteId: string) => void;
  recordAlumniDonation: (alumniId: string, amount: number) => void;
  updateAlumniRecord: (alumniId: string, data: Partial<AlumniRecord>) => void;
  updateStudentProfile: (studentId: string, data: Partial<Student>) => void;
  graduateStudent: (studentId: string) => AlumniRecord | null;
  approveExecutiveSignoff: (id: number) => void;
  addExecutiveProposal: (title: string, dept: string, priority: 'High' | 'Medium' | 'Low') => void;
  toggleSystemFlag: (flagName: 'mfaRequired' | 'maintenanceMode' | 'autoClearHolds' | 'openEnrollment') => void;
  resetDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY_PREFIX = 'bmi_ums_v4_';

const sanitizeStudentRecord = (s: Student): Student => {
  let regNo = s.registrationNumber || s.studentNumber;
  let uid = s.studentUid;

  if (s.id === 'std-101') {
    uid = uid || 'BMI00002T';
    regNo = 'BMI/UG-CS/224/001';
  } else if (s.id === 'std-102') {
    uid = uid || 'BMI00002U';
    regNo = 'BMI/UG-DS/224/001';
  } else if (s.id === 'std-103') {
    uid = uid || 'BMI00002V';
    regNo = 'BMI/UG-BBA/223/001';
  } else if (s.id === 'std-104') {
    uid = uid || 'BMI00002W';
    regNo = 'BMI/UG-ENG/223/001';
  } else if (!regNo || regNo.startsWith('BMI-202')) {
    regNo = `BMI/UG-CS/226/${(s.id || '').replace('std-', '').padStart(3, '0')}`;
  }

  return {
    ...s,
    studentUid: uid || 'BMI00002T',
    registrationNumber: regNo,
    studentNumber: regNo
  };
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Active Portal & Role
  const [currentPortal, setCurrentPortalState] = useState<'student' | 'staff'>('student');
  const [activeRole, setActiveRoleState] = useState<UserRole>('student');
  const [activeStudentId, setActiveStudentId] = useState<string>('std-101');

  // Load or Initialize State
  const [students, setStudents] = useState<Student[]>(() => {
    // Clear legacy v1/v2 storage keys if present
    try {
      localStorage.removeItem('bmi_ums_v1_students');
      localStorage.removeItem('bmi_ums_v2_students');
      localStorage.removeItem('bmi_ums_v3_students');
    } catch (_) {}

    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'students');
    const rawList: Student[] = saved ? JSON.parse(saved) : INITIAL_STUDENTS;
    return rawList.map(sanitizeStudentRecord);
  });

  const [applications, setApplications] = useState<Application[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'applications');
    return saved ? JSON.parse(saved) : INITIAL_APPLICATIONS;
  });

  const [courses, setCourses] = useState<Course[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'courses');
    return saved ? JSON.parse(saved) : INITIAL_COURSES;
  });

  const [enrollments, setEnrollments] = useState<StudentCourseEnrollment[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'enrollments');
    return saved ? JSON.parse(saved) : INITIAL_ENROLLMENTS;
  });

  const [invoices, setInvoices] = useState<FeeInvoice[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'invoices');
    return saved ? JSON.parse(saved) : INITIAL_INVOICES;
  });

  const [staffList, setStaffList] = useState<StaffRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'staff');
    return saved ? JSON.parse(saved) : INITIAL_STAFF;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'audit');
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  const [libraryBooks, setLibraryBooks] = useState<LibraryBook[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'books');
    return saved ? JSON.parse(saved) : INITIAL_BOOKS;
  });

  const [libraryLoans, setLibraryLoans] = useState<LibraryLoan[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'loans');
    return saved ? JSON.parse(saved) : INITIAL_LOANS;
  });

  const [advisingNotes, setAdvisingNotes] = useState<AdvisingNote[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'advising');
    return saved ? JSON.parse(saved) : INITIAL_ADVISING_NOTES;
  });

  const [alumniList, setAlumniList] = useState<AlumniRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'alumni');
    return saved ? JSON.parse(saved) : INITIAL_ALUMNI;
  });

  const [executiveApprovals, setExecutiveApprovals] = useState<{ id: number; title: string; dept: string; priority: 'High' | 'Medium' | 'Low'; signed: boolean; signedDate?: string; signerName?: string }[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'executive');
    return saved ? JSON.parse(saved) : [
      { id: 1, title: 'AI & Quantum Computing Research Center $1.5M Capital Grant', dept: 'School of Computing & Engineering', priority: 'High', signed: false },
      { id: 2, title: 'Fall 2026 Academic Calendar & Graduation Ceremonies Charter', dept: 'Office of the Registrar', priority: 'Medium', signed: false },
      { id: 3, title: 'Tenure & Faculty Promotion Ratification (5 Candidates)', dept: 'Office of Academic Affairs', priority: 'High', signed: true, signedDate: '2026-07-20', signerName: 'Prof. Arthur Vance (President)' }
    ];
  });

  const [systemFlags, setSystemFlags] = useState<{ mfaRequired: boolean; maintenanceMode: boolean; autoClearHolds: boolean; openEnrollment: boolean }>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'sysflags');
    return saved ? JSON.parse(saved) : {
      mfaRequired: true,
      maintenanceMode: false,
      autoClearHolds: true,
      openEnrollment: true
    };
  });

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'students', JSON.stringify(students));
  }, [students]);

  // Initial backend API synchronization
  useEffect(() => {
    async function syncWithServerAPI() {
      try {
        const [stdRes, appRes, logRes] = await Promise.all([
          fetch('/api/students').then(r => r.ok ? r.json() : null),
          fetch('/api/applications').then(r => r.ok ? r.json() : null),
          fetch('/api/audit-logs').then(r => r.ok ? r.json() : null),
        ]);

        if (stdRes && Array.isArray(stdRes) && stdRes.length > 0) {
          setStudents(stdRes.map(sanitizeStudentRecord));
        }
        if (appRes && Array.isArray(appRes) && appRes.length > 0) {
          setApplications(appRes);
        }
        if (logRes && Array.isArray(logRes) && logRes.length > 0) {
          setAuditLogs(logRes);
        }
      } catch (err) {
        console.warn('Backend API server not reached, using persistent cached state:', err);
      }
    }
    syncWithServerAPI();
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'applications', JSON.stringify(applications));
  }, [applications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'courses', JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'enrollments', JSON.stringify(enrollments));
  }, [enrollments]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'invoices', JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'staff', JSON.stringify(staffList));
  }, [staffList]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'books', JSON.stringify(libraryBooks));
  }, [libraryBooks]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'loans', JSON.stringify(libraryLoans));
  }, [libraryLoans]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'executive', JSON.stringify(executiveApprovals));
  }, [executiveApprovals]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'sysflags', JSON.stringify(systemFlags));
  }, [systemFlags]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'audit', JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'books', JSON.stringify(libraryBooks));
  }, [libraryBooks]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'loans', JSON.stringify(libraryLoans));
  }, [libraryLoans]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'advising', JSON.stringify(advisingNotes));
  }, [advisingNotes]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'alumni', JSON.stringify(alumniList));
  }, [alumniList]);

  const setCurrentPortal = (portal: 'student' | 'staff') => {
    setCurrentPortalState(portal);
    if (portal === 'student') {
      setActiveRoleState('student');
    } else if (activeRole === 'student') {
      setActiveRoleState('president'); // default staff view
    }
  };

  const setActiveRole = (role: UserRole) => {
    setActiveRoleState(role);
    if (role === 'student') {
      setCurrentPortalState('student');
    } else {
      setCurrentPortalState('staff');
    }
  };

  // Helper: Audit Logging
  const logAudit = (action: string, details: string, severity: 'Info' | 'Warning' | 'Security' = 'Info') => {
    const newLog: AuditLog = {
      id: 'log-' + Date.now(),
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      performedBy: activeRole === 'student' ? `Student (${students.find(s => s.id === activeStudentId)?.firstName || 'User'})` : `Staff (${activeRole.toUpperCase()})`,
      role: activeRole,
      action,
      details,
      ipAddress: '192.168.1.102',
      severity
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // 1. Course Enrollment Validator & Handler
  const enrollStudentInCourse = (studentId: string, courseId: string) => {
    const student = students.find(s => s.id === studentId);
    const course = courses.find(c => c.id === courseId);

    if (!student || !course) {
      return { success: false, message: 'Student or course not found.' };
    }

    // Check financial hold
    if (student.financialHold) {
      logAudit('Course Enrollment Blocked', `Attempted enrollment in ${course.code} blocked due to active Financial Hold on ${student.firstName} ${student.lastName}.`, 'Security');
      return { 
        success: false, 
        message: 'Enrollment Blocked: Active Financial Hold detected. Please clear overdue fee invoices in the Fees section first.' 
      };
    }

    // Check academic hold
    if (student.academicHold) {
      return { 
        success: false, 
        message: 'Enrollment Blocked: Academic Probation hold. Requires Registrar or Advisor override.' 
      };
    }

    // Check capacity
    if (course.enrolledCount >= course.capacity) {
      return { success: false, message: `Course ${course.code} is at maximum capacity (${course.capacity} seats).` };
    }

    // Check existing enrollment
    const existing = enrollments.find(e => e.studentId === studentId && e.courseId === courseId && e.status === 'Enrolled');
    if (existing) {
      return { success: false, message: `Already enrolled in ${course.code}.` };
    }

    // Check prerequisites
    const studentEnrolledCourseIds = enrollments
      .filter(e => e.studentId === studentId && (e.status === 'Enrolled' || e.status === 'Completed'))
      .map(e => {
        const c = courses.find(crs => crs.id === e.courseId);
        return c ? c.code : '';
      });

    const unfulfilledPrereqs = course.prerequisites.filter(prereq => !studentEnrolledCourseIds.includes(prereq));
    if (unfulfilledPrereqs.length > 0) {
      return {
        success: false,
        message: `Prerequisite missing: ${unfulfilledPrereqs.join(', ')} required before enrolling in ${course.code}.`
      };
    }

    // Success: Add Enrollment & Update Count
    const newEnrollment: StudentCourseEnrollment = {
      studentId,
      courseId,
      semester: 'Fall 2026',
      status: 'Enrolled',
      attendancePercentage: 100
    };

    setEnrollments(prev => [...prev, newEnrollment]);
    setCourses(prev => prev.map(c => c.id === courseId ? { ...c, enrolledCount: c.enrolledCount + 1 } : c));

    logAudit('Course Enrollment', `Student ${student.studentNumber} enrolled in ${course.code} (${course.title}).`);
    return { success: true, message: `Successfully enrolled in ${course.code} - ${course.title}!` };
  };

  const dropStudentFromCourse = (studentId: string, courseId: string) => {
    const course = courses.find(c => c.id === courseId);
    setEnrollments(prev => prev.filter(e => !(e.studentId === studentId && e.courseId === courseId)));
    setCourses(prev => prev.map(c => c.id === courseId ? { ...c, enrolledCount: Math.max(0, c.enrolledCount - 1) } : c));
    logAudit('Course Dropped', `Student ${studentId} dropped course ${course?.code || courseId}.`);
  };

  // 2. Invoice Payment Handler + Instant Hold Auto-Unblock!
  const processInvoicePayment = (
    invoiceId: string, 
    amountPaid: number, 
    paymentMethod: 'Credit Card' | 'Bank Transfer' | 'Mobile Payment' | 'Scholarship Voucher'
  ) => {
    let updatedStudentId = '';
    
    setInvoices(prev => prev.map(inv => {
      if (inv.id === invoiceId) {
        updatedStudentId = inv.studentId;
        const newPaid = inv.amountPaid + amountPaid;
        const newStatus = newPaid >= inv.totalAmount ? 'Paid' : 'Partial';
        return {
          ...inv,
          amountPaid: newPaid,
          status: newStatus
        };
      }
      return inv;
    }));

    // Auto-check if all invoices for student are now paid -> Clear Financial Hold automatically!
    if (updatedStudentId) {
      setTimeout(() => {
        setInvoices(latestInvoices => {
          const studentInvoices = latestInvoices.filter(i => i.studentId === updatedStudentId);
          const hasUnpaid = studentInvoices.some(i => i.status === 'Unpaid' || i.status === 'Overdue' || i.amountPaid < i.totalAmount);
          
          if (!hasUnpaid) {
            setStudents(prevStudents => prevStudents.map(s => {
              if (s.id === updatedStudentId && s.financialHold) {
                logAudit(
                  'Financial Hold Auto-Cleared', 
                  `Financial Hold automatically cleared for ${s.firstName} ${s.lastName} (${s.studentNumber}) following full fee invoice payment.`,
                  'Info'
                );
                return { ...s, financialHold: false };
              }
              return s;
            }));
          }
          return latestInvoices;
        });
      }, 100);
    }

    logAudit('Fee Payment Received', `Payment of $${amountPaid} processed via ${paymentMethod} for Invoice #${invoiceId}.`);
  };

  // 3. Admissions CRM: 1-Click Enrollment pipeline (Applicant -> Canonical Student Record)
  const convertApplicationToStudent = (applicationId: string): Student => {
    const app = applications.find(a => a.id === applicationId);
    if (!app) throw new Error('Application not found');

    const internalSeq = 55600 + students.length + 1;
    const studentUid = app.assignedUid || generateStudentUid(internalSeq);
    
    const career: AcademicCareer = app.career || extractCareer(app.programApplied);
    const programCode = extractProgramCode(app.programApplied);
    
    const sameProgramCount = students.filter(s => s.program === app.programApplied).length;
    const regNo = app.assignedRegNo || generateRegistrationNumber({
      career,
      programCode,
      year: 2026,
      serial: sameProgramCount + 1
    });

    const nameParts = app.applicantName.split(' ');

    const newStudent: Student = {
      id: 'std-' + Date.now(),
      internalSeq,
      studentUid,
      registrationNumber: regNo,
      studentNumber: regNo,
      career,
      firstName: nameParts[0] || 'Applicant',
      lastName: nameParts.slice(1).join(' ') || 'User',
      email: `${nameParts[0].toLowerCase()}.${(nameParts[1] || 'student').toLowerCase()}@student.bmi.edu`,
      phone: app.phone,
      dateOfBirth: '2005-08-12',
      nationalId: `NAT-${Math.floor(1000000 + Math.random() * 9000000)}`,
      gender: 'Unspecified',
      nationality: 'International',
      program: app.programApplied,
      department: app.department,
      cohortYear: 2026,
      currentSemester: 1,
      academicStatus: 'Active',
      financialHold: false,
      academicHold: false,
      gpa: 0.0,
      cgpa: 0.0,
      creditsEarned: 0,
      creditsRequired: 120,
      advisorName: 'Dr. Marcus Vance',
      advisorEmail: 'marcus.vance@bmi.edu',
      avatarUrl: `https://images.unsplash.com/photo-${1535713875002 + students.length}?auto=format&fit=crop&q=80&w=250`,
      guardianName: 'Guardian of ' + app.applicantName,
      guardianRelation: 'Parent',
      guardianPhone: app.phone,
      guardianEmail: app.email
    };

    // Update Application Status
    setApplications(prev => prev.map(a => a.id === applicationId ? { 
      ...a, 
      status: 'Enrolled',
      assignedUid: studentUid,
      assignedRegNo: regNo 
    } : a));

    // Add to SIS Database
    setStudents(prev => [newStudent, ...prev]);

    // Create Initial Fall 2026 Tuition Invoice
    const newInvoice: FeeInvoice = {
      id: 'inv-' + Date.now(),
      invoiceNumber: `INV-2026-${2000 + students.length}`,
      studentId: newStudent.id,
      term: 'Fall 2026',
      issueDate: new Date().toISOString().slice(0, 10),
      dueDate: '2026-09-01',
      items: [
        { description: 'Freshman Tuition Deposit & Orientation Fee', amount: 3500 },
        { description: 'Technology & Lab Infrastructure Pass', amount: 300 }
      ],
      totalAmount: 3800,
      amountPaid: 0,
      status: 'Unpaid',
      scholarshipDiscount: 500
    };
    setInvoices(prev => [newInvoice, ...prev]);

    logAudit(
      'SIS Student Creation', 
      `Application #${app.applicationNumber} converted! Assigned Lifetime Student UID: ${newStudent.studentUid} | Registration Number: ${newStudent.registrationNumber}`
    );

    return newStudent;
  };

  // 3b. 100% Automated End-to-End Registration Pipeline Execution
  const runAutomatedApplicationPipeline = (applicationId: string) => {
    const app = applications.find(a => a.id === applicationId);
    if (!app) throw new Error('Application not found');

    // 1. Verify Documents & Calculate Eligibility Score
    const updatedDocs = app.documents.map(d => ({ ...d, status: 'Verified' as const }));
    const eligibilityScore = app.highSchoolGPA ? Math.min(100, Math.round(app.highSchoolGPA * 25)) : 92;

    // 2. Generate Permanent Lifetime UID & Primary Reg Number
    const internalSeq = 55600 + students.length + 1;
    const studentUid = generateStudentUid(internalSeq);
    const career = app.career || extractCareer(app.programApplied);
    const programCode = extractProgramCode(app.programApplied);
    const sameProgramCount = students.filter(s => s.program === app.programApplied).length;
    const regNo = generateRegistrationNumber({
      career,
      programCode,
      year: 2026,
      serial: sameProgramCount + 1
    });

    // 3. Create Canonical Student Record
    const nameParts = app.applicantName.split(' ');
    const newStudent: Student = {
      id: 'std-' + Date.now(),
      internalSeq,
      studentUid,
      registrationNumber: regNo,
      studentNumber: regNo,
      career,
      firstName: nameParts[0] || 'Applicant',
      lastName: nameParts.slice(1).join(' ') || 'User',
      email: `${nameParts[0].toLowerCase()}.${(nameParts[1] || 'student').toLowerCase()}@student.bmi.edu`,
      phone: app.phone,
      dateOfBirth: '2005-08-12',
      nationalId: `NAT-${Math.floor(1000000 + Math.random() * 9000000)}`,
      gender: 'Unspecified',
      nationality: 'International',
      program: app.programApplied,
      department: app.department,
      cohortYear: 2026,
      currentSemester: 1,
      academicStatus: 'Active',
      financialHold: false,
      academicHold: false,
      gpa: 0.0,
      cgpa: 0.0,
      creditsEarned: 0,
      creditsRequired: 120,
      advisorName: 'Dr. Marcus Vance',
      advisorEmail: 'marcus.vance@bmi.edu',
      avatarUrl: `https://images.unsplash.com/photo-${1535713875002 + students.length}?auto=format&fit=crop&q=80&w=250`,
      guardianName: 'Guardian of ' + app.applicantName,
      guardianRelation: 'Parent',
      guardianPhone: app.phone,
      guardianEmail: app.email
    };

    // 4. Update Application Record
    setApplications(prev => prev.map(a => a.id === applicationId ? {
      ...a,
      status: 'Enrolled',
      documents: updatedDocs,
      assignedUid: studentUid,
      assignedRegNo: regNo,
      automatedCheckPassed: true,
      eligibilityScore,
      autoAdmittedAt: new Date().toISOString()
    } : a));

    setStudents(prev => [newStudent, ...prev]);

    // 5. Auto-Generate & Settle Fee Invoice
    const newInvoice: FeeInvoice = {
      id: 'inv-' + Date.now(),
      invoiceNumber: `INV-2026-${2500 + students.length}`,
      studentId: newStudent.id,
      term: 'Fall 2026',
      issueDate: new Date().toISOString().slice(0, 10),
      dueDate: '2026-09-01',
      items: [
        { description: 'Freshman Registration & Orientation Fee', amount: 3500 },
        { description: 'Digital Portal Infrastructure & Cloud Pass', amount: 300 }
      ],
      totalAmount: 3800,
      amountPaid: 3800,
      status: 'Paid',
      scholarshipDiscount: 0
    };
    setInvoices(prev => [newInvoice, ...prev]);

    // 6. Auto-Enroll into Core Program Courses
    const departmentCourses = courses.filter(c => c.department === newStudent.department || c.department.includes('Computing'));
    const coursesToEnroll = departmentCourses.slice(0, 2);
    coursesToEnroll.forEach(c => {
      setEnrollments(prev => [...prev, {
        studentId: newStudent.id,
        courseId: c.id,
        semester: 'Fall 2026',
        status: 'Enrolled',
        attendancePercentage: 100
      }]);
    });

    logAudit(
      'Automated Pipeline Executed',
      `⚡ 100% Automated Registration Pipeline Completed for #${app.applicationNumber} (${app.applicantName}). Auto-Verified -> Lifetime UID: ${studentUid} -> Reg No: ${regNo} -> Fees Settled ($3,800) -> Auto-Enrolled in ${coursesToEnroll.length} core courses.`,
      'Info'
    );

    return { student: newStudent, invoice: newInvoice, autoEnrolledCoursesCount: coursesToEnroll.length };
  };

  // 4. Update Student Grade (Lecturer Gradebook)
  const updateStudentGrade = (studentId: string, courseId: string, grade: string, numericScore: number) => {
    setEnrollments(prev => prev.map(e => {
      if (e.studentId === studentId && e.courseId === courseId) {
        return { ...e, grade, numericScore };
      }
      return e;
    }));

    // Recalculate Student GPA dynamically!
    setStudents(prev => prev.map(s => {
      if (s.id === studentId) {
        // Simple grade point converter
        const gradePoints: Record<string, number> = {
          'A': 4.0, 'A-': 3.7, 'B+': 3.3, 'B': 3.0, 'B-': 2.7,
          'C+': 2.3, 'C': 2.0, 'D': 1.0, 'F': 0.0
        };
        const point = gradePoints[grade] ?? 3.0;
        const newGpa = Number(((s.gpa * 3 + point) / 4).toFixed(2));
        return { ...s, gpa: newGpa, cgpa: newGpa };
      }
      return s;
    }));

    const course = courses.find(c => c.id === courseId);
    logAudit('Grade Assigned', `Assigned grade ${grade} (${numericScore}/100) to student ${studentId} for ${course?.code || courseId}.`);
  };

  // 5. Toggle Holds (Finance / Registrar)
  const toggleStudentHold = (studentId: string, holdType: 'financial' | 'academic', value: boolean) => {
    setStudents(prev => prev.map(s => {
      if (s.id === studentId) {
        return {
          ...s,
          financialHold: holdType === 'financial' ? value : s.financialHold,
          academicHold: holdType === 'academic' ? value : s.academicHold
        };
      }
      return s;
    }));
    logAudit('Hold Modified', `${holdType.toUpperCase()} Hold set to ${value ? 'ACTIVE' : 'CLEARED'} for student ${studentId}.`, 'Warning');
  };

  // 6. Record Attendance
  const recordAttendance = (studentId: string, courseId: string, status: 'Present' | 'Absent' | 'Late') => {
    setEnrollments(prev => prev.map(e => {
      if (e.studentId === studentId && e.courseId === courseId) {
        const adjustment = status === 'Present' ? 1 : status === 'Late' ? -1 : -3;
        const newPct = Math.min(100, Math.max(50, e.attendancePercentage + adjustment));
        return { ...e, attendancePercentage: newPct };
      }
      return e;
    }));
  };

  // 7. Add Application
  const addApplication = (appData: Omit<Application, 'id' | 'applicationNumber' | 'appliedDate' | 'status' | 'documents'>) => {
    const newApp: Application = {
      ...appData,
      id: 'app-' + Date.now(),
      applicationNumber: `ADM-2026-${Math.floor(910 + Math.random() * 80)}`,
      appliedDate: new Date().toISOString().slice(0, 10),
      status: 'Submitted',
      documents: [
        { name: 'High_School_Transcript.pdf', status: 'Pending' },
        { name: 'Identity_Document.pdf', status: 'Pending' }
      ]
    };
    setApplications(prev => [newApp, ...prev]);
    logAudit('Admissions CRM', `New application #${newApp.applicationNumber} received from ${newApp.applicantName} for ${newApp.programApplied}.`);
  };

  // 8. Add Course
  const addCourse = (courseData: Omit<Course, 'id' | 'enrolledCount'>) => {
    const newCourse: Course = {
      ...courseData,
      id: 'crs-' + Date.now(),
      enrolledCount: 0
    };
    setCourses(prev => [...prev, newCourse]);
    logAudit('Course Curriculum Creation', `Created new course ${newCourse.code} (${newCourse.title}) in ${newCourse.department}.`);
  };

  // 9. Add Advising Note
  const addAdvisingNote = (note: Omit<AdvisingNote, 'id' | 'date'>) => {
    const newNote: AdvisingNote = {
      ...note,
      id: 'adv-' + Date.now(),
      date: new Date().toISOString().slice(0, 10)
    };
    setAdvisingNotes(prev => [newNote, ...prev]);
    logAudit('Advising Log', `Advisor logged note for student ID ${note.studentId} regarding "${note.topic}".`);
  };

  // 11. Admissions Pipeline Management
  const updateApplicationStatus = (appId: string, status: Application['status'], notes?: string) => {
    setApplications(prev => prev.map(app => app.id === appId ? { ...app, status, reviewerNotes: notes ?? app.reviewerNotes } : app));
    logAudit('Admissions Pipeline', `Application ID ${appId} status set to "${status}".`, 'Info');
  };

  const updateApplicationDocumentStatus = (appId: string, docIndex: number, status: 'Pending' | 'Verified' | 'Rejected') => {
    setApplications(prev => prev.map(app => {
      if (app.id !== appId) return app;
      const updatedDocs = [...app.documents];
      if (updatedDocs[docIndex]) {
        updatedDocs[docIndex] = { ...updatedDocs[docIndex], status };
      }
      return { ...app, documents: updatedDocs };
    }));
    logAudit('Admissions Verification', `Document verification status updated to "${status}" for application ${appId}.`, 'Info');
  };

  // 12. Course Editing & Deletion
  const updateCourse = (courseId: string, data: Partial<Course>) => {
    setCourses(prev => prev.map(c => c.id === courseId ? { ...c, ...data } : c));
    logAudit('Registrar Curriculum', `Updated course details for ${courseId}.`, 'Info');
  };

  const deleteCourse = (courseId: string) => {
    setCourses(prev => prev.filter(c => c.id !== courseId));
    logAudit('Registrar Curriculum', `Deleted course ID ${courseId}.`, 'Warning');
  };

  // 13. Bursar Fee Invoicing & Scholarship Waivers
  const createInvoice = (invoiceData: Omit<FeeInvoice, 'id' | 'invoiceNumber' | 'issueDate' | 'amountPaid' | 'status'>) => {
    const newInv: FeeInvoice = {
      ...invoiceData,
      id: 'inv-' + Date.now(),
      invoiceNumber: `INV-2026-${Math.floor(1010 + Math.random() * 800)}`,
      issueDate: new Date().toISOString().slice(0, 10),
      amountPaid: 0,
      status: 'Unpaid'
    };
    setInvoices(prev => [newInv, ...prev]);
    logAudit('Finance Bursar', `Generated fee invoice ${newInv.invoiceNumber} for $${newInv.totalAmount} issued to student ID ${newInv.studentId}.`, 'Info');
  };

  const applyScholarshipToInvoice = (invoiceId: string, scholarshipAmount: number) => {
    setInvoices(prev => prev.map(inv => {
      if (inv.id !== invoiceId) return inv;
      const newDiscount = Math.max(0, scholarshipAmount);
      const netTotal = Math.max(0, inv.totalAmount - newDiscount);
      const isPaid = inv.amountPaid >= netTotal;
      return {
        ...inv,
        scholarshipDiscount: newDiscount,
        status: isPaid ? 'Paid' : (inv.amountPaid > 0 ? 'Partial' : 'Unpaid')
      };
    }));
    logAudit('Finance Bursar', `Applied $${scholarshipAmount} scholarship discount to invoice ID ${invoiceId}.`, 'Info');
  };

  // 14. HR & Staff Management
  const addStaffRecord = (staffData: Omit<StaffRecord, 'id' | 'staffNumber' | 'joinedDate'>) => {
    const newStaff: StaffRecord = {
      ...staffData,
      id: 'stf-' + Date.now(),
      staffNumber: `STAFF-${Math.floor(105 + Math.random() * 50)}`,
      joinedDate: new Date().toISOString().slice(0, 10)
    };
    setStaffList(prev => [...prev, newStaff]);
    logAudit('HR Directory', `Registered new staff member ${newStaff.name} (${newStaff.title}) in ${newStaff.department}.`, 'Info');
  };

  const updateStaffRecord = (staffId: string, data: Partial<StaffRecord>) => {
    setStaffList(prev => prev.map(s => s.id === staffId ? { ...s, ...data } : s));
    logAudit('HR Directory', `Updated record for staff ID ${staffId}.`, 'Info');
  };

  // 15. Library Book Catalog & Circulation Checkout
  const addLibraryBook = (bookData: Omit<LibraryBook, 'id' | 'availableCopies'>) => {
    const newBook: LibraryBook = {
      ...bookData,
      id: 'bk-' + Date.now(),
      availableCopies: bookData.totalCopies
    };
    setLibraryBooks(prev => [...prev, newBook]);
    logAudit('Library Circulation', `Added new title "${newBook.title}" by ${newBook.author} to catalog.`, 'Info');
  };

  const checkoutLibraryBook = (bookId: string, studentId: string, daysToBorrow = 14) => {
    const book = libraryBooks.find(b => b.id === bookId);
    const student = students.find(s => s.id === studentId);
    if (!book) return { success: false, message: 'Book not found in library catalog.' };
    if (book.availableCopies <= 0) return { success: false, message: 'No copies currently available.' };
    if (!student) return { success: false, message: 'Student record not found.' };

    const borrowDate = new Date();
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + daysToBorrow);

    const newLoan: LibraryLoan = {
      id: 'loan-' + Date.now(),
      bookId: book.id,
      studentId: student.id,
      studentName: `${student.firstName} ${student.lastName}`,
      borrowDate: borrowDate.toISOString().slice(0, 10),
      dueDate: dueDate.toISOString().slice(0, 10),
      status: 'Active',
      fineAmount: 0
    };

    setLibraryLoans(prev => [newLoan, ...prev]);
    setLibraryBooks(prev => prev.map(b => b.id === bookId ? { ...b, availableCopies: b.availableCopies - 1 } : b));
    logAudit('Library Circulation', `Issued "${book.title}" to student ${student.studentNumber} (${student.firstName} ${student.lastName}).`, 'Info');
    return { success: true, message: `Successfully checked out "${book.title}". Due date: ${newLoan.dueDate}` };
  };

  const returnLibraryBook = (loanId: string) => {
    const loan = libraryLoans.find(l => l.id === loanId);
    if (!loan) return;

    setLibraryLoans(prev => prev.map(l => l.id === loanId ? { ...l, status: 'Returned', returnDate: new Date().toISOString().slice(0, 10) } : l));
    setLibraryBooks(prev => prev.map(b => b.id === loan.bookId ? { ...b, availableCopies: Math.min(b.totalCopies, b.availableCopies + 1) } : b));
    logAudit('Library Circulation', `Book return processed for loan ID ${loanId}.`, 'Info');
  };

  // 16. Advising Resolution
  const resolveAdvisingNote = (noteId: string) => {
    setAdvisingNotes(prev => prev.map(n => n.id === noteId ? { ...n, atRiskFlag: false } : n));
    logAudit('Advising Console', `At-risk flag resolved for advising note ${noteId}.`, 'Info');
  };

  // 17. Alumni & Endowment Contributions
  const recordAlumniDonation = (alumniId: string, amount: number) => {
    setAlumniList(prev => prev.map(a => a.id === alumniId ? { ...a, totalDonations: a.totalDonations + amount } : a));
    logAudit('Alumni Endowment', `Recorded donation of $${amount} from alumni record ${alumniId}.`, 'Info');
  };

  const updateAlumniRecord = (alumniId: string, data: Partial<AlumniRecord>) => {
    setAlumniList(prev => prev.map(a => a.id === alumniId ? { ...a, ...data } : a));
    logAudit('Alumni Directory', `Updated alumni record for ${alumniId}.`, 'Info');
  };

  const updateStudentProfile = (studentId: string, data: Partial<Student>) => {
    setStudents(prev => prev.map(s => s.id === studentId ? { ...s, ...data } : s));
    logAudit('Student Self-Service', `Updated profile record for student ID ${studentId}.`, 'Info');
  };

  const graduateStudent = (studentId: string) => {
    setStudents(prev => prev.map(s => {
      if (s.id === studentId) {
        const newAlumni: AlumniRecord = {
          id: `alm-${Date.now()}`,
          studentId: s.id,
          studentNumber: s.studentNumber,
          name: `${s.firstName} ${s.lastName}`,
          graduationYear: new Date().getFullYear(),
          degree: s.program,
          email: s.email,
          phone: s.phone || '+1 555-0100',
          currentCompany: 'Transitioning',
          currentRole: 'Graduate Alumni',
          totalDonations: 0,
          mentorshipStatus: 'Not Opted'
        };
        setAlumniList(aPrev => [newAlumni, ...aPrev]);
        return { ...s, academicStatus: 'Graduated' };
      }
      return s;
    }));
    logAudit('Registrar Graduation', `Graduated student ID ${studentId} and added to Alumni directory.`, 'Info');
  };

  // 18. Executive Approvals & Proposals
  const approveExecutiveSignoff = (id: number) => {
    setExecutiveApprovals(prev => prev.map(item => item.id === id ? {
      ...item,
      signed: true,
      signedDate: new Date().toISOString().slice(0, 10),
      signerName: 'Prof. Arthur Vance (President)'
    } : item));
    logAudit('Executive Board', `President signed and approved governance charter #${id}.`, 'Security');
  };

  const addExecutiveProposal = (title: string, dept: string, priority: 'High' | 'Medium' | 'Low') => {
    const newItem = {
      id: Date.now(),
      title,
      dept,
      priority,
      signed: false
    };
    setExecutiveApprovals(prev => [newItem, ...prev]);
    logAudit('Executive Board', `Submitted new executive proposal: "${title}".`, 'Info');
  };

  // 19. IT System Settings
  const toggleSystemFlag = (flagName: 'mfaRequired' | 'maintenanceMode' | 'autoClearHolds' | 'openEnrollment') => {
    setSystemFlags(prev => {
      const updated = { ...prev, [flagName]: !prev[flagName] };
      logAudit('System Policy', `IT Admin toggled system setting "${flagName}" to ${updated[flagName]}.`, 'Warning');
      return updated;
    });
  };

  const resetDemoData = () => {
    localStorage.clear();
    setStudents(INITIAL_STUDENTS);
    setApplications(INITIAL_APPLICATIONS);
    setCourses(INITIAL_COURSES);
    setEnrollments(INITIAL_ENROLLMENTS);
    setInvoices(INITIAL_INVOICES);
    setStaffList(INITIAL_STAFF);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setLibraryBooks(INITIAL_BOOKS);
    setLibraryLoans(INITIAL_LOANS);
    setAdvisingNotes(INITIAL_ADVISING_NOTES);
    setAlumniList(INITIAL_ALUMNI);
  };

  return (
    <AppContext.Provider
      value={{
        currentPortal,
        setCurrentPortal,
        activeRole,
        setActiveRole,
        activeStudentId,
        setActiveStudentId,
        students,
        applications,
        courses,
        enrollments,
        invoices,
        staffList,
        auditLogs,
        libraryBooks,
        libraryLoans,
        advisingNotes,
        alumniList,
        executiveApprovals,
        systemFlags,
        logAudit,
        enrollStudentInCourse,
        dropStudentFromCourse,
        processInvoicePayment,
        convertApplicationToStudent,
        runAutomatedApplicationPipeline,
        updateStudentGrade,
        toggleStudentHold,
        recordAttendance,
        addApplication,
        updateApplicationStatus,
        updateApplicationDocumentStatus,
        addCourse,
        updateCourse,
        deleteCourse,
        createInvoice,
        applyScholarshipToInvoice,
        addStaffRecord,
        updateStaffRecord,
        addLibraryBook,
        checkoutLibraryBook,
        returnLibraryBook,
        addAdvisingNote,
        resolveAdvisingNote,
        recordAlumniDonation,
        updateAlumniRecord,
        updateStudentProfile,
        graduateStudent,
        approveExecutiveSignoff,
        addExecutiveProposal,
        toggleSystemFlag,
        resetDemoData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
