// lib/utils/normalizeEmail.ts
//
// Emails must always be trimmed + lowercased before they're stored in or
// queried against Sanity. GROQ string comparisons (`email == $email`) are
// case-sensitive, so "Prodbysmig@gmail.com" and "prodbysmig@gmail.com" are
// treated as two different users. Without normalization, a login typed with
// different casing than what was stored (e.g. a phone keyboard that
// auto-capitalizes the first letter) fails with "Invalid credentials" even
// though the password is correct.
export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}
