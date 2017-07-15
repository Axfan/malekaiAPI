export class LogEntry {

  id: string;
  date: Date;
  tags: string[];

  // all in `Error`

  subject: string;
  message: string;
  extra: string;

  public static fromAny(obj: any) {
    return new LogEntry(obj.id, obj.date || new Date(0), obj.tags, obj.subject, obj.message, obj.extra);
  }

  constructor(logEntry?: LogEntry);
  constructor(id: string, date: Date, tags: string[], subject: string, message: string, extra?: string);
  constructor(logEntryOrId?: LogEntry | string, date?: Date, tags?: string[], subject?: string, message?: string, extra?: string) {
    if(logEntryOrId instanceof LogEntry) {
      const other = logEntryOrId as LogEntry;
      this.id = other.id;
      this.date = new Date(other.date.getTime());
      this.tags = other.tags.slice();
      this.subject = other.subject;
      this.message = other.message;
      this.extra = other.extra;
    } else {
      this.id = logEntryOrId as string || '';
      this.date = new Date();
      this.tags = tags ? tags.slice() : [];
      this.subject = subject || '';
      this.message = message || '';
      this.extra = extra || '';
    }
  }


  toAny(): any {
    return {
      id: this.id,
      date: new Date(this.date.getTime()),
      tags: this.tags.slice(),
      subject: this.subject,
      message: this.message,
      extra: this.extra
    };
  }
}
