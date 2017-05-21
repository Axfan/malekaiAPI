import { Connection, Db, Table } from 'rethinkdb';
import { DatabaseService } from './database.service';

import { Race } from '../data';
import { Rejection } from '../data/internal';

export class RaceService {

  public static get connection(): Connection { return DatabaseService.connection; }
  public static get table(): Table { return DatabaseService.races; }

  public static getAll(): Promise<Race[]> {
    return new Promise<Race[]>((resolve, reject) => {
      this.table.run(this.connection).then(cursor => {
        cursor.toArray().then(arr => {
          resolve(arr.map(o => Race.fromDBO(o)));
        });
      }).catch(err => reject(new Rejection(err)));
    });
  }

  public static get(id: string): Promise<Race> {
    return new Promise<Race>((resolve, reject) => {
      this.table.get(id).run(this.connection).then(result => {
        if(!result) { reject(new Rejection('Race not found with id ' + id, 404)); return; }
        resolve(Race.fromDBO(result));
      }, err => reject(new Rejection(err)));
    });
  }
}
