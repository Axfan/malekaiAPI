import { Connection, Db, Table } from 'rethinkdb';
import { DatabaseService } from './database.service';

import { Class } from '../data';
import { Rejection } from '../data/internal';

export class ClassService {

  public static get connection(): Connection { return DatabaseService.connection; }
  public static get table(): Table { return DatabaseService.classes; }

  public static getAll(): Promise<Class[]> {
    return new Promise<Class[]>((resolve, reject) => {
      this.table.run(this.connection).then(cursor => {
        cursor.toArray().then(arr => {
          resolve(arr.map(o => Class.fromDBO(o)));
        });
      }).catch(err => reject(new Rejection(err)));
    });
  }

  public static get(id: string): Promise<Class> {
    return new Promise<Class>((resolve, reject) => {
      this.table.get(id).run(this.connection).then(result => {
        if(!result) { reject(new Rejection('Class not found with id ' + id, 404)); return; }
        resolve(Class.fromDBO(result));
      }, err => reject(new Rejection(err)));
    });
  }
}
