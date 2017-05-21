import { Connection, Db, Table } from 'rethinkdb';
import { DatabaseService } from './database.service';

import { Discipline } from '../data';
import { Rejection } from '../data/internal';

export class DisciplineService {

  public static get connection(): Connection { return DatabaseService.connection; }
  public static get table(): Table { return DatabaseService.disciplines; }

  public static getAll(): Promise<Discipline[]> {
    return new Promise<Discipline[]>((resolve, reject) => {
      this.table.run(this.connection).then(cursor => {
        cursor.toArray().then(arr => {
          resolve(arr.map(o => Discipline.fromDBO(o)));
        });
      }).catch(err => reject(new Rejection(err)));
    });
  }

  public static get(id: string): Promise<Discipline> {
    return new Promise<Discipline>((resolve, reject) => {
      this.table.get(id).run(this.connection).then(result => {
        if(!result) { reject(new Rejection('Discipline not found with id ' + id, 404)); return; }
        resolve(Discipline.fromDBO(result));
      }, err => reject(new Rejection(err)));
    });
  }
}
