import { Router, Request, Response } from "express";
import { db, saveDB, logServerAudit } from "../data/db.js";
import { authMiddleware, requireRoles, AuthenticatedRequest, signToken, VALID_PASSCODES } from "../middlewares/auth.js";
import { generateStudentUid, generateRegistrationNumber } from "../../src/utils/studentIdGenerator.js";
import { AcademicCareer, Application, FeeInvoice, Student, UserRole } from "../../src/types/index.js";

const router = Router();
// --- API ENDPOINTS ---

// Health Check
router.get("/api/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    recordsCount: {
      students: db.students.length,
      applications: db.applications.length,
      courses: db.courses.length,
      invoices: db.invoices.length
    }
  });
});

// Auth Login
router.post("/api/auth/login", (req, res) => {
  const { role, passcode } = req.body;
  
  if (!role) {
    return res.status(400).json({ error: "Role is required" });
  }

  // Check passcode for non-student staff roles
  if (role !== "student") {
    if (!passcode || !VALID_PASSCODES.includes(passcode.trim())) {
      return res.status(401).json({ error: "Invalid security passcode. Default passcode is 123456." });
    }
  }

  const name = role === "student" ? "Alex Rivera" : `Staff (${role.toUpperCase()})`;
  const issuedAt = Date.now();
  const exp = issuedAt + (24 * 60 * 60 * 1000); // 24 hours validity

  const token = signToken({ role: role as UserRole, name, issuedAt, exp });

  logServerAudit("User Authentication", `User authenticated as role ${role}`, role, name);

  res.json({
    message: "Authentication successful",
    token,
    user: {
      name,
      role
    }
  });
});

// Students API
router.get("/api/students", authMiddleware, (req, res) => {
  res.json(db.students);
});

router.get("/api/students/:id", authMiddleware, (req, res) => {
  const student = db.students.find(s => s.id === req.params.id);
  if (!student) {
    return res.status(404).json({ error: "Student not found" });
  }
  res.json(student);
});

router.post("/api/students", authMiddleware, requireRoles("registrar", "admissions"), (req, res) => {
  const authReq = req as AuthenticatedRequest;
  const studentData: Student = req.body;
  if (!studentData.firstName || !studentData.lastName || !studentData.email) {
    return res.status(400).json({ error: "Missing required biographic fields" });
  }

  db.students.push(studentData);
  saveDB(db);

  logServerAudit("Student Created", `New SIS student record created for ${studentData.firstName} ${studentData.lastName} (${studentData.registrationNumber})`, authReq.userRole, authReq.userName);

  res.status(201).json(studentData);
});

router.put("/api/students/:id", authMiddleware, requireRoles("registrar", "finance", "advisor", "exam_officer"), (req, res) => {
  const authReq = req as AuthenticatedRequest;
  const index = db.students.findIndex(s => s.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: "Student not found" });
  }

  db.students[index] = { ...db.students[index], ...req.body };
  saveDB(db);

  logServerAudit("Student Updated", `Student record updated for ${db.students[index].firstName} ${db.students[index].lastName}`, authReq.userRole, authReq.userName);

  res.json(db.students[index]);
});

// Applications API
router.get("/api/applications", authMiddleware, (req, res) => {
  res.json(db.applications);
});

router.post("/api/applications", authMiddleware, (req, res) => {
  const newApp: Application = {
    id: `app-${Date.now()}`,
    applicationNumber: `ADM-2026-${Math.floor(100 + Math.random() * 900)}`,
    applicantName: req.body.applicantName,
    email: req.body.email,
    phone: req.body.phone || "+1 (555) 019-2831",
    programApplied: req.body.programApplied || "B.Sc. Computer Science",
    career: (req.body.career as AcademicCareer) || "UG",
    department: req.body.department || "School of Computing & Engineering",
    appliedDate: new Date().toISOString().split("T")[0],
    status: "Under Review",
    highSchoolGPA: req.body.highSchoolGPA || 3.85,
    documents: [
      { name: "High School Transcript.pdf", status: "Verified" },
      { name: "ID Passport Copy.pdf", status: "Verified" }
    ],
    assignedUid: generateStudentUid(db.students.length + 105),
    assignedRegNo: generateRegistrationNumber({
      career: (req.body.career as AcademicCareer) || "UG",
      programCode: "CS",
      year: 2026,
      serial: db.students.length + 1
    })
  };

  db.applications.unshift(newApp);
  saveDB(db);

  logServerAudit("Application Submitted", `New application submitted by ${newApp.applicantName} (${newApp.applicationNumber})`, "Public", "Applicant");

  res.status(201).json(newApp);
});

