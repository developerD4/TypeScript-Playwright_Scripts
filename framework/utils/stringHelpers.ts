// framework/utils/stringHelpers.ts
//
// Small string utilities that come up repeatedly when preparing test data
// or normalizing text scraped from the page before comparing it.

export function capitalize(value: string): string {
  if (!value) return value;
  return value[0].toUpperCase() + value.slice(1).toLowerCase();
}

export function toKebabCase(value: string): string {
  return value
    .trim()
    .replace(/([a-z])([A-Z])/g, '$1-$2') // camelCase -> camel-Case
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
}

export function truncate(value: string, maxLength: number, suffix = '...'): string {
  if (value.length <= maxLength) return value;
  return value.slice(0, maxLength - suffix.length) + suffix;
}

/** Collapses runs of whitespace (including newlines) into single spaces and trims. */
export function normalizeWhitespace(value: string): string {
  return value.replace(/\s+/g, ' ').trim();
}

export function stripCurrencySymbol(value: string): number {
  // Matches the first run of digits with an optional decimal portion, so
  // stray periods elsewhere in the string (e.g. the abbreviation "Rs.")
  // aren't mistaken for a decimal point.
  const match = value.match(/\d+(\.\d+)?/);
  return match ? Number(match[0]) : NaN;
}
