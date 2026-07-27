/**
 * useStaff.ts
 *
 * React Query hooks for all HR & Staff Management operations.
 *
 * Exports:
 *  - useStaff()           → Fetch & cache all staff records
 *  - useAddStaff()        → POST /api/staff
 *  - useUpdateStaff()     → PUT  /api/staff/:id
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { StaffRecord } from '../../types';
import { apiClient } from './apiClient';
import { queryKeys } from './queryKeys';

// ---------------------------------------------------------------------------
// 1. READ — Fetch all staff records
// ---------------------------------------------------------------------------
export function useStaff() {
  return useQuery({
    queryKey: queryKeys.staff.all(),
    queryFn: () => apiClient.get<StaffRecord[]>('/api/staff'),
    staleTime: 1000 * 60 * 5, // Staff changes infrequently
  });
}

// ---------------------------------------------------------------------------
// 2. WRITE — Add a new staff member
// ---------------------------------------------------------------------------
export function useAddStaff() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<StaffRecord, 'id' | 'staffNumber' | 'joinedDate'>) =>
      apiClient.post<StaffRecord>('/api/staff', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.staff.all() });
    },
  });
}

// ---------------------------------------------------------------------------
// 3. WRITE — Update a staff record (role, status, department, etc.)
// ---------------------------------------------------------------------------
export function useUpdateStaff() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<StaffRecord> }) =>
      apiClient.put<StaffRecord>(`/api/staff/${id}`, data),
    onSuccess: (updated) => {
      queryClient.setQueryData(queryKeys.staff.detail(updated.id), updated);
      queryClient.invalidateQueries({ queryKey: queryKeys.staff.all() });
    },
  });
}