// Admissions Conversion Route
router.post("/api/applications/:id/convert", authMiddleware, requireRoles("admissions", "registrar"), (req, res) => {
  const authReq = req as AuthenticatedRequest;
  const appIndex = db.applications.findIndex(a => a.id === req.params.id);
  if (appIndex === -1) {
    return res.status(404).json({ error: "Application not found" });
  }

  const appRecord = db.applications[appIndex];
  const nextSeq = 100 + db.students.length + 1;
  const uid = appRecord.assignedUid || generateStudentUid(nextSeq);
  const regNo = appRecord.assignedRegNo || generateRegistrationNumber({
    career: appRecord.career || "UG",
    programCode: "CS",
    year: 2026,
    serial: db.students.length + 1
  });

  const nameParts = appRecord.applicantName.split(" ");
  const firstName = nameParts[0] || "Applicant";
  const lastName = nameParts.slice(1).join(" ") || "Student";

  const newStudent: Student = {
    id: `std-${Date.now()}`,
    internalSeq: nextSeq,
    studentUid: uid,
    registrationNumber: regNo,
    studentNumber: regNo,
    career: appRecord.career || "UG",
    firstName,
    lastName,
    email: appRecord.email,
    phone: appRecord.phone,
    dateOfBirth: "2005-06-15",
    nationalId: `NAT-${Math.floor(100000 + Math.random() * 900000)}`,
    gender: "Female",
    nationality: "United States",
    program: appRecord.programApplied,
    department: appRecord.department,
    cohortYear: 2026,
    currentSemester: 1,
    academicStatus: "Active",
    financialHold: false,
    academicHold: false,
    gpa: 0.0,
    cgpa: 0.0,
    creditsEarned: 0,
    creditsRequired: 120,
    advisorName: "Dr. Robert Vance",
    advisorEmail: "r.vance@bmi.edu",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250",
    guardianName: "Parent / Guardian",
    guardianRelation: "Mother",
    guardianPhone: "+1 (555) 019-9988",
    guardianEmail: "guardian@example.com"
  };

  db.students.push(newStudent);
  db.applications[appIndex].status = "Enrolled";
  saveDB(db);

  logServerAudit("Admissions Conversion", `Converted application ${appRecord.applicationNumber} to Student Record ${newStudent.registrationNumber} (UID: ${newStudent.studentUid})`, authReq.userRole, authReq.userName);

  res.json({ student: newStudent, application: db.applications[appIndex] });
});

// Automated Admissions Pipeline Route
router.post("/api/applications/:id/pipeline", authMiddleware, requireRoles("admissions", "registrar"), (req, res) => {
  const authReq = req as AuthenticatedRequest;
  const appIndex = db.applications.findIndex(a => a.id === req.params.id);
  if (appIndex === -1) {
    return res.status(404).json({ error: "Application not found" });
  }

  const appRecord = db.applications[appIndex];
  const nextSeq = 100 + db.students.length + 1;
  const uid = appRecord.assignedUid || generateStudentUid(nextSeq);
  const regNo = appRecord.assignedRegNo || generateRegistrationNumber({
    career: appRecord.career || "UG",
    programCode: "CS",
    year: 2026,
    serial: db.students.length + 1
  });

  const nameParts = appRecord.applicantName.split(" ");
  const firstName = nameParts[0] || "Applicant";
  const lastName = nameParts.slice(1).join(" ") || "Student";

  const newStudent: Student = {
    id: `std-${Date.now()}`,
    internalSeq: nextSeq,
    studentUid: uid,
    registrationNumber: regNo,
    studentNumber: regNo,
    career: appRecord.career || "UG",
    firstName,
    lastName,
    email: appRecord.email,
    phone: appRecord.phone,
    dateOfBirth: "2005-08-20",
    nationalId: `NAT-${Math.floor(100000 + Math.random() * 900000)}`,
    gender: "Female",
    nationality: "United States",
    program: appRecord.programApplied,
    department: appRecord.department,
    cohortYear: 2026,
    currentSemester: 1,
    academicStatus: "Active",
    financialHold: false,
    academicHold: false,
    gpa: 3.90,
    cgpa: 3.90,
    creditsEarned: 15,
    creditsRequired: 120,
    advisorName: "Dr. Robert Vance",
    advisorEmail: "r.vance@bmi.edu",
    avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=250",
    guardianName: "Parent / Guardian",
    guardianRelation: "Father",
    guardianPhone: "+1 (555) 012-3456",
    guardianEmail: "parent@example.com"
  };

  db.students.push(newStudent);
  db.applications[appIndex].status = "Enrolled";

  // Auto create settled fee invoice
  const invoice: FeeInvoice = {
    id: `inv-${Date.now()}`,
    invoiceNumber: `INV-2026-${Math.floor(100 + Math.random() * 900)}`,
    studentId: newStudent.id,
    term: "Fall 2026",
    dueDate: "2026-09-15",
    issueDate: new Date().toISOString().split("T")[0],
    items: [
      { description: "Tuition Fee (Fall 2026)", amount: 3200 },
      { description: "Technology & Lab Access Fee", amount: 400 },
      { description: "Registration & Matriculation Fee", amount: 200 }
    ],
    totalAmount: 3800,
    amountPaid: 3800,
    status: "Paid",
    scholarshipDiscount: 0
  };
  db.invoices.unshift(invoice);
  saveDB(db);

  logServerAudit("Automated Pipeline Execution", `100% Automated Pipeline executed for ${newStudent.firstName} ${newStudent.lastName}. Enrolled with RegNo ${newStudent.registrationNumber} and Invoice settled.`, authReq.userRole, authReq.userName);

  res.json({
    student: newStudent,
    application: db.applications[appIndex],
    invoice,
    autoEnrolledCoursesCount: 4
  });
});

