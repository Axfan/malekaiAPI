import * as r from 'rethinkdb';
import * as DataLoader from 'dataloader';
import { DatabaseService as db } from './database.service';

import { IDataObject } from '../data/interfaces';
import { Guild } from '../data';
import { Rejection } from '../data/internal';
import { DataUtil } from '../util';
import { bindLogger} from '../util/logger';

export class GuildService {

  private static loader = new DataLoader<string, Guild>(k => GuildService.batchLoad(k));

  public static get table(): r.Table { return db.guilds; }
  public static l = bindLogger('DisciplineService');

  private static batchLoad(keys: string[]): Promise<(Guild | Error)[]> {
    return db.run(this.table.getAll(...keys)).then((res: any[]) => {
      res = res.map(a => Guild.fromDBO(a));
      const idxRes = new Map<string, Guild>();
      for(const a of res)
        idxRes.set(a.id, a);
      return keys.map(k => {
        const a = idxRes.get(k);
        if(!a) this.l.error(`Guild not found with id "${k}"`);
        return a;
      });
    });
  }

  public static load(key: string): Promise<Guild>;
  public static load(keys: string[]): Promise<Guild[]>;
  public static load(keys: string | string[]): Promise<Guild | Guild[]> {
    if(keys instanceof Array) return this.loader.loadMany(keys).then(a => a.filter(b => b));
    else return this.loader.load(keys as string);
  }

  public static getAll(): Promise<Guild[]> {
    return new Promise<Guild[]>((resolve, reject) => {
      db.run(this.table).then((results: any[]) => {
        resolve(results.map(o => Guild.fromDBO(o)));
      }).catch(err => reject(new Rejection(err)));
    });
  }

  public static get(id: string): Promise<Guild> {
    return new Promise<Guild>((resolve, reject) => {
      db.run(this.table.get(id)).then((result: r.Cursor) => {
        if(!result) { reject(new Rejection('Guild not found with id ' + id, 404)); return; }
        resolve(Guild.fromDBO(result));
      }, err => reject(new Rejection(err)));
    });
  }

  public static getMany(ids: string[]): Promise<Guild[]> {
    return new Promise<Guild[]>((resolve, reject) => {
      const col = r.expr(ids);
      db.run(this.table.filter((doc) => col.contains(doc('id')))).then((results: any[]) => {
        if(results && results instanceof Array && results.length > 0) resolve(results.map(a => Guild.fromDBO(a)));
        else resolve([]); // reject(new Rejection('No races found for names ' + names.join(', '), 404));
      });
    });
  }

  public static getFromName(name: string): Promise<Guild> {
    return new Promise<Guild>((resolve, reject) => {
      db.run(this.table.filter((doc) => doc('name').eq(name))).then((result: any[]) => {
        if(result && result instanceof Array && result.length > 0) resolve(Guild.fromDBO(result[0]));
        else reject(new Rejection('No guild found for name ' + name, 404));
      });
    });
  }

  public static getFromNames(names: string[]): Promise<Guild[]> {
    return new Promise<Guild[]>((resolve, reject) => {
      const col = r.expr(names);
      db.run(this.table.filter((doc) => col.contains(doc('name')))).then((results: any[]) => {
        if(results && results instanceof Array && results.length > 0) resolve(results.map(a => Guild.fromDBO(a)));
        else resolve([]); // reject(new Rejection('No guilds found for names ' + names.join(', '), 404));
      });
    });
  }
}
