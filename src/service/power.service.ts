import * as r from 'rethinkdb';
import * as DataLoader from 'dataloader';
import { DatabaseService as db } from './database.service';

import { IDataObject } from '../data/interfaces';
import { Power } from '../data';
import { Rejection } from '../data/internal';
import { DataParser } from '../util';

export class PowerService {

  private static loader = new DataLoader<string, Power>(k => PowerService.batchLoad(k));

  public static get table(): r.Table { return db.powers; }

  public static get parentUnion(): r.Sequence {
    return (db.races as any).union(db.classes, db.disciplines);
  }

  private static batchLoad(keys: string[]): Promise<(Power | Error)[]> {
    return db.run(this.table.getAll(...keys)).then((res: any[]) => {
      res = res.map(a => Power.fromDBO(a));
      const idxRes = new Map<string, Power>();
      for(const a of res)
        idxRes.set(a.id, a);
      return keys.map(k => {
        const a = idxRes.get(k);
        if(!a) console.error(`Power not found with id "${k}"`);
        return a;
      });
    });
  }

  public static load(key: string): Promise<Power>;
  public static load(keys: string[]): Promise<Power[]>;
  public static load(keys: string | string[]): Promise<Power | Power[]> {
    if(keys instanceof Array) return this.loader.loadMany(keys).then(a => a.filter(b => b));
    else return this.loader.load(keys as string);
  }

  public static getAll(): Promise<Power[]> {
    return new Promise<Power[]>((resolve, reject) => {
      db.run(this.table).then((results: any[]) => {
        resolve(results.map(o => Power.fromDBO(o)));
      }).catch(err => reject(new Rejection(err)));
    });
  }

  public static get(id: string): Promise<Power> {
    return new Promise<Power>((resolve, reject) => {
      db.run(this.table.get(id)).then((result: r.Cursor) => {
        if(!result) { reject(new Rejection('Power not found with id ' + id, 404)); return; }
        resolve(Power.fromDBO(result));
      }, err => reject(new Rejection(err)));
    });
  }

  public static getMany(ids: string[]): Promise<Power[]> {
    return new Promise<Power[]>((resolve, reject) => {
      const col = r.expr(ids);
      db.run(this.table.filter((doc) => col.contains(doc('id') as any))).then((results: any[]) => {
        if(results && results instanceof Array && results.length > 0) resolve(results.map(a => Power.fromDBO(a)));
        else resolve([]); // reject(new Rejection('No races found for names ' + names.join(', '), 404));
      });
    });
  }

  public static getSources(power: Power): Promise<IDataObject[]> { // unused atm (currently using DataObjectService)
    return new Promise<IDataObject[]>((resolve, reject) => {
      const col = r.expr(power.sources) as any;
      db.run(this.parentUnion.filter(
            doc => col.contains(a => a('type').eq(doc('data_type')).and(a('id').eq(doc('id'))))
          )).then((results: any[]) => {
        if(results && results instanceof Array && results.length > 0) resolve(results.map(a => DataParser.parseDBO(a)));
        else reject(new Rejection('No sources found for power ' + power.id, 404));
      })
    });
  }

  public static getFromName(name: string): Promise<Power> {
    return new Promise<Power>((resolve, reject) => {
      db.run(this.table.filter((doc) => doc('name').eq(name))).then((result: any[]) => {
        if(result && result instanceof Array && result.length > 0) resolve(Power.fromDBO(result[0]));
        else reject(new Rejection('No discipline found for name ' + name, 404));
      });
    });
  }

  public static getFromNames(names: string[]): Promise<Power[]> {
    return new Promise<Power[]>((resolve, reject) => {
      const col = r.expr(names);
      db.run(this.table.filter((doc) => col.contains(doc('name') as any))).then((results: any[]) => {
        if(results && results instanceof Array && results.length > 0) resolve(results.map(a => Power.fromDBO(a)));
        else resolve([]); // reject(new Rejection('No powers found for names ' + names.join(', '), 404));
      });
    });
  }
}
