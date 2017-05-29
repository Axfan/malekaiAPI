import * as r from 'rethinkdb';
import { DatabaseService as db } from './database.service';

import { Race } from '../data';
import { Rejection } from '../data/internal';

export class RaceService {

  public static get table(): r.Table { return db.races; }

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
        if(!result) { reject(new Rejection('Race not found with id ' + id, 404)); return; }
        resolve(Race.fromDBO(result));
      }, err => reject(new Rejection(err)));
    });
  }
}
