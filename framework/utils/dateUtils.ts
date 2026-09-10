// Reusable date helpers for date fields and test data.

export function formatDate(date: Date, separator: string = '-'): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}${separator}${month}${separator}${day}`;
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function getTodayDate(): string {
  return formatDate(new Date());
}
