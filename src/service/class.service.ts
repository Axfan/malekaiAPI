import * as r from 'rethinkdb';
import { DatabaseService as db } from './database.service';

import { Class } from '../data';
import { Rejection } from '../data/internal';

export class ClassService {

  public static get table(): r.Table { return db.classes; }

  public static getAll(): Promise<Class[]> {
    return new Promise<Class[]>((resolve, reject) => {
      db.run(this.table).then((result: any[]) => {
        resolve(result.map(o => Class.fromDBO(o)));
      }).catch(err => reject(new Rejection(err)));
    });
  }

  public static get(id: string): Promise<Class> {
    return new Promise<Class>((resolve, reject) => {
      db.run(this.table.get(id)).then(result => {
        if(!result) { reject(new Rejection('Class not found with id ' + id, 404)); return; }
        resolve(Class.fromDBO(result));
      }, err => reject(new Rejection(err)));
    });
  }
}
