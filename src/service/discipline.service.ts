import * as r from 'rethinkdb';
import * as DataLoader from 'dataloader';
import { DatabaseService as db } from './database.service';

import { Discipline } from '../data';
import { Rejection } from '../data/internal';
import { bindLogger } from '../util/logger';

export class DisciplineService {

  private static loader = new DataLoader<string, Discipline>(k => DisciplineService.batchLoad(k));

  public static get table(): r.Table { return db.disciplines; }
  public static l = bindLogger('DisciplineService');

  private static batchLoad(keys: string[]): Promise<(Discipline | Error)[]> {
    return db.run(this.table.getAll(...keys)).then((res: any[]) => {
      res = res.map(a => Discipline.fromDBO(a));
      const idxRes = new Map<string, Discipline>();
      for(const a of res)
        idxRes.set(a.id, a);
      return keys.map(k => {
        const a = idxRes.get(k);
        if(!a) this.l.error(`Discipline not found with id "${k}"`);
        return a;
      });
    });
  }

  public static load(key: string, options?: { exclude?: string[], include?: string[] }): Promise<Discipline>;
  public static load(keys: string[], options?: { exclude?: string[], include?: string[] }): Promise<Discipline[]>;
  public static load(keys: string | string[], options?: { exclude?: string[], include?: string[] }): Promise<Discipline | Discipline[]> {
    if(keys instanceof Array) return this.loader.loadMany(keys).then(a => a.filter(b => {
      if(options) {
        if(options.include) {
          return b && options.include.indexOf(b.type) >= 0 ? true : false;
        } else if (options.exclude) {
          return b && options.exclude.indexOf(b.type) < 0 ? true : false;
        }
      }
      return b ? true : false;
    }));
    else return this.loader.load(keys as string);
  }

  public static getAll(options?: { exclude?: string[], include?: string[] }): Promise<Discipline[]> {
    return new Promise<Discipline[]>((resolve, reject) => {
      let foo: (d: Discipline) => boolean;
      if(options) {
        if(options.include) foo = (d) => options.include.indexOf(d.type) >= 0;
        else if(options.exclude) foo = (d) => options.exclude.indexOf(d.type) < 0;
      }
      if(!foo) foo = (d) => d ? true : false;

      db.run(this.table).then((results: any[]) => {
        resolve(results.map(o => Discipline.fromDBO(o)).filter(foo));
      }).catch(err => reject(new Rejection(err)));
    });
  }

  public static get(id: string, options?: { exclude?: string[], include?: string[] }): Promise<Discipline> {
    return new Promise<Discipline>((resolve, reject) => {
      db.run(this.table.get(id)).then((result: r.Cursor) => {
        if(!result) { reject(new Rejection('Discipline not found with id ' + id, 404)); return; }
        const disc = Discipline.fromDBO(result);
        if(options) {
          if(options.include && options.include.indexOf(disc.type) < 0) {
            reject(new Rejection('Discipline of type(s) ' + options.include.join(', ') + ' not found with id ' + id, 404)); return;
          } else if(options.exclude && options.exclude.indexOf(disc.type) >= 0) {
            reject(new Rejection('Discipline of not-type(s) ' + options.exclude.join(', ') + ' not found with id ' + id, 404)); return;
          }
        }
        resolve(disc);
      }, err => reject(new Rejection(err)));
    });
  }

  public static getFromName(name: string, options?: { exclude?: string[], include?: string[] }): Promise<Discipline> {
    return new Promise<Discipline>((resolve, reject) => {
      let foo: (doc: r.Expression<any>) => r.Expression<boolean>;
      if(options) {
        if(options.include) {
          const col = r.expr(options.include);
          foo = (doc) => doc('name').eq(name).and(col.contains(doc('type')));
        } else if(options.exclude) {
          const col = r.expr(options.exclude);
          foo = (doc) => doc('name').eq(name).and(r.not(col.contains(doc('type'))));
        }
      }
      if(!foo) foo = (doc) => doc('name').eq(name);

      db.run(this.table.filter(foo)).then((result: any[]) => {
        if(result && result instanceof Array && result.length > 0) resolve(Discipline.fromDBO(result[0]));
        else reject(new Rejection('No discipline found for name ' + name, 404));
      });
    });
  }
}
