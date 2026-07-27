/**
 * useCourses.ts
 *
 * React Query hooks for all Course & Enrollment operations.
 *
 * Exports:
 *  - useCourses()               → Fetch & cache all courses
 *  - useAddCourse()             → POST /api/courses
 *  - useUpdateCourse()          → PUT /api/courses/:id
 *  - useDeleteCourse()          → DELETE /api/courses/:id  (if server supports)
 *  - useEnrollStudentInCourse() → POST /api/students/:id  (updates enrolledCount via student update)
 *  - useDropStudentFromCourse() → PUT /api/students/:id
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Course, Student } from '../../types';
import { apiClient } from './apiClient';
import { queryKeys } from './queryKeys';

// ---------------------------------------------------------------------------
// 1. READ — Fetch all courses
// ---------------------------------------------------------------------------
export function useCourses() {
  return useQuery({
    queryKey: queryKeys.courses.all(),
    queryFn: () => apiClient.get<Course[]>('/api/courses'),
    staleTime: 1000 * 60 * 5, // Courses rarely change — cache for 5 minutes
  });
}

// ---------------------------------------------------------------------------
// 2. WRITE — Create a new course
// ---------------------------------------------------------------------------
export function useAddCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<Course, 'id' | 'enrolledCount'>) =>
      apiClient.post<Course>('/api/courses', data),
    // Optimistic update: add the course to cache immediately before server responds
    onMutate: async (newCourse) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.courses.all() });
      const previousCourses = queryClient.getQueryData<Course[]>(queryKeys.courses.all());

      queryClient.setQueryData<Course[]>(queryKeys.courses.all(), (old) => [
        ...(old ?? []),
        { ...newCourse, id: `temp-${Date.now()}`, enrolledCount: 0 },
      ]);

      return { previousCourses };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousCourses) {
        queryClient.setQueryData(queryKeys.courses.all(), context.previousCourses);
      }
    },
    onSettled: () => {
      // Always re-sync with server to replace temp ID with real one
      queryClient.invalidateQueries({ queryKey: queryKeys.courses.all() });
    },
  });
}

// ---------------------------------------------------------------------------
// 3. WRITE — Update a course (schedule, room, capacity, instructor, etc.)
// ---------------------------------------------------------------------------
export function useUpdateCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Course> }) =>
      apiClient.put<Course>(`/api/courses/${id}`, data),
    onSuccess: (updated) => {
      queryClient.setQueryData(queryKeys.courses.detail(updated.id), updated);
      queryClient.invalidateQueries({ queryKey: queryKeys.courses.all() });
    },
  });
}

// ---------------------------------------------------------------------------
// 4. WRITE — Delete a course
// ---------------------------------------------------------------------------
export function useDeleteCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (courseId: string) =>
      apiClient.delete<void>(`/api/courses/${courseId}`),
    // Optimistic deletion
    onMutate: async (courseId) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.courses.all() });
      const previousCourses = queryClient.getQueryData<Course[]>(queryKeys.courses.all());
      queryClient.setQueryData<Course[]>(queryKeys.courses.all(), (old) =>
        old?.filter((c) => c.id !== courseId)
      );
      return { previousCourses };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousCourses) {
        queryClient.setQueryData(queryKeys.courses.all(), context.previousCourses);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.courses.all() });
    },
  });
}

// ---------------------------------------------------------------------------
// 5. WRITE — Enroll a student in a course
//    Strategy: Update enrolledCount on course + track via student record
// ---------------------------------------------------------------------------
export function useEnrollStudentInCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ student, course }: { student: Student; course: Course }) => {
      // Check capacity before sending request
      if (course.enrolledCount >= course.capacity) {
        throw new Error(`Course ${course.code} is at full capacity (${course.capacity})`);
      }

      // Increment course enrolledCount on the server
      return apiClient.put<Course>(`/api/courses/${course.id}`, {
        enrolledCount: course.enrolledCount + 1,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.courses.all() });
      queryClient.invalidateQueries({ queryKey: queryKeys.students.all() });
    },
  });
}

// ---------------------------------------------------------------------------
// 6. WRITE — Drop a student from a course (decrement enrolledCount)
// ---------------------------------------------------------------------------
export function useDropStudentFromCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ course }: { studentId: string; course: Course }) =>
      apiClient.put<Course>(`/api/courses/${course.id}`, {
        enrolledCount: Math.max(0, course.enrolledCount - 1),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.courses.all() });
      queryClient.invalidateQueries({ queryKey: queryKeys.students.all() });
    },
  });
}
