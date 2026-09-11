// A small logger for clear framework messages in terminal and CI logs.
export class Logger {
  private write(level: string, message: string): void {
    const time = new Date().toLocaleTimeString(); //outputs the current time e.g., "10:30:15 AM"
    console.log(`[${time}] [${level}] ${message}`);
  }
  //   private write(level: string, severity: string, message: string): void {
  //   const time = new Date().toLocaleTimeString(); //outputs the current time e.g., "10:30:15 AM"
  //   console.log(`[${time}] [${level}] ${message}`);
  //   console.log(severity)
  // }
  info(message: string): void {
    this.write('INFO', message);
  }
  //this.write('INFO', 'low', message);
  warn(message: string): void {
    this.write('WARN', message);
  }
  error(message: string): void {
    this.write('ERROR', message);
  }
}
export const logger = new Logger();

//Logger is a reusable way to record information, warnings, or errors during execution.