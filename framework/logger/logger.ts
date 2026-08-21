// framework/logger/logger.ts
//
// A small, dependency-free logger giving consistent, timestamped, leveled
// output across the whole framework — instead of scattered raw
// console.log() calls with inconsistent formatting.
//
// Each Logger instance carries a "scope" (e.g. a test name) that gets
// prefixed onto every line, so output from parallel workers/tests stays
// distinguishable in the terminal.

type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';

const LEVEL_COLOR: Record<LogLevel, string> = {
  DEBUG: '\x1b[90m', // gray
  INFO: '\x1b[36m', // cyan
  WARN: '\x1b[33m', // yellow
  ERROR: '\x1b[31m', // red
};
const RESET_COLOR = '\x1b[0m';

export class Logger {
  constructor(private readonly scope: string) {}

  debug(message: string): void {
    this.write('DEBUG', message);
  }

  info(message: string): void {
    this.write('INFO', message);
  }

  warn(message: string): void {
    this.write('WARN', message);
  }

  error(message: string): void {
    this.write('ERROR', message);
  }

  /** Returns a new Logger scoped to a sub-step, e.g. logger.child('login') */
  child(subScope: string): Logger {
    return new Logger(`${this.scope} > ${subScope}`);
  }

  private write(level: LogLevel, message: string): void {
    const timestamp = new Date().toISOString();
    const color = LEVEL_COLOR[level];
    // eslint-disable-next-line no-console
    console.log(`${color}[${timestamp}] [${level}] [${this.scope}]${RESET_COLOR} ${message}`);
  }
}

/** A logger not tied to any particular test — for global-setup/teardown, config loading, etc. */
export const rootLogger = new Logger('framework');
