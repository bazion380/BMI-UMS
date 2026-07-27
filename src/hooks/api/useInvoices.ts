/**
 * useInvoices.ts
 *
 * React Query hooks for all Finance & Billing operations.
 *
 * Exports:
 *  - useInvoices()                   → Fetch & cache all invoices
 *  - useStudentInvoices(studentId)   → Derived: filter invoices by student
 *  - useCreateInvoice()              → POST /api/invoices
 *  - useProcessPayment()             → PUT  /api/invoices/:id (amountPaid, status)
 *  - useApplyScholarship()           → PUT  /api/invoices/:id (scholarshipDiscount)
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FeeInvoice } from '../../types';
import { apiClient } from './apiClient';
import { queryKeys } from './queryKeys';

// ---------------------------------------------------------------------------
// 1. READ — Fetch all invoices
// ---------------------------------------------------------------------------
export function useInvoices() {
  return useQuery({
    queryKey: queryKeys.invoices.all(),
    queryFn: () => apiClient.get<FeeInvoice[]>('/api/invoices'),
    staleTime: 1000 * 60 * 2,
  });
}

// ---------------------------------------------------------------------------
// 2. READ — Derived: Get invoices for a specific student (no extra API call)
// ---------------------------------------------------------------------------
export function useStudentInvoices(studentId: string) {
  return useQuery({
    queryKey: queryKeys.invoices.byStudent(studentId),
    // Selects from the already-cached full list — zero extra network requests!
    queryFn: () => apiClient.get<FeeInvoice[]>('/api/invoices'),
    select: (invoices) => invoices.filter((inv) => inv.studentId === studentId),
    enabled: !!studentId,
    staleTime: 1000 * 60 * 2,
  });
}

// ---------------------------------------------------------------------------
// 3. WRITE — Create a new fee invoice
// ---------------------------------------------------------------------------
export function useCreateInvoice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      data: Omit<FeeInvoice, 'id' | 'invoiceNumber' | 'issueDate' | 'amountPaid' | 'status'>
    ) => apiClient.post<FeeInvoice>('/api/invoices', data),
    onSuccess: (newInvoice) => {
      // Add new invoice to the cache immediately
      queryClient.setQueryData<FeeInvoice[]>(queryKeys.invoices.all(), (old) =>
        old ? [newInvoice, ...old] : [newInvoice]
      );
      // Invalidate student-specific invoice views
      queryClient.invalidateQueries({
        queryKey: queryKeys.invoices.byStudent(newInvoice.studentId),
      });
    },
  });
}

// ---------------------------------------------------------------------------
// 4. WRITE — Process a payment (updates amountPaid and status)
// ---------------------------------------------------------------------------
interface ProcessPaymentArgs {
  invoiceId: string;
  amountPaid: number;
  currentAmountPaid: number;
  totalAmount: number;
  scholarshipDiscount: number;
}

export function useProcessPayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      invoiceId,
      amountPaid,
      currentAmountPaid,
      totalAmount,
      scholarshipDiscount,
    }: ProcessPaymentArgs) => {
      const newTotalPaid = currentAmountPaid + amountPaid;
      const effectiveTotal = totalAmount - scholarshipDiscount;

      let status: FeeInvoice['status'];
      if (newTotalPaid >= effectiveTotal) {
        status = 'Paid';
      } else if (newTotalPaid > 0) {
        status = 'Partial';
      } else {
        status = 'Unpaid';
      }

      return apiClient.put<FeeInvoice>(`/api/invoices/${invoiceId}`, {
        amountPaid: newTotalPaid,
        status,
      });
    },
    // Optimistic update: reflect payment in UI immediately
    onMutate: async ({ invoiceId, amountPaid, currentAmountPaid, totalAmount, scholarshipDiscount }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.invoices.all() });
      const previous = queryClient.getQueryData<FeeInvoice[]>(queryKeys.invoices.all());

      const newTotalPaid = currentAmountPaid + amountPaid;
      const effectiveTotal = totalAmount - scholarshipDiscount;
      const status: FeeInvoice['status'] =
        newTotalPaid >= effectiveTotal ? 'Paid' : newTotalPaid > 0 ? 'Partial' : 'Unpaid';

      queryClient.setQueryData<FeeInvoice[]>(queryKeys.invoices.all(), (old) =>
        old?.map((inv) =>
          inv.id === invoiceId ? { ...inv, amountPaid: newTotalPaid, status } : inv
        )
      );
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKeys.invoices.all(), context.previous);
      }
    },
    onSettled: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.invoices.all() });
      if (data?.studentId) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.invoices.byStudent(data.studentId),
        });
        // A paid invoice may lift a financial hold — refresh students too
        queryClient.invalidateQueries({ queryKey: queryKeys.students.all() });
      }
    },
  });
}

// ---------------------------------------------------------------------------
// 5. WRITE — Apply a scholarship discount to an invoice
// ---------------------------------------------------------------------------
export function useApplyScholarship() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      invoiceId,
      scholarshipAmount,
    }: {
      invoiceId: string;
      scholarshipAmount: number;
    }) =>
      apiClient.put<FeeInvoice>(`/api/invoices/${invoiceId}`, {
        scholarshipDiscount: scholarshipAmount,
      }),
    onSuccess: (updated) => {
      queryClient.setQueryData<FeeInvoice[]>(queryKeys.invoices.all(), (old) =>
        old?.map((inv) => (inv.id === updated.id ? updated : inv))
      );
    },
  });
}
