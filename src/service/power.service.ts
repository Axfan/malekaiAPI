import * as r from 'rethinkdb';
import { DatabaseService as db } from './database.service';

import { IDataObject } from '../data/interfaces';
import { Power } from '../data';
import { Rejection } from '../data/internal';
import { DataParser } from '../util';

export class PowerService {

  public static get table(): r.Table { return db.powers; }

  public static get parentUnion(): r.Sequence {
    return (db.races as any).union(db.classes, db.disciplines);
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

  public static getSource(power: Power): Promise<IDataObject> { // unused atm (currently using DataObjectService)
    return new Promise<IDataObject>((resolve, reject) => {
      db.run(this.parentUnion.filter(doc => doc('name').eq(power.source))).then((result: any[]) => {
        if(result && result instanceof Array && result.length > 0) resolve(DataParser.parseDBO(result[0]));
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
