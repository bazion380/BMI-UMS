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
  AlumniRecord 
} from '../types';

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 'std-101',
    internalSeq: 101,
    studentUid: 'BMI00002T', // Permanent Lifetime UID from Seq 101
    registrationNumber: 'BMI/UG-CS/224/001', // Primary Registration Number
    studentNumber: 'BMI/UG-CS/224/001',
    career: 'UG',
    firstName: 'Alex',
    lastName: 'Rivera',
    email: 'alex.rivera@student.bmi.edu',
    phone: '+1 (555) 234-5678',
    dateOfBirth: '2003-05-14',
    nationalId: 'NAT-9948271',
    gender: 'Male',
    nationality: 'United States',
    program: 'B.Sc. Computer Science',
    department: 'School of Computing & Engineering',
    cohortYear: 2024,
    currentSemester: 4,
    academicStatus: 'Active',
    financialHold: false,
    academicHold: false,
    gpa: 3.82,
    cgpa: 3.78,
    creditsEarned: 58,
    creditsRequired: 120,
    advisorName: 'Dr. Marcus Vance',
    advisorEmail: 'marcus.vance@bmi.edu',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    guardianName: 'Elena Rivera',
    guardianRelation: 'Mother',
    guardianPhone: '+1 (555) 987-6543',
    guardianEmail: 'elena.rivera@example.com',
    hostelRoom: 'Hall B - Room 304',
    transportPass: 'Route 4 Bus Pass (Active)'
  },
  {
    id: 'std-102',
    internalSeq: 102,
    studentUid: 'BMI00002U', // Permanent Lifetime UID from Seq 102
    registrationNumber: 'BMI/UG-DS/224/001', // Primary Registration Number
    studentNumber: 'BMI/UG-DS/224/001',
    career: 'UG',
    firstName: 'Maya',
    lastName: 'Lin',
    email: 'maya.lin@student.bmi.edu',
    phone: '+1 (555) 345-6789',
    dateOfBirth: '2004-09-22',
    nationalId: 'NAT-8837192',
    gender: 'Female',
    nationality: 'Canada',
    program: 'B.Sc. Data Science & AI',
    department: 'School of Computing & Engineering',
    cohortYear: 2024,
    currentSemester: 4,
    academicStatus: 'Active',
    financialHold: true, // Has an unpaid balance hold
    academicHold: false,
    gpa: 3.95,
    cgpa: 3.92,
    creditsEarned: 62,
    creditsRequired: 120,
    advisorName: 'Dr. Marcus Vance',
    advisorEmail: 'marcus.vance@bmi.edu',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=250',
    guardianName: 'Wei Lin',
    guardianRelation: 'Father',
    guardianPhone: '+1 (555) 876-5432',
    guardianEmail: 'wei.lin@example.com',
    hostelRoom: 'Hall A - Room 108'
  },
  {
    id: 'std-103',
    internalSeq: 103,
    studentUid: 'BMI00002V', // Permanent Lifetime UID from Seq 103
    registrationNumber: 'BMI/UG-BBA/223/001', // Primary Registration Number
    studentNumber: 'BMI/UG-BBA/223/001',
    career: 'UG',
    firstName: 'David',
    lastName: 'Kalu',
    email: 'david.kalu@student.bmi.edu',
    phone: '+1 (555) 456-7890',
    dateOfBirth: '2002-11-03',
    nationalId: 'NAT-7726154',
    gender: 'Male',
    nationality: 'Nigeria',
    program: 'B.A. Business Administration',
    department: 'School of Business & Economics',
    cohortYear: 2023,
    currentSemester: 6,
    academicStatus: 'Probation',
    financialHold: false,
    academicHold: true, // Academic probation hold
    gpa: 2.15,
    cgpa: 2.28,
    creditsEarned: 76,
    creditsRequired: 120,
    advisorName: 'Prof. Helen Carter',
    advisorEmail: 'helen.carter@bmi.edu',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
    guardianName: 'Samuel Kalu',
    guardianRelation: 'Father',
    guardianPhone: '+1 (555) 765-4321',
    guardianEmail: 'samuel.kalu@example.com'
  },
  {
    id: 'std-104',
    internalSeq: 104,
    studentUid: 'BMI00002W', // Permanent Lifetime UID from Seq 104
    registrationNumber: 'BMI/UG-ENG/223/001', // Primary Registration Number
    studentNumber: 'BMI/UG-ENG/223/001',
    career: 'UG',
    firstName: 'Sarah',
    lastName: 'Jenkins',
    email: 'sarah.jenkins@student.bmi.edu',
    phone: '+1 (555) 567-8901',
    dateOfBirth: '2003-01-19',
    nationalId: 'NAT-6615243',
    gender: 'Female',
    nationality: 'United Kingdom',
    program: 'B.Eng. Embedded Systems',
    department: 'School of Computing & Engineering',
    cohortYear: 2023,
    currentSemester: 6,
    academicStatus: 'Active',
    financialHold: false,
    academicHold: false,
    gpa: 3.65,
    cgpa: 3.70,
    creditsEarned: 88,
    creditsRequired: 130,
    advisorName: 'Dr. Aris Thorne',
    advisorEmail: 'aris.thorne@bmi.edu',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250',
    guardianName: 'Arthur Jenkins',
    guardianRelation: 'Father',
    guardianPhone: '+1 (555) 654-3210',
    guardianEmail: 'arthur.j@example.com'
  }
];

