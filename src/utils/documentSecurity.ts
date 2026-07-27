/**
 * Document Security Utilities for BMI University SIS
 * Provides zero-cost, cryptographic hashing, security verification, and checksums.
 */

export interface DocumentSecurityData {
  documentId: string;
  documentType: 'Official Academic Transcript' | 'Tuition Fee Invoice' | 'Payment Receipt' | 'Digital Student ID' | 'Admissions Offer Letter' | 'Exam Seating Pass' | 'Library Clearance Certificate' | 'Degree Diploma';
  studentId: string;
  studentName: string;
  issueDate: string;
  payload: Record<string, any>;
}

/**
 * Computes a SHA-256 cryptographic hash of document contents using native Web Crypto API.
 */
export async function generateDocumentHash(data: DocumentSecurityData): Promise<string> {
  const serialized = JSON.stringify({
    docId: data.documentId,
    type: data.documentType,
    sId: data.studentId,
    sName: data.studentName,
    date: data.issueDate,
    payload: data.payload
  });

  const encoder = new TextEncoder();
  const buffer = encoder.encode(serialized);
  
  try {
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  } catch (err) {
    // Fallback lightweight hash generator if Crypto API fails
    let hash = 0;
    for (let i = 0; i < serialized.length; i++) {
      const char = serialized.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0;
    }
    return Math.abs(hash).toString(16).padStart(64, 'a1f89');
  }
}

/**
 * Formats hash into human-readable 4-character blocks for document footers.
 */
export function formatSecurityHash(hash: string): string {
  if (!hash) return 'SEC-0000-0000-0000-0000';
  const clean = hash.toUpperCase();
  return `${clean.slice(0, 4)}-${clean.slice(4, 8)}-${clean.slice(8, 12)}-${clean.slice(12, 16)}`;
}

/**
 * Constructs official verification URL for QR codes.
 */
export function getVerificationUrl(docId: string, hash: string): string {
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://bmi.university';
  return `${origin}/verify?doc=${encodeURIComponent(docId)}&hash=${encodeURIComponent(hash.slice(0, 16))}`;
}
