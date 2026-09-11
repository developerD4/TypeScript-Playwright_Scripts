// Create unique values for test data such as employee email addresses.

export function generateUniqueId(): string {
  return `${Date.now()}${Math.floor(Math.random() * 1000)}`;
}  //output: 1680000000123
//Date.now() returns the current time as the number of milliseconds since January 1, 1970.
//Math.floor(Math.random() * 1000) - Generates a random whole number from 0 to 999.

export function generateRandomFirstName(): string {
  const names = ['Asha', 'David', 'Meera', 'Rahul'];
  return names[Math.floor(Math.random() * names.length)];
} //output: "Asha" or "David" or "Meera" or "Rahul"

export function generateRandomUsername(firstName: string): string {
  return `${firstName.toLowerCase()}_${generateUniqueId()}`;
} //output: "asha_1680000000123"

export function generateRandomEmail(
  firstName: string,
  domain: string = 'example.com'
): string {
  return `${firstName.toLowerCase()}_${generateUniqueId()}@${domain}`;
} //output: "asha_1680000000123@example.com"

//Definition: A utility is a reusable function that performs a common task.