import * as r from 'rethinkdb';
import * as DataLoader from 'dataloader';
import { DatabaseService as db } from './database.service';

import { Race } from '../data';
import { Rejection } from '../data/internal';

export class RaceService {

  private static loader = new DataLoader<string, Race>(k => RaceService.batchLoad(k));

  public static get table(): r.Table { return db.races; }

  private static batchLoad(keys: string[]): Promise<(Race | Error)[]> {
    return db.run(this.table.getAll(...keys)).then((res: Race[]) => {
      const idxRes = new Map<string, Race>();
      for(const r of res)
        idxRes.set(r.id, r);
      return keys.map(k => {
        const r = idxRes.get(k);
        if(!r) console.error(`Race not found with id "${k}"`);
        return r;
      });
    });
  }

  public static load(key: string): Promise<Race>;
  public static load(keys: string[]): Promise<Race[]>;
  public static load(keys: string | string[]): Promise<Race | Race[]> {
    if(keys instanceof Array) return this.loader.loadMany(keys).then(a => a.filter(b => b));
    else return this.loader.load(keys as string);
  }

  public static getAll(): Promise<Race[]> {
    return new Promise<Race[]>((resolve, reject) => {
      db.run(this.table).then((results: any[]) => {
        resolve(results.map(o => Race.fromDBO(o)));
      }).catch(err => reject(new Rejection(err)));
    });
  }

  public static get(id: string): Promise<Race> {
    return new Promise<Race>((resolve, reject) => {
      db.run(this.table.get(id)).then((result: r.Cursor) => {
        if(result) resolve(Race.fromDBO(result));
        else reject(new Rejection('Race not found with id ' + id, 404));
      }, err => reject(new Rejection(err)));
    });
  }

  public static getMany(ids: string[]): Promise<Race[]> {
    return new Promise<Race[]>((resolve, reject) => {
      const col = r.expr(ids);
      db.run(this.table.filter((doc) => col.contains(doc('id') as any))).then((results: any[]) => {
        if(results && results instanceof Array && results.length > 0) resolve(results.map(a => Race.fromDBO(a)));
        else resolve([]); // reject(new Rejection('No races found for names ' + names.join(', '), 404));
      });
    });
  }

  public static getFromNames(names: string[]): Promise<Race[]> {
    return new Promise<Race[]>((resolve, reject) => {
      const col = r.expr(names);
      db.run(this.table.filter((doc) => col.contains(doc('name') as any))).then((results: any[]) => {
        if(results && results instanceof Array && results.length > 0) resolve(results.map(a => Race.fromDBO(a)));
        else resolve([]); // reject(new Rejection('No races found for names ' + names.join(', '), 404));
      });
    });
  }

  public static getFromName(name: string): Promise<Race> {
    return new Promise<Race>((resolve, reject) => {
      db.run(this.table.filter((doc) => doc('name').eq(name))).then((result: any[]) => {
        if(result && result instanceof Array && result.length > 0) resolve(Race.fromDBO(result[0]));
        else reject(new Rejection('No race found for name ' + name, 404));
      });
    });
  }
}
