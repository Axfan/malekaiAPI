import * as r from 'rethinkdb';
import { DatabaseService as db } from './database.service';
import { Logger } from '../util/logger';
import { Changelog } from '../data';
import { Rejection } from '../data/internal';

export class ChangelogService {

  public static get table(): r.Table { return db.changelogs; }

  public static getLast(skip: number, amt: number): Promise<Changelog[]> {

    console.log(skip, amt, typeof skip, typeof amt);

    skip = skip || 0;
    amt = (amt == null || typeof amt !== 'number') ? 50 : amt;
    amt = Math.min(amt < 1 ? 1 : amt, 50);

    let cmd = this.table.orderBy('changedate').limit(amt);
    if(skip) cmd = cmd.skip(skip);
    cmd = cmd.limit(amt);

    console.log(skip, amt, typeof skip, typeof amt, '==');

    return new Promise<Changelog[]>((resolve, reject) => {
      db.run(cmd).then((results: any[]) => {
        if(results && results instanceof Array && results.length > 0) resolve(results.map(a => Changelog.fromDBO(a)));
        else resolve([]); // reject(new Rejection('No races found for names ' + names.join(', '), 404));
      });
    });
  }

  public static get(data_type: string, id: string, skip: number, amt: number): Promise<Changelog[]> {
    skip = skip || 0;
    amt = (amt == null || typeof amt !== 'number') ? 50 : amt;
    amt = Math.min(amt < 1 ? 1 : amt, 50);

    let cmd = this.table.filter((doc) => doc('data_type').eq(data_type).and(doc('applies_to').eq(id))).orderBy('changedate');
    if(skip) cmd = cmd.skip(skip);
    cmd = cmd.limit(amt);

    return new Promise<Changelog[]>((resolve, reject) => {
      db.run(cmd).then((results: any[]) => {
        if(results && results instanceof Array && results.length > 0) resolve(results.map(a => Changelog.fromDBO(a)));
        else resolve([]); // reject(new Rejection('No races found for names ' + names.join(', '), 404));
      });
    });
  }

}
