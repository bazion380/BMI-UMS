/**
 * index.ts
 *
 * Public barrel export for all API hooks.
 * 
 * Import from here in components:
 *   import { useStudents, useUpdateStudent } from '../hooks/api';
 * 
 * Never import directly from individual files in components — 
 * this keeps refactoring isolated to this file.
 */

// Core utility
export { apiClient, ApiError } from './apiClient';
export { queryKeys } from './queryKeys';

// Students
export {
  useStudents,
  useStudent,
  useCreateStudent,
  useUpdateStudent,
  useToggleStudentHold,
  useUpdateStudentGrade,
  useGraduateStudent,
} from './useStudents';

// Applications / Admissions
export {
  useApplications,
  useAddApplication,
  useUpdateApplicationStatus,
  useUpdateApplicationDocStatus,
  useConvertApplicationToStudent,
  useRunAutomatedPipeline,
} from './useApplications';

// Courses & Enrollment
export {
  useCourses,
  useAddCourse,
  useUpdateCourse,
  useDeleteCourse,
  useEnrollStudentInCourse,
  useDropStudentFromCourse,
} from './useCourses';

// Finance & Invoices
export {
  useInvoices,
  useStudentInvoices,
  useCreateInvoice,
  useProcessPayment,
  useApplyScholarship,
} from './useInvoices';

// Staff / HR
export {
  useStaff,
  useAddStaff,
  useUpdateStaff,
} from './useStaff';

// Library
export {
  useBooks,
  useLoans,
  useStudentLoans,
  useAddBook,
  useCheckoutBook,
  useReturnBook,
} from './useLibrary';

// Audit Logs
export {
  useAuditLogs,
  useLogAudit,
} from './useAuditLogs';
