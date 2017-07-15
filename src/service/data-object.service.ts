import * as r from 'rethinkdb';
import * as DataLoader from 'dataloader';
import { DatabaseService as db } from './database.service';

import { IDataObject } from '../data/interfaces';
import { Rejection } from '../data/internal';
import { DataParser } from '../util';

import { bindLogger } from '../util/logger';

export class DataObjectService {

  private static loader = new DataLoader<string, IDataObject>(k => DataObjectService.batchLoad(k));

  public static get table(): r.Sequence { return db.dataUnion; }
  public static l = bindLogger('DataObjectService');

  private static batchLoad(keys: string[]): Promise<(IDataObject | Error)[]> {
    const col = r.expr(keys);
    return db.run(this.table.filter((doc) => col.contains(doc('id')))).then((res: any[]) => {
      res = res.map(a => DataParser.parseDBO(a));
      const idxRes = new Map<string, IDataObject>();
      for(const a of res)
        idxRes.set(a.id, a);
      return keys.map(k => {
        const a = idxRes.get(k);
        if(!a) this.l.error(`Data Object not found with id "${k}"`);
        return a;
      });
    });
  }

  public static load(key: string): Promise<IDataObject>;
  public static load(keys: string[]): Promise<IDataObject[]>;
  public static load(keys: string | string[]): Promise<IDataObject | IDataObject[]> {
    if(keys instanceof Array) return this.loader.loadMany(keys).then(a => a.filter(b => b));
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
