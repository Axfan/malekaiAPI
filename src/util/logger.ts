import { LogService } from '../service/log.service';
import { LogEntry } from '../data/internal';
import * as moment from 'moment';

export function bindLogger(subject: string) {
    return {
      log(message: string, tags?: string[], extra?: string) { return Logger.log(subject, message, tags, extra); },
      warn(error?: any, tags?: string[]) { return Logger.warn(subject, error, tags); },
      error(error?: any, tags?: string[]) { return Logger.error(subject, error, tags); }
    };
}

export class Logger {

  private static format = 'HH:mm:ss YYYY-MM-DD';

  public static log(subject: string, message: string, tags?: string[], extra?: string): Promise<LogEntry> {
    console.log(`[${moment().format(this.format)}][LOG][${subject}]:`, message);
    tags = tags || ['log'];
    return LogService.create(new LogEntry('', new Date(), tags, subject, message, extra));
  }

  public static warn(subject: string, error?: any, tags?: string[]): Promise<LogEntry> {
    console.warn(`[${moment().format(this.format)}][WARN][${subject}]:`, error);
    tags = tags || (error.name ? ['warn', error.name] : ['warn']);
    return LogService.create(new LogEntry('', new Date(), tags, subject,
                                  error ? error.message ? error.message : '' + error : '',
                                  error.stack ? error.stack : ''));
  }

  public static error(subject: string, error?: any, tags?: string[]): Promise<LogEntry> {
    console.error(`[${moment().format(this.format)}][ERROR][${subject}]:`, error);
    tags = tags || (error.name ? ['error', error.name] : ['error']);
    return LogService.create(new LogEntry('', new Date(), tags, subject,
                                  error ? error.message ? error.message : '' + error : '',
                                  error.stack ? error.stack : ''));
  }

  private constructor() { }
}

export default Logger;
