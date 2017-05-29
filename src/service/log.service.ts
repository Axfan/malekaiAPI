import * as r from 'rethinkdb';
import { DatabaseService as db } from './database.service';

import { LogEntry, Rejection } from '../data/internal';

export class LogService {

  public static get table(): r.Table { return db.log; }

  public static getAll(): Promise<LogEntry[]> {
    return new Promise<LogEntry[]>((resolve, reject) => {
      db.run(this.table)
          .then((result: any[]) => resolve(result.map(o => LogEntry.fromAny(o)))
      ).catch(err => reject(new Rejection(err)));
    });
  }

  public static create(logEntry: LogEntry): Promise<LogEntry> {
    return new Promise<LogEntry>((resolve, reject) => {
      const data = logEntry.toAny();
      delete data.id;

      db.run(this.table.insert(data)).then((result: r.WriteResult) => {
          data.id = result.generated_keys[0];
          resolve(LogEntry.fromAny(data));
        }, err => reject(new Rejection(err)));
    });
  }
}
