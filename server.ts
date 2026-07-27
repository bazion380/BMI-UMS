import express, { Request, Response, NextFunction } from "express";
import path from "path";
import fs from "fs";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { createServer as createViteServer } from "vite";

import {
  INITIAL_STUDENTS,
  INITIAL_APPLICATIONS,
  INITIAL_COURSES,
  INITIAL_INVOICES,
  INITIAL_AUDIT_LOGS,
  INITIAL_STAFF,
  INITIAL_BOOKS,
  INITIAL_LOANS
} from "./src/data/mockData.js";

import { generateStudentUid, generateRegistrationNumber } from "./src/utils/studentIdGenerator.js";
import { AcademicCareer, Application, AuditLog, FeeInvoice, Student, UserRole } from "./src/types/index.js";

const PORT = 3000;
const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "db.json");

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// In-Memory Database structure backed by JSON file
interface DBData {
  students: Student[];
  applications: Application[];
  courses: any[];
  invoices: FeeInvoice[];
  auditLogs: AuditLog[];
  staff: any[];
  books: any[];
  loans: any[];
}

function loadDB(): DBData {
  try {
    if (fs.existsSync(DB_FILE)) {
      const content = fs.readFileSync(DB_FILE, "utf-8");
      return JSON.parse(content);
    }
  } catch (err) {
    console.error("Error loading db.json, reinitializing default data:", err);
  }

  const initialData: DBData = {
    students: INITIAL_STUDENTS,
    applications: INITIAL_APPLICATIONS,
    courses: INITIAL_COURSES,
    invoices: INITIAL_INVOICES,
    auditLogs: INITIAL_AUDIT_LOGS,
    staff: INITIAL_STAFF,
    books: INITIAL_BOOKS,
    loans: INITIAL_LOANS
  };

  saveDB(initialData);
  return initialData;
}

function saveDB(data: DBData) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to save db.json:", err);
  }
}

let db = loadDB();

// Express Application Setup
const app = express();

// Security Middleware: CORS, Rate Limiting, JSON body parser
app.use(cors());
app.use(express.json({ limit: "2mb" }));

// Security Headers
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  next();
});

// Rate limiting on API routes
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // limit each IP to 300 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests from this IP, please try again later." }
});
app.use("/api/", apiLimiter);

// Simple token auth helper
interface AuthenticatedRequest extends Request {
  userRole?: UserRole;
  userName?: string;
}

function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authReq = req as AuthenticatedRequest;
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    // Default to student if no token provided in demo mode
    authReq.userRole = "student";
    authReq.userName = "Alex Rivera";
    return next();
  }

  const token = authHeader.replace("Bearer ", "").trim();
  try {
    // Basic Base64 JSON token verification
    const decoded = JSON.parse(Buffer.from(token, "base64").toString("utf-8"));
    authReq.userRole = decoded.role as UserRole;
    authReq.userName = decoded.name;
    next();
  } catch (e) {
    res.status(401).json({ error: "Invalid authentication token" });
  }
}

function requireRoles(...allowedRoles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const authReq = req as AuthenticatedRequest;
    if (!authReq.userRole) {
      return res.status(401).json({ error: "Unauthorized access" });
    }
    if (authReq.userRole === "president" || authReq.userRole === "it_admin") {
      // President and IT Admin have override permissions
      return next();
    }
    if (!allowedRoles.includes(authReq.userRole)) {
      return res.status(403).json({
        error: `Forbidden: Role '${authReq.userRole}' lacks permission for this action.`
      });
    }
    next();
  };
}

// Global Audit Log Helper
function logServerAudit(action: string, details: string, role: string = "System", performedBy: string = "Server API") {
  const newLog: AuditLog = {
    id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    timestamp: new Date().toISOString(),
    performedBy,
    role,
    action,
    details,
    ipAddress: "127.0.0.1",
    severity: "Info"
  };
  db.auditLogs.unshift(newLog);
  saveDB(db);
  return newLog;
}

// --- API ENDPOINTS ---