export const INITIAL_APPLICATIONS: Application[] = [
  {
    id: 'app-501',
    applicationNumber: 'ADM-2026-901',
    applicantName: "Samuel O'Connor",
    email: 'samuel.oc@gmail.com',
    phone: '+1 (555) 812-3344',
    programApplied: 'B.Sc. Computer Science',
    career: 'UG',
    department: 'School of Computing & Engineering',
    appliedDate: '2026-07-10',
    status: 'Offer Issued',
    highSchoolGPA: 3.88,
    testScore: 'SAT 1420',
    assignedUid: 'BMI00002X',
    assignedRegNo: 'BMI/UG-CS/226/001',
    automatedCheckPassed: true,
    eligibilityScore: 98,
    documents: [
      { name: 'High_School_Transcript.pdf', status: 'Verified' },
      { name: 'SAT_Official_Score.pdf', status: 'Verified' },
      { name: 'Identity_Passport.pdf', status: 'Verified' },
      { name: 'Recommendation_Letter.pdf', status: 'Verified' }
    ],
    reviewerNotes: 'Strong quantitative performance. Automated eligibility check passed (Score 98/100).'
  },
  {
    id: 'app-502',
    applicationNumber: 'ADM-2026-902',
    applicantName: 'Fatima Al-Zahra',
    email: 'fatima.alzahra@outlook.com',
    phone: '+1 (555) 913-4455',
    programApplied: 'B.Sc. Data Science & AI',
    career: 'UG',
    department: 'School of Computing & Engineering',
    appliedDate: '2026-07-15',
    status: 'Under Review',
    highSchoolGPA: 3.95,
    testScore: 'SAT 1490',
    assignedUid: 'BMI00002Y',
    assignedRegNo: 'BMI/UG-DS/226/001',
    automatedCheckPassed: true,
    eligibilityScore: 99,
    documents: [
      { name: 'High_School_Transcript.pdf', status: 'Verified' },
      { name: 'Math_Olympiad_Certificate.pdf', status: 'Verified' },
      { name: 'Passport_Copy.pdf', status: 'Pending' }
    ],
    reviewerNotes: 'Pending final passport copy verification.'
  },
  {
    id: 'app-503',
    applicationNumber: 'ADM-2026-903',
    applicantName: 'Jordan Lee',
    email: 'jordan.lee@yahoo.com',
    phone: '+1 (555) 123-9988',
    programApplied: 'B.A. Business Administration',
    career: 'UG',
    department: 'School of Business & Economics',
    appliedDate: '2026-07-20',
    status: 'Submitted',
    highSchoolGPA: 3.45,
    testScore: 'ACT 26',
    assignedUid: 'BMI00002Z',
    assignedRegNo: 'BMI/UG-BBA/226/001',
    automatedCheckPassed: true,
    eligibilityScore: 86,
    documents: [
      { name: 'High_School_Transcript.pdf', status: 'Pending' },
      { name: 'Essay_Statement_of_Purpose.pdf', status: 'Verified' }
    ]
  }
];

