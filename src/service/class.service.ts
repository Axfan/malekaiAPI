import * as r from 'rethinkdb';
import * as DataLoader from 'dataloader';
import { DatabaseService as db } from './database.service';

import { Class } from '../data';
import { Rejection } from '../data/internal';

import { bindLogger } from '../util/logger';

export class ClassService {

  private static loader = new DataLoader<string, Class>(k => ClassService.batchLoad(k));

  public static get table(): r.Table { return db.classes; }
  public static l = bindLogger('ClassService');

  public static getAll(): Promise<Class[]> {
    return new Promise<Class[]>((resolve, reject) => {
      db.run(this.table).then((result: any[]) => {
        resolve(result.map(o => Class.fromDBO(o)));
      }).catch(err => reject(new Rejection(err)));
    });
  }

  private static batchLoad(keys: string[]): Promise<(Class | Error)[]> {
    return db.run(this.table.getAll(...keys)).then((res: any[]) => {
      res = res.map(a => Class.fromDBO(a));
      const idxRes = new Map<string, Class>();
      for(const a of res)
        idxRes.set(a.id, a);
      return keys.map(k => {
        const a = idxRes.get(k);
        if(!a) this.l.error(`Class not found with id "${k}"`);
        return a;
      });
    });
  }

  public static load(key: string): Promise<Class>;
  public static load(keys: string[]): Promise<Class[]>;
  public static load(keys: string | string[]): Promise<Class | Class[]> {
    if(keys instanceof Array) return this.loader.loadMany(keys).then(a => a.filter(b => b));
    else return this.loader.load(keys as string);
  }

  public static get(id: string): Promise<Class> {
    return new Promise<Class>((resolve, reject) => {
      db.run(this.table.get(id)).then(result => {
        if(!result) { reject(new Rejection('Class not found with id ' + id, 404)); return; }
        resolve(Class.fromDBO(result));
      }, err => reject(new Rejection(err)));
    });
  }

  public static getMany(ids: string[]): Promise<Class[]> {
    return new Promise<Class[]>((resolve, reject) => {
      const col = r.expr(ids);
      db.run(this.table.filter((doc) => col.contains(doc('id')))).then((results: any[]) => {
        if(results && results instanceof Array && results.length > 0) resolve(results.map(a => Class.fromDBO(a)));
        else resolve([]); // reject(new Rejection('No classes found for names ' + names.join(', '), 404));
      });
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
      db.run(this.table.filter((doc) => col.contains(doc('name')))).then((results: any[]) => {
        if(results && results instanceof Array && results.length > 0) resolve(results.map(a => Class.fromDBO(a)));
        else resolve([]); // reject(new Rejection('No classes found for names ' + names.join(', '), 404));
      });
    });
  }
}
