/**
 * useStudents.ts
 *
 * React Query hooks for all Student-related API operations.
 * 
 * Exports:
 *  - useStudents()       → Fetch & cache all students
 *  - useStudent(id)      → Fetch a single student
 *  - useUpdateStudent()  → PUT /api/students/:id  (grade, hold, profile updates)
 *  - useCreateStudent()  → POST /api/students     (manual SIS registration)
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Student } from '../../types';
import { apiClient } from './apiClient';
import { queryKeys } from './queryKeys';

// ---------------------------------------------------------------------------
// 1. READ — Fetch all students
// ---------------------------------------------------------------------------
export function useStudents() {
  return useQuery({
    queryKey: queryKeys.students.all(),
    queryFn: () => apiClient.get<Student[]>('/api/students'),
    staleTime: 1000 * 60 * 2, // Cache is fresh for 2 minutes
    retry: 2,
  });
}

// ---------------------------------------------------------------------------
// 2. READ — Fetch a single student by ID
// ---------------------------------------------------------------------------
export function useStudent(id: string) {
  return useQuery({
    queryKey: queryKeys.students.detail(id),
    queryFn: () => apiClient.get<Student>(`/api/students/${id}`),
    enabled: !!id, // Only runs query when an ID is actually provided
    staleTime: 1000 * 60 * 2,
  });
}

// ---------------------------------------------------------------------------
// 3. WRITE — Create a new student (manual SIS entry)
// ---------------------------------------------------------------------------
export function useCreateStudent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<Student, 'id' | 'internalSeq' | 'studentUid' | 'registrationNumber' | 'studentNumber'>) =>
      apiClient.post<Student>('/api/students', data),
    onSuccess: () => {
      // After creating a student, re-fetch the full list
      queryClient.invalidateQueries({ queryKey: queryKeys.students.all() });
    },
  });
}

// ---------------------------------------------------------------------------
// 4. WRITE — Update a student (covers grades, holds, profile, status)
// ---------------------------------------------------------------------------
export function useUpdateStudent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Student> }) =>
      apiClient.put<Student>(`/api/students/${id}`, data),
    onSuccess: (updated) => {
      // Update the individual student in cache immediately (optimistic-like)
      queryClient.setQueryData(queryKeys.students.detail(updated.id), updated);
      // Also invalidate the list so any list views refresh
      queryClient.invalidateQueries({ queryKey: queryKeys.students.all() });
    },
  });
}

// ---------------------------------------------------------------------------
// 5. WRITE — Toggle a financial or academic hold
// ---------------------------------------------------------------------------
export function useToggleStudentHold() {
  const updateStudent = useUpdateStudent();

  return useMutation({
    mutationFn: ({
      studentId,
      holdType,
      value,
    }: {
      studentId: string;
      holdType: 'financial' | 'academic';
      value: boolean;
    }) => {
      const field = holdType === 'financial' ? 'financialHold' : 'academicHold';
      return updateStudent.mutateAsync({ id: studentId, data: { [field]: value } });
    },
  });
}

// ---------------------------------------------------------------------------
// 6. WRITE — Update a student's grade for a course
// ---------------------------------------------------------------------------
export function useUpdateStudentGrade() {
  const updateStudent = useUpdateStudent();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      studentId,
      gpa,
      cgpa,
    }: {
      studentId: string;
      gpa: number;
      cgpa: number;
    }) => updateStudent.mutateAsync({ id: studentId, data: { gpa, cgpa } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.students.all() });
    },
  });
}

// ---------------------------------------------------------------------------
// 7. WRITE — Graduate a student (academicStatus → 'Graduated')
// ---------------------------------------------------------------------------
export function useGraduateStudent() {
  const updateStudent = useUpdateStudent();

  return useMutation({
    mutationFn: (studentId: string) =>
      updateStudent.mutateAsync({ id: studentId, data: { academicStatus: 'Graduated' } }),
  });
}