export const INITIAL_COURSES: Course[] = [
  {
    id: 'crs-301',
    code: 'CSC301',
    title: 'Data Structures & Algorithms',
    credits: 4,
    department: 'School of Computing & Engineering',
    instructorName: 'Dr. Marcus Vance',
    instructorId: 'stf-201',
    schedule: 'Mon, Wed 10:00 - 11:40 AM',
    room: 'Turing Hall 102',
    capacity: 40,
    enrolledCount: 36,
    prerequisites: ['CSC201'],
    description: 'Advanced analysis of asymptotic notation, search trees, hash tables, graph algorithms, and dynamic programming.',
    syllabus: [
      'Week 1: Complexity & Asymptotic Growth',
      'Week 2: Abstract Data Types & Balanced Trees',
      'Week 3: Graph Traversal (DFS/BFS, Dijkstra)',
      'Week 4: Dynamic Programming & Greedy Models',
      'Week 5: NP-Completeness & Midterm Exam'
    ]
  },
  {
    id: 'crs-302',
    code: 'CSC402',
    title: 'Database Systems & SQL Architecture',
    credits: 3,
    department: 'School of Computing & Engineering',
    instructorName: 'Prof. Helen Carter',
    instructorId: 'stf-202',
    schedule: 'Tue, Thu 01:00 - 02:30 PM',
    room: 'Ada Lovelace Lab 3',
    capacity: 35,
    enrolledCount: 32,
    prerequisites: ['CSC301'],
    description: 'Relational algebra, normal forms (BCNF, 3NF), indexing, query optimization, and ACID transactions.',
    syllabus: [
      'Week 1: Relational Model & SQL Fundamentals',
      'Week 2: ER Diagrams & Normalization',
      'Week 3: Indexing (B+ Trees, Hash Indexes)',
      'Week 4: Transaction Processing & Concurrency'
    ]
  },
  {
    id: 'crs-303',
    code: 'MTH201',
    title: 'Linear Algebra & Vector Calculus',
    credits: 3,
    department: 'School of Mathematics',
    instructorName: 'Dr. Aris Thorne',
    instructorId: 'stf-203',
    schedule: 'Mon, Wed, Fri 09:00 - 10:00 AM',
    room: 'Euler Auditorium B',
    capacity: 60,
    enrolledCount: 54,
    prerequisites: ['MTH101'],
    description: 'Vector spaces, linear transformations, matrices, determinants, eigenvalues, eigenvectors, and SVD applications.',
    syllabus: [
      'Week 1: Matrix Operations & Gaussian Elimination',
      'Week 2: Vector Spaces & Subspaces',
      'Week 3: Eigenvalues & Principal Component Analysis'
    ]
  },
  {
    id: 'crs-304',
    code: 'EEN304',
    title: 'Embedded Systems & Microcontrollers',
    credits: 4,
    department: 'School of Computing & Engineering',
    instructorName: 'Dr. Aris Thorne',
    instructorId: 'stf-203',
    schedule: 'Tue, Thu 09:30 - 11:30 AM',
    room: 'Robotics & Hardware Lab 1',
    capacity: 25,
    enrolledCount: 22,
    prerequisites: ['EEN201'],
    description: 'Hardware interfaces, GPIO, interrupt service routines, timers, SPI/I2C protocols, and real-time operating system concepts.',
    syllabus: [
      'Week 1: ARM Cortex Architecture',
      'Week 2: Timers & Interrupt Handling',
      'Week 3: Sensor Interfacing & SPI Bus'
    ]
  },
  {
    id: 'crs-305',
    code: 'BUS205',
    title: 'Financial Accounting & Reporting',
    credits: 3,
    department: 'School of Business & Economics',
    instructorName: 'Prof. Helen Carter',
    instructorId: 'stf-202',
    schedule: 'Tue, Thu 11:00 AM - 12:30 PM',
    room: 'Keynes Hall 204',
    capacity: 50,
    enrolledCount: 41,
    prerequisites: [],
    description: 'Principles of double-entry bookkeeping, income statements, balance sheets, cash flow analysis, and corporate reporting standards.',
    syllabus: [
      'Week 1: The Accounting Cycle',
      'Week 2: Balance Sheets & Liabilities',
      'Week 3: Cash Flow Statements & Auditing Basics'
    ]
  },
  {
    id: 'crs-306',
    code: 'ENG102',
    title: 'Academic Writing & Research Methods',
    credits: 3,
    department: 'School of Humanities',
    instructorName: 'Dr. Claire Beauchamp',
    instructorId: 'stf-204',
    schedule: 'Wed, Fri 02:00 - 03:30 PM',
    room: 'Humanities Complex 101',
    capacity: 30,
    enrolledCount: 28,
    prerequisites: [],
    description: 'Developing critical academic arguments, literature reviews, citation ethics, and scientific publication formats.',
    syllabus: [
      'Week 1: Formulating Hypotheses',
      'Week 2: Critical Literature Synthesis',
      'Week 3: Peer Review & Style Guides'
    ]
  }
];

