// framework/utils/dateUtils.ts
//
// Small, dependency-free date helpers. Real frameworks often reach for a
// library like dayjs/date-fns for this, but a handful of plain functions
// like these cover most test-data needs without adding a dependency.

export function formatDate(date: Date, pattern: 'YYYY-MM-DD' | 'MM/DD/YYYY' = 'YYYY-MM-DD'): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return pattern === 'YYYY-MM-DD' ? `${year}-${month}-${day}` : `${month}/${day}/${year}`;
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function isoTimestamp(): string {
  return new Date().toISOString();
}

/** A filesystem/URL-safe timestamp, handy for unique file names or test run IDs. */
export function fileSafeTimestamp(date: Date = new Date()): string {
  return date.toISOString().replace(/[:.]/g, '-');
}
