import * as r from 'rethinkdb';
import { DatabaseService as db } from './database.service';
import { Logger } from '../util/logger';
import { Changelog } from '../data';
import { Rejection } from '../data/internal';

export class ChangelogService {

  public static get table(): r.Table { return db.changelogs; }

  public static getLast(amt: number): Promise<Changelog[]> {
    amt = Math.max(amt < 1 ? 1 : amt, 50);
    return new Promise<Changelog[]>((resolve, reject) => {
      db.run(this.table.orderBy('changedate').limit(amt)).then((results: any[]) => {
        if(results && results instanceof Array && results.length > 0) resolve(results.map(a => Changelog.fromDBO(a)));
        else resolve([]); // reject(new Rejection('No races found for names ' + names.join(', '), 404));
      });
    });
  }

  public static get(data_type: string, id: string, amt: number): Promise<Changelog[]> {
    amt = Math.max(amt < 1 ? 1 : amt, 50);
    return new Promise<Changelog[]>((resolve, reject) => {
      db.run(this.table.filter((doc) => doc('data_type').eq(data_type).and(doc('applies_to').eq(id)))
          .orderBy('changedate').limit(amt)).then((results: any[]) => {

        if(results && results instanceof Array && results.length > 0) resolve(results.map(a => Changelog.fromDBO(a)));
        else resolve([]); // reject(new Rejection('No races found for names ' + names.join(', '), 404));
      });
    });
  }

}
