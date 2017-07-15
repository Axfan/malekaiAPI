import * as moment from 'moment';

export class LoggerLite {

  private static format = 'hh:mm:ss YYYY-MM-DD';

  public static log(subject: string, message?: any, ...optionalParams: any[]): void {
    console.log(`[L][${moment().format(this.format)}][ERROR][${subject}]:`, message, ...optionalParams);
  }

  public static warn(subject: string, message?: any, ...optionalParams: any[]): void {
    console.warn(`[L][${moment().format(this.format)}][WARN][${subject}]:`, message, ...optionalParams);
  }

  public static error(subject: string, message?: any, ...optionalParams: any[]): void {
    console.error(`[L][${moment().format(this.format)}][ERROR][${subject}]:`, message, ...optionalParams);
  }

  private constructor() { }
}

export default LoggerLite;
