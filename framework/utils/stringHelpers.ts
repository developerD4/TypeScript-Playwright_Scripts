// Reusable text helpers for values read from the application.

export function normalizeWhitespace(value: string): string {
  return value.replace(/\s+/g, ' ').trim();
}

export function removeCurrencySymbol(value: string): number {
  const match = value.match(/\d[\d,]*(\.\d+)?/);
  return match ? Number(match[0].replace(/,/g, '')) : NaN;
}
