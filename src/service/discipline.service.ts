import * as r from 'rethinkdb';
import * as DataLoader from 'dataloader';
import { DatabaseService as db } from './database.service';

import { Discipline } from '../data';
import { Rejection } from '../data/internal';

export class DisciplineService {

  private static loader = new DataLoader<string, Discipline>(k => DisciplineService.batchLoad(k));

  public static get table(): r.Table { return db.disciplines; }

  private static batchLoad(keys: string[]): Promise<(Discipline | Error)[]> {
    return db.run(this.table.getAll(...keys)).then((res: any[]) => {
      res = res.map(a => Discipline.fromDBO(a));
      const idxRes = new Map<string, Discipline>();
      for(const a of res)
        idxRes.set(a.id, a);
      return keys.map(k => {
        const a = idxRes.get(k);
        if(!a) console.error(`Discipline not found with id "${k}"`);
        return a;
      });
    });
  }

  public static load(key: string): Promise<Discipline>;
  public static load(keys: string[]): Promise<Discipline[]>;
  public static load(keys: string | string[]): Promise<Discipline | Discipline[]> {
    if(keys instanceof Array) return this.loader.loadMany(keys).then(a => a.filter(b => b));
    else return this.loader.load(keys as string);
  }

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
