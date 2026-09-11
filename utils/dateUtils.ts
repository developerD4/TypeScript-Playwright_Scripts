export function getFutureDate(days: number): string {

  const date = new Date();

  date.setDate(date.getDate() + days);

  return date.toISOString().split('T')[0];
}

//Definition: A utility is a reusable function that performs a common task.