export const INITIAL_ENROLLMENTS: StudentCourseEnrollment[] = [
  {
    studentId: 'std-101',
    courseId: 'crs-301',
    semester: 'Fall 2026',
    status: 'Enrolled',
    grade: 'A',
    numericScore: 92,
    attendancePercentage: 96
  },
  {
    studentId: 'std-101',
    courseId: 'crs-302',
    semester: 'Fall 2026',
    status: 'Enrolled',
    grade: 'A-',
    numericScore: 89,
    attendancePercentage: 92
  },
  {
    studentId: 'std-101',
    courseId: 'crs-303',
    semester: 'Fall 2026',
    status: 'Enrolled',
    grade: 'B+',
    numericScore: 87,
    attendancePercentage: 100
  },
  {
    studentId: 'std-102',
    courseId: 'crs-301',
    semester: 'Fall 2026',
    status: 'Enrolled',
    grade: 'A',
    numericScore: 97,
    attendancePercentage: 98
  },
  {
    studentId: 'std-102',
    courseId: 'crs-302',
    semester: 'Fall 2026',
    status: 'Enrolled',
    grade: 'A',
    numericScore: 95,
    attendancePercentage: 95
  },
  {
    studentId: 'std-103',
    courseId: 'crs-305',
    semester: 'Fall 2026',
    status: 'Enrolled',
    grade: 'C',
    numericScore: 71,
    attendancePercentage: 74
  },
  {
    studentId: 'std-104',
    courseId: 'crs-304',
    semester: 'Fall 2026',
    status: 'Enrolled',
    grade: 'A-',
    numericScore: 90,
    attendancePercentage: 94
  }
];

export const INITIAL_INVOICES: FeeInvoice[] = [
  {
    id: 'inv-801',
    invoiceNumber: 'INV-2026-1001',
    studentId: 'std-101',
    term: 'Fall 2026',
    issueDate: '2026-07-01',
    dueDate: '2026-08-15',
    items: [
      { description: 'Tuition Fee (16 Credits @ $350/credit)', amount: 5600 },
      { description: 'Computer Science Lab & Cloud Infra Fee', amount: 450 },
      { description: 'Library & Digital Knowledge Pass', amount: 150 },
      { description: 'Student Health & Wellness Insurance', amount: 300 }
    ],
    totalAmount: 6500,
    amountPaid: 6500,
    status: 'Paid',
    scholarshipDiscount: 1000
  },
  {
    id: 'inv-802',
    invoiceNumber: 'INV-2026-1002',
    studentId: 'std-102',
    term: 'Fall 2026',
    issueDate: '2026-07-01',
    dueDate: '2026-08-15',
    items: [
      { description: 'Tuition Fee (16 Credits @ $350/credit)', amount: 5600 },
      { description: 'Data Science Computing Lab Fee', amount: 500 },
      { description: 'Hostel Accommodation (Hall A)', amount: 1800 },
      { description: 'Student Health & Wellness Insurance', amount: 300 }
    ],
    totalAmount: 8200,
    amountPaid: 3200,
    status: 'Unpaid',
    scholarshipDiscount: 1500
  },
  {
    id: 'inv-803',
    invoiceNumber: 'INV-2026-1003',
    studentId: 'std-103',
    term: 'Fall 2026',
    issueDate: '2026-07-01',
    dueDate: '2026-08-15',
    items: [
      { description: 'Tuition Fee (12 Credits @ $350/credit)', amount: 4200 },
      { description: 'Business Case Study Library Pass', amount: 200 }
    ],
    totalAmount: 4400,
    amountPaid: 4400,
    status: 'Paid',
    scholarshipDiscount: 0
  }
];

