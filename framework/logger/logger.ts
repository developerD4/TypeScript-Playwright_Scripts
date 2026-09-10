// A small logger for clear framework messages in terminal and CI logs.
export class Logger {
  info(message: string): void {
    this.write('INFO', message);
  }

  warn(message: string): void {
    this.write('WARN', message);
  }

  error(message: string): void {
    this.write('ERROR', message);
  }

  private write(level: string, message: string): void {
    const time = new Date().toLocaleTimeString();
    console.log(`[${time}] [${level}] ${message}`);
  }
}

export const logger = new Logger();

//Logger is a reusable way to record information, warnings, or errors during execution.
//A wrapper is a reusable function that adds common behavior around an existing action.