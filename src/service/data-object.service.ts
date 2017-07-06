import * as r from 'rethinkdb';
import * as DataLoader from 'dataloader';
import { DatabaseService as db } from './database.service';

import { IDataObject } from '../data/interfaces';
import { Race, Class, Discipline, Power } from '../data';
import { Rejection } from '../data/internal';
import { DataParser } from '../util';

export class DataObjectService {

  private static loader = new DataLoader<string, Power>(k => DataObjectService.batchLoad(k));

  public static get table(): r.Sequence { return db.dataUnion; }

  private static batchLoad(keys: string[]): Promise<(IDataObject | Error)[]> {
    const col = r.expr(keys);
    return db.run(this.table.filter((doc) => col.contains(doc('id') as any))).then((res: IDataObject[]) => {
      const idxRes = new Map<string, IDataObject>();
      for(const r of res)
        idxRes.set(r.id, r);
      return keys.map(k => idxRes.get(k) || new Error('Key not found: ' + k));
    });
  }

  public static load(key: string): Promise<IDataObject>;
  public static load(keys: string[]): Promise<IDataObject[]>;
  public static load(keys: string | string[]): Promise<IDataObject | IDataObject[]> {
    if(keys instanceof Array) return this.loader.loadMany(keys);
    else return this.loader.load(keys as string);
  }

  public static getAll(): Promise<IDataObject[]> { // God help us all if you do that
    return new Promise<IDataObject[]>((resolve, reject) => {
      db.run(this.table).then((result: any[]) => {
        resolve(result.map(o => DataParser.parseDBO(o)));
      }).catch(err => reject(new Rejection(err)));
    });
  }

  public static get(id: string): Promise<IDataObject> {
    return new Promise<IDataObject>((resolve, reject) => {
      db.run(this.table.filter(doc => doc('id').eq(id))).then((results: any[]) => {
        if(results && results instanceof Array && results.length > 0) resolve(DataParser.parseDBO(results[0]));
        else reject(new Rejection('No data object found for id ' + id, 404));
      }, err => reject(new Rejection(err)));
    });
  }

  public static getFromName(name: string): Promise<IDataObject> {
    return new Promise<IDataObject>((resolve, reject) => {
      db.run(this.table.filter((doc) => doc('name').eq(name))).then((result: any[]) => {
        if(result && result instanceof Array && result.length > 0) resolve(DataParser.parseDBO(result[0]));
        else reject(new Rejection('No data object found for name ' + name, 404));
      });
    });
  }
}