export const INITIAL_STAFF: StaffRecord[] = [
  {
    id: 'stf-201',
    staffNumber: 'STAFF-101',
    name: 'Dr. Marcus Vance',
    email: 'marcus.vance@bmi.edu',
    department: 'School of Computing & Engineering',
    title: 'Associate Professor & Academic Advisor',
    role: 'lecturer',
    teachingLoadCredits: 12,
    status: 'Active',
    salaryCategory: 'Senior Faculty Grade 4',
    joinedDate: '2018-09-01'
  },
  {
    id: 'stf-202',
    staffNumber: 'STAFF-102',
    name: 'Prof. Helen Carter',
    email: 'helen.carter@bmi.edu',
    department: 'School of Business & Economics',
    title: 'Professor of Accounting & Finance',
    role: 'lecturer',
    teachingLoadCredits: 10,
    status: 'Active',
    salaryCategory: 'Senior Faculty Grade 5',
    joinedDate: '2015-01-15'
  },
  {
    id: 'stf-203',
    staffNumber: 'STAFF-103',
    name: 'Dr. Aris Thorne',
    email: 'aris.thorne@bmi.edu',
    department: 'School of Mathematics',
    title: 'Assistant Professor & Robotics Lead',
    role: 'lecturer',
    teachingLoadCredits: 14,
    status: 'Active',
    salaryCategory: 'Faculty Grade 2',
    joinedDate: '2021-08-20'
  },
  {
    id: 'stf-204',
    staffNumber: 'STAFF-104',
    name: 'Dr. Claire Beauchamp',
    email: 'claire.beauchamp@bmi.edu',
    department: 'School of Humanities',
    title: 'Head of Humanities',
    role: 'registrar',
    teachingLoadCredits: 6,
    status: 'Active',
    salaryCategory: 'Executive Staff Grade 1',
    joinedDate: '2012-04-10'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-001',
    timestamp: '2026-07-26 19:42:10',
    performedBy: 'Dr. Marcus Vance',
    role: 'Lecturer',
    action: 'Grade Entry',
    details: 'Submitted Midterm grade (92/100) for Alex Rivera in CSC301 Data Structures.',
    ipAddress: '192.168.1.45',
    severity: 'Info'
  },
  {
    id: 'log-002',
    timestamp: '2026-07-26 18:15:02',
    performedBy: 'System Auto-Trigger',
    role: 'Finance Gateway',
    action: 'Financial Hold Instate',
    details: 'Automated hold placed on Maya Lin (BMI/UG-DS/224/001) due to overdue fee balance ($5,000).',
    ipAddress: '10.0.0.12',
    severity: 'Warning'
  },
  {
    id: 'log-003',
    timestamp: '2026-07-26 16:30:00',
    performedBy: 'Eleanor Vance (Registrar)',
    role: 'Registrar',
    action: 'Course Registration Window Opened',
    details: 'Fall 2026 course add/drop period enabled for Cohort 2024 students.',
    ipAddress: '192.168.1.10',
    severity: 'Info'
  },
  {
    id: 'log-004',
    timestamp: '2026-07-26 14:10:44',
    performedBy: 'IT Security Service',
    role: 'IT Admin',
    action: 'OIDC SSO Token Issued',
    details: 'MFA verified login token issued for user alex.rivera@student.bmi.edu.',
    ipAddress: '172.16.4.88',
    severity: 'Info'
  }
];

