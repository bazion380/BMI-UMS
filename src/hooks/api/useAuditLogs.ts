/**
 * useAuditLogs.ts
 *
 * React Query hooks for System Audit Log operations.
 *
 * Exports:
 *  - useAuditLogs()     → Fetch all audit logs (with auto-refresh)
 *  - useLogAudit()      → POST /api/audit-logs
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AuditLog } from '../../types';
import { apiClient } from './apiClient';
import { queryKeys } from './queryKeys';

// ---------------------------------------------------------------------------
// 1. READ — Fetch all audit logs (auto-refreshes every 30 seconds)
// ---------------------------------------------------------------------------
export function useAuditLogs() {
  return useQuery({
    queryKey: queryKeys.auditLogs.all(),
    queryFn: () => apiClient.get<AuditLog[]>('/api/audit-logs'),
    staleTime: 1000 * 30,        // Consider stale after 30 seconds
    refetchInterval: 1000 * 60,  // Auto-refetch every 60 seconds for live monitoring
  });
}

// ---------------------------------------------------------------------------
// 2. WRITE — Post a new audit log entry
// ---------------------------------------------------------------------------
export function useLogAudit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (log: {
      action: string;
      details: string;
      severity?: 'Info' | 'Warning' | 'Security';
    }) => apiClient.post<AuditLog>('/api/audit-logs', log),
    onSuccess: (newLog) => {
      // Prepend new log to cached list for instant UI update
      queryClient.setQueryData<AuditLog[]>(queryKeys.auditLogs.all(), (old) =>
        old ? [newLog, ...old] : [newLog]
      );
    },
  });
}
