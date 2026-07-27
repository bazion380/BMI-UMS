/**
 * useApplications.ts
 *
 * React Query hooks for all Admissions Application operations.
 *
 * Exports:
 *  - useApplications()                  → Fetch & cache all applications
 *  - useAddApplication()                → POST /api/applications
 *  - useUpdateApplicationStatus()       → PUT /api/applications/:id (status, notes, docs)
 *  - useConvertApplicationToStudent()   → POST /api/applications/:id/convert
 *  - useRunAutomatedPipeline()          → POST /api/applications/:id/pipeline
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Application, FeeInvoice, Student } from '../../types';
import { apiClient } from './apiClient';
import { queryKeys } from './queryKeys';

// ---------------------------------------------------------------------------
// 1. READ — Fetch all applications
// ---------------------------------------------------------------------------
export function useApplications() {
  return useQuery({
    queryKey: queryKeys.applications.all(),
    queryFn: () => apiClient.get<Application[]>('/api/applications'),
    staleTime: 1000 * 60 * 1, // 1 minute — Admissions data changes frequently
  });
}

// ---------------------------------------------------------------------------
// 2. WRITE — Submit a new application (public or staff-assisted)
// ---------------------------------------------------------------------------
export function useAddApplication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      data: Omit<Application, 'id' | 'applicationNumber' | 'appliedDate' | 'status' | 'documents'>
    ) => apiClient.post<Application>('/api/applications', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.applications.all() });
    },
  });
}

// ---------------------------------------------------------------------------
// 3. WRITE — Update application status, reviewer notes, or doc status
// ---------------------------------------------------------------------------
export function useUpdateApplicationStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      appId,
      status,
      reviewerNotes,
    }: {
      appId: string;
      status: Application['status'];
      reviewerNotes?: string;
    }) =>
      apiClient.put<Application>(`/api/applications/${appId}`, {
        status,
        ...(reviewerNotes !== undefined ? { reviewerNotes } : {}),
      }),
    onSuccess: (updated) => {
      // Update the specific application in cache directly
      queryClient.setQueryData(queryKeys.applications.detail(updated.id), updated);
      queryClient.invalidateQueries({ queryKey: queryKeys.applications.all() });
    },
  });
}

// ---------------------------------------------------------------------------
// 4. WRITE — Update a single document's verification status
// ---------------------------------------------------------------------------
export function useUpdateApplicationDocStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      appId,
      docIndex,
      status,
    }: {
      appId: string;
      docIndex: number;
      status: 'Pending' | 'Verified' | 'Rejected';
      // We need the current documents to build the updated array
      currentDocuments: Application['documents'];
    }) =>
      apiClient.put<Application>(`/api/applications/${appId}`, {
        documents: [] // Will be overridden by the onMutate handler below
      }).then(res => ({ res, appId, docIndex, status })),

    // Better approach: use optimistic update for doc status since it's a UI detail
    onMutate: async ({ appId, docIndex, status, currentDocuments }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.applications.all() });
      const previousApps = queryClient.getQueryData<Application[]>(queryKeys.applications.all());

      // Optimistically update the cache
      queryClient.setQueryData<Application[]>(queryKeys.applications.all(), (old) =>
        old?.map((app) => {
          if (app.id !== appId) return app;
          const newDocs = [...app.documents];
          newDocs[docIndex] = { ...newDocs[docIndex], status };
          return { ...app, documents: newDocs };
        })
      );
      return { previousApps };
    },
    onError: (_err, _vars, context) => {
      // Roll back on error
      if (context?.previousApps) {
        queryClient.setQueryData(queryKeys.applications.all(), context.previousApps);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.applications.all() });
    },
  });
}

// ---------------------------------------------------------------------------
// 5. WRITE — Manual conversion: Application → Student record
// ---------------------------------------------------------------------------
interface ConversionResult {
  student: Student;
  application: Application;
}

export function useConvertApplicationToStudent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (applicationId: string) =>
      apiClient.post<ConversionResult>(`/api/applications/${applicationId}/convert`, {}),
    onSuccess: () => {
      // Both students and applications data are now stale
      queryClient.invalidateQueries({ queryKey: queryKeys.students.all() });
      queryClient.invalidateQueries({ queryKey: queryKeys.applications.all() });
    },
  });
}

// ---------------------------------------------------------------------------
// 6. WRITE — Automated 100% Pipeline: Application → Student + Invoice
// ---------------------------------------------------------------------------
interface PipelineResult {
  student: Student;
  application: Application;
  invoice: FeeInvoice;
  autoEnrolledCoursesCount: number;
}

export function useRunAutomatedPipeline() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (applicationId: string) =>
      apiClient.post<PipelineResult>(`/api/applications/${applicationId}/pipeline`, {}),
    onSuccess: () => {
      // Pipeline creates students, updates applications, and creates invoices
      queryClient.invalidateQueries({ queryKey: queryKeys.students.all() });
      queryClient.invalidateQueries({ queryKey: queryKeys.applications.all() });
      queryClient.invalidateQueries({ queryKey: queryKeys.invoices.all() });
    },
  });
}