export const INITIAL_BOOKS: LibraryBook[] = [
  {
    id: 'bk-101',
    isbn: '978-0262033848',
    title: 'Introduction to Algorithms (4th Edition)',
    author: 'Thomas H. Cormen, Charles E. Leiserson',
    category: 'Computer Science',
    totalCopies: 15,
    availableCopies: 9,
    locationShelf: 'Shelf CS-04B'
  },
  {
    id: 'bk-102',
    isbn: '978-0134685991',
    title: 'Effective Java (3rd Edition)',
    author: 'Joshua Bloch',
    category: 'Software Engineering',
    totalCopies: 10,
    availableCopies: 4,
    locationShelf: 'Shelf CS-02A'
  },
  {
    id: 'bk-103',
    isbn: '978-0134706030',
    title: 'Database System Concepts (7th Edition)',
    author: 'Abraham Silberschatz, Henry F. Korth',
    category: 'Database Systems',
    totalCopies: 12,
    availableCopies: 7,
    locationShelf: 'Shelf DB-01C'
  }
];

export const INITIAL_LOANS: LibraryLoan[] = [
  {
    id: 'loan-201',
    bookId: 'bk-101',
    studentId: 'std-101',
    studentName: 'Alex Rivera',
    borrowDate: '2026-07-01',
    dueDate: '2026-08-01',
    status: 'Active',
    fineAmount: 0
  },
  {
    id: 'loan-202',
    bookId: 'bk-102',
    studentId: 'std-102',
    studentName: 'Maya Lin',
    borrowDate: '2026-06-15',
    dueDate: '2026-07-15',
    status: 'Overdue',
    fineAmount: 15.00
  }
];

export const INITIAL_ADVISING_NOTES: AdvisingNote[] = [
  {
    id: 'adv-01',
    studentId: 'std-101',
    advisorName: 'Dr. Marcus Vance',
    date: '2026-07-12',
    topic: 'Undergraduate Research Opportunities & Honors Track',
    content: 'Discussed Alex taking on a senior thesis project in Distributed Systems next semester. Student demonstrates high aptitude.',
    isConfidential: false,
    atRiskFlag: false
  },
  {
    id: 'adv-02',
    studentId: 'std-103',
    advisorName: 'Prof. Helen Carter',
    date: '2026-07-05',
    topic: 'Academic Recovery Plan & Tutoring Schedule',
    content: 'David is currently on Academic Probation (CGPA 2.28). Agreed on mandatory peer tutoring twice a week for Accounting and capped course load at 12 credits.',
    isConfidential: true,
    atRiskFlag: true
  }
];

export const INITIAL_ALUMNI: AlumniRecord[] = [
  {
    id: 'alm-901',
    studentId: 'std-001',
    studentNumber: 'BMI/UG-CS/220/012',
    name: 'Emily Zhang',
    graduationYear: 2024,
    degree: 'B.Sc. Computer Science',
    currentCompany: 'Google DeepMind',
    currentRole: 'AI Research Engineer',
    email: 'emily.zhang@alumni.bmi.edu',
    phone: '+1 (555) 771-0022',
    totalDonations: 2500,
    mentorshipStatus: 'Active Mentor'
  },
  {
    id: 'alm-902',
    studentId: 'std-002',
    studentNumber: 'BMI/UG-BBA/220/045',
    name: 'Marcus Brody',
    graduationYear: 2024,
    degree: 'B.A. Business Administration',
    currentCompany: 'McKinsey & Company',
    currentRole: 'Management Consultant',
    email: 'marcus.b@alumni.bmi.edu',
    phone: '+1 (555) 882-1133',
    totalDonations: 1000,
    mentorshipStatus: 'Available'
  }
];
