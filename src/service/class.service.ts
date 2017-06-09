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

  public static getFromName(name: string): Promise<Class> {
    return new Promise<Class>((resolve, reject) => {
      db.run(this.table.filter((doc) => doc('name').eq(name))).then((result: any[]) => {
        if(result && result instanceof Array && result.length > 0) resolve(Class.fromDBO(result[0]));
        else reject(new Rejection('No class found for name ' + name, 404));
      });
    });
  }

  public static getFromNames(names: string[]): Promise<Class[]> {
    return new Promise<Class[]>((resolve, reject) => {
      const col = r.expr(names);
      db.run(this.table.filter((doc) => col.contains(doc('name') as any))).then((results: any[]) => {
        if(results && results instanceof Array && results.length > 0) resolve(results.map(a => Class.fromDBO(a)));
        else resolve([]); // reject(new Rejection('No classes found for names ' + names.join(', '), 404));
      });
    });
  }
}
