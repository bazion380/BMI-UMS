/**
 * useLibrary.ts
 *
 * React Query hooks for all Library operations.
 *
 * Exports:
 *  - useBooks()            → Fetch all library books
 *  - useLoans()            → Fetch all loan records
 *  - useStudentLoans(id)   → Fetch loans for a specific student
 *  - useAddBook()          → POST /api/books
 *  - useCheckoutBook()     → POST /api/loans
 *  - useReturnBook()       → PUT  /api/loans/:id
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { LibraryBook, LibraryLoan } from '../../types';
import { apiClient } from './apiClient';
import { queryKeys } from './queryKeys';

// ---------------------------------------------------------------------------
// 1. READ — All books
// ---------------------------------------------------------------------------
export function useBooks() {
  return useQuery({
    queryKey: queryKeys.books.all(),
    queryFn: () => apiClient.get<LibraryBook[]>('/api/books'),
    staleTime: 1000 * 60 * 5,
  });
}

// ---------------------------------------------------------------------------
// 2. READ — All loans
// ---------------------------------------------------------------------------
export function useLoans() {
  return useQuery({
    queryKey: queryKeys.loans.all(),
    queryFn: () => apiClient.get<LibraryLoan[]>('/api/loans'),
    staleTime: 1000 * 60 * 2,
  });
}

// ---------------------------------------------------------------------------
// 3. READ — Derived: Loans for a specific student
// ---------------------------------------------------------------------------
export function useStudentLoans(studentId: string) {
  return useQuery({
    queryKey: queryKeys.loans.byStudent(studentId),
    queryFn: () => apiClient.get<LibraryLoan[]>('/api/loans'),
    select: (loans) => loans.filter((loan) => loan.studentId === studentId),
    enabled: !!studentId,
    staleTime: 1000 * 60 * 2,
  });
}

// ---------------------------------------------------------------------------
// 4. WRITE — Add a new book to the catalogue
// ---------------------------------------------------------------------------
export function useAddBook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<LibraryBook, 'id' | 'availableCopies'>) =>
      apiClient.post<LibraryBook>('/api/books', { ...data, availableCopies: data.totalCopies }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.books.all() });
    },
  });
}

// ---------------------------------------------------------------------------
// 5. WRITE — Checkout a book (create a loan, decrement availableCopies)
// ---------------------------------------------------------------------------
export function useCheckoutBook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      book,
      studentId,
      studentName,
      daysToBorrow = 14,
    }: {
      book: LibraryBook;
      studentId: string;
      studentName: string;
      daysToBorrow?: number;
    }) => {
      if (book.availableCopies <= 0) {
        throw new Error(`"${book.title}" has no available copies`);
      }

      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + daysToBorrow);

      // Create the loan record
      const loan = await apiClient.post<LibraryLoan>('/api/loans', {
        bookId: book.id,
        studentId,
        studentName,
        borrowDate: new Date().toISOString().split('T')[0],
        dueDate: dueDate.toISOString().split('T')[0],
        status: 'Active',
        fineAmount: 0,
      });

      // Decrement available copies on the book
      await apiClient.put(`/api/books/${book.id}`, {
        availableCopies: book.availableCopies - 1,
      });

      return loan;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.loans.all() });
      queryClient.invalidateQueries({ queryKey: queryKeys.loans.byStudent(variables.studentId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.books.all() });
    },
  });
}

// ---------------------------------------------------------------------------
// 6. WRITE — Return a book (update loan status, restore availableCopies)
// ---------------------------------------------------------------------------
export function useReturnBook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ loan, book }: { loan: LibraryLoan; book: LibraryBook }) => {
      // Mark loan as returned
      const updatedLoan = await apiClient.put<LibraryLoan>(`/api/loans/${loan.id}`, {
        status: 'Returned',
        returnDate: new Date().toISOString().split('T')[0],
      });

      // Restore available copies
      await apiClient.put(`/api/books/${book.id}`, {
        availableCopies: book.availableCopies + 1,
      });

      return updatedLoan;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.loans.all() });
      queryClient.invalidateQueries({ queryKey: queryKeys.loans.byStudent(variables.loan.studentId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.books.all() });
    },
  });
}
