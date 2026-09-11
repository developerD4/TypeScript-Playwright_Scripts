// Reusable text helpers for values read from the application.

export function normalizeWhitespace(value: string): string {
  return value.replace(/\s+/g, ' ').trim();
} // input: "  Hello   World  " -> output: "Hello World" - replaces multiple spaces with a single space and trims leading/trailing whitespace
// "/s+" - Matches one or more whitespace characters (spaces, tabs, newlines)
export function capitalize(value: string): string {
  return value ? value.charAt(0).toUpperCase() + value.slice(1) : '';
}//input: "hello" -> output: "Hello" - capitalizes the first letter of a string
// In JavaScript, [] can access a character by its index in a string, while charAt() is another method to access a character by its position.

export function removeCurrencySymbol(value: string): number {
  const match = value.match(/\d[\d,]*(\.\d+)?/);
  return match ? Number(match[0].replace(/,/g, '')) : NaN; //string to number conversion
}//input: "'Total price is 1,234.50 dollars'" -> output: 1234.50 - removes currency symbols and converts to a number

// Regular expression explanation:
// \d[\d,]*(\.\d+)? - Matches a number with optional commas and decimal places
// /,/g - Replaces all commas with empty strings

// '/' - symbols mark the beginning and end of a regular expression.
//Definition: A string utility is a reusable function for performing common operations on text.
