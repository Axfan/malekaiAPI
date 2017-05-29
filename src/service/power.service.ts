import * as r from 'rethinkdb';
import { DatabaseService as db } from './database.service';

import { Power } from '../data';
import { Rejection } from '../data/internal';

export class PowerService {

  public static get table(): r.Table { return db.powers; }

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
}
