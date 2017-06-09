import * as r from 'rethinkdb';
import { DatabaseService as db } from './database.service';

import { Discipline } from '../data';
import { Rejection } from '../data/internal';

export class DisciplineService {

  public static get table(): r.Table { return db.disciplines; }

  public static getAll(): Promise<Discipline[]> {
    return new Promise<Discipline[]>((resolve, reject) => {
      db.run(this.table).then((results: any[]) => {
        resolve(results.map(o => Discipline.fromDBO(o)));
      }).catch(err => reject(new Rejection(err)));
    });
  }

  public static get(id: string): Promise<Discipline> {
    return new Promise<Discipline>((resolve, reject) => {
      db.run(this.table.get(id)).then((result: r.Cursor) => {
        if(!result) { reject(new Rejection('Discipline not found with id ' + id, 404)); return; }
        resolve(Discipline.fromDBO(result));
      }, err => reject(new Rejection(err)));
    });
  }

  public static getFromName(name: string): Promise<Discipline> {
    return new Promise<Discipline>((resolve, reject) => {
      db.run(this.table.filter((doc) => doc('name').eq(name))).then((result: any[]) => {
        if(result && result instanceof Array && result.length > 0) resolve(Discipline.fromDBO(result[0]));
        else reject(new Rejection('No discipline found for name ' + name, 404));
      });
    });
  }
}