// Health Check
app.get("/api/health", (req, res) => {
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
app.post("/api/auth/login", (req, res) => {
  const { role } = req.body;
  
  if (!role) {
    return res.status(400).json({ error: "Role is required" });
  }

  // Token payload
  const tokenPayload = {
    role,
    name: role === "student" ? "Alex Rivera" : `Staff (${role.toUpperCase()})`,
    issuedAt: Date.now()
  };

  const token = Buffer.from(JSON.stringify(tokenPayload)).toString("base64");

  logServerAudit("User Authentication", `User authenticated as role ${role}`, role, tokenPayload.name);

  res.json({
    message: "Authentication successful",
    token,
    user: {
      name: tokenPayload.name,
      role: tokenPayload.role
    }
  });
});

// Students API
app.get("/api/students", authMiddleware, (req, res) => {
  res.json(db.students);
});

app.get("/api/students/:id", authMiddleware, (req, res) => {
  const student = db.students.find(s => s.id === req.params.id);
  if (!student) {
    return res.status(404).json({ error: "Student not found" });
  }
  res.json(student);
});

app.post("/api/students", authMiddleware, requireRoles("registrar", "admissions"), (req, res) => {
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

app.put("/api/students/:id", authMiddleware, requireRoles("registrar", "finance", "advisor", "exam_officer"), (req, res) => {
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
app.get("/api/applications", authMiddleware, (req, res) => {
  res.json(db.applications);
});

app.post("/api/applications", authMiddleware, (req, res) => {
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
app.post("/api/applications/:id/convert", authMiddleware, requireRoles("admissions", "registrar"), (req, res) => {
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
app.post("/api/applications/:id/pipeline", authMiddleware, requireRoles("admissions", "registrar"), (req, res) => {
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
app.get("/api/courses", authMiddleware, (req, res) => {
  res.json(db.courses);
});

app.post("/api/courses", authMiddleware, requireRoles("registrar", "lecturer"), (req, res) => {
  const authReq = req as AuthenticatedRequest;
  const course = { id: `crs-${Date.now()}`, ...req.body };
  db.courses.push(course);
  saveDB(db);
  logServerAudit("Course Created", `New course created: ${course.code} - ${course.title}`, authReq.userRole, authReq.userName);
  res.status(201).json(course);
});

app.put("/api/courses/:id", authMiddleware, (req, res) => {
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
app.get("/api/invoices", authMiddleware, (req, res) => {
  res.json(db.invoices);
});

app.post("/api/invoices", authMiddleware, requireRoles("finance"), (req, res) => {
  const authReq = req as AuthenticatedRequest;
  const invoice = { id: `inv-${Date.now()}`, ...req.body };
  db.invoices.unshift(invoice);
  saveDB(db);
  logServerAudit("Invoice Issued", `New invoice issued: #${invoice.invoiceNumber || invoice.id}`, authReq.userRole, authReq.userName);
  res.status(201).json(invoice);
});

app.put("/api/invoices/:id", authMiddleware, (req, res) => {
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
app.put("/api/applications/:id", authMiddleware, requireRoles("admissions", "registrar"), (req, res) => {
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
app.get("/api/staff", authMiddleware, (req, res) => {
  res.json(db.staff);
});

// Books & Loans API
app.get("/api/books", authMiddleware, (req, res) => {
  res.json(db.books);
});

app.get("/api/loans", authMiddleware, (req, res) => {
  res.json(db.loans);
});

// Audit Logs API
app.get("/api/audit-logs", authMiddleware, (req, res) => {
  res.json(db.auditLogs);
});

app.post("/api/audit-logs", authMiddleware, (req, res) => {
  const authReq = req as AuthenticatedRequest;
  const { action, details, severity } = req.body;
  const newLog = logServerAudit(action, details, authReq.userRole || "User", authReq.userName || "Client");
  if (severity) newLog.severity = severity;
  saveDB(db);
  res.status(201).json(newLog);
});

// Vite & Static Production Middleware Setup
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
