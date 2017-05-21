import { Connection, Db, Table } from 'rethinkdb';
import { DatabaseService } from './database.service';

import { Power } from '../data';
import { Rejection } from '../data/internal';

export class PowerService {

  public static get connection(): Connection { return DatabaseService.connection; }
  public static get table(): Table { return DatabaseService.powers; }

  public static getAll(): Promise<Power[]> {
    return new Promise<Power[]>((resolve, reject) => {
      this.table.run(this.connection).then(cursor => {
        cursor.toArray().then(arr => {
          resolve(arr.map(o => Power.fromDBO(o)));
        });
      }).catch(err => reject(new Rejection(err)));
    });
  }

  public static get(id: string): Promise<Power> {
    return new Promise<Power>((resolve, reject) => {
      this.table.get(id).run(this.connection).then(result => {
        if(!result) { reject(new Rejection('Power not found with id ' + id, 404)); return; }
        resolve(Power.fromDBO(result));
      }, err => reject(new Rejection(err)));
    });
  }
}