// Courses API
router.get("/api/courses", authMiddleware, (req, res) => {
  res.json(db.courses);
});

router.post("/api/courses", authMiddleware, requireRoles("registrar", "lecturer"), (req, res) => {
  const authReq = req as AuthenticatedRequest;
  const course = { id: `crs-${Date.now()}`, ...req.body };
  db.courses.push(course);
  saveDB(db);
  logServerAudit("Course Created", `New course created: ${course.code} - ${course.title}`, authReq.userRole, authReq.userName);
  res.status(201).json(course);
});

router.put("/api/courses/:id", authMiddleware, (req, res) => {
  const authReq = req as AuthenticatedRequest;
  const index = db.courses.findIndex(c => c.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: "Course not found" });
  }
  db.courses[index] = { ...db.courses[index], ...req.body };
  saveDB(db);
  logServerAudit("Course Updated", `Course updated: ${db.courses[index].code}`, authReq.userRole, authReq.userName);
  res.json(db.courses[index]);
});

// Invoices API
router.get("/api/invoices", authMiddleware, (req, res) => {
  res.json(db.invoices);
});

router.post("/api/invoices", authMiddleware, requireRoles("finance"), (req, res) => {
  const authReq = req as AuthenticatedRequest;
  const invoice = { id: `inv-${Date.now()}`, ...req.body };
  db.invoices.unshift(invoice);
  saveDB(db);
  logServerAudit("Invoice Issued", `New invoice issued: #${invoice.invoiceNumber || invoice.id}`, authReq.userRole, authReq.userName);
  res.status(201).json(invoice);
});

router.put("/api/invoices/:id", authMiddleware, (req, res) => {
  const authReq = req as AuthenticatedRequest;
  const index = db.invoices.findIndex(i => i.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: "Invoice not found" });
  }
  db.invoices[index] = { ...db.invoices[index], ...req.body };
  saveDB(db);
  logServerAudit("Invoice Updated", `Payment / Status update on Invoice #${db.invoices[index].invoiceNumber || req.params.id}`, authReq.userRole, authReq.userName);
  res.json(db.invoices[index]);
});

// Update Application
router.put("/api/applications/:id", authMiddleware, requireRoles("admissions", "registrar"), (req, res) => {
  const authReq = req as AuthenticatedRequest;
  const index = db.applications.findIndex(a => a.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: "Application not found" });
  }
  db.applications[index] = { ...db.applications[index], ...req.body };
  saveDB(db);
  logServerAudit("Application Updated", `Application #${db.applications[index].applicationNumber} updated to status '${db.applications[index].status}'`, authReq.userRole, authReq.userName);
  res.json(db.applications[index]);
});

// Staff API
router.get("/api/staff", authMiddleware, (req, res) => {
  res.json(db.staff);
});

// Books & Loans API
router.get("/api/books", authMiddleware, (req, res) => {
  res.json(db.books);
});

router.get("/api/loans", authMiddleware, (req, res) => {
  res.json(db.loans);
});

// Audit Logs API
router.get("/api/audit-logs", authMiddleware, (req, res) => {
  res.json(db.auditLogs);
});

router.post("/api/audit-logs", authMiddleware, (req, res) => {
  const authReq = req as AuthenticatedRequest;
  const { action, details, severity } = req.body;
  const newLog = logServerAudit(action, details, authReq.userRole || "User", authReq.userName || "Client");
  if (severity) newLog.severity = severity;
  saveDB(db);
  res.status(201).json(newLog);
});


export default router;
