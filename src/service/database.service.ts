import { Db, Table, Connection } from 'rethinkdb';
import * as r from 'rethinkdb';
import { DbPool } from '../data/internal';
import { series } from 'async';


export class DatabaseService {

  private static pool: DbPool;

  public static get dbName(): string { return 'crowfallData'; } /// @todo: adjust via env

  public static get db(): Db { return r.db(this.dbName); }

  public static get races(): Table { return this.db.table('raceLibrary'); }
  public static get classes(): Table { return this.db.table('classLibrary'); }
  public static get disciplines(): Table { return this.db.table('disciplineLibrary'); }
  public static get powers(): Table { return this.db.table('powerLibrary'); }

  public static get dataUnion(): r.Sequence {
    return (this.races as any).union(this.classes, this.disciplines, this.powers);
  }

  public static get log(): Table { return this.db.table('apiLog'); }
  public static get issues(): Table { return this.db.table('issues'); }

  public static run<T>(query: r.Operation<T>): Promise<T | any[]> {
    return this.pool.run(query);
  }

  public static init(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.pool = new DbPool({
        host: '127.0.0.1',
        port: 28015
      });
      Promise.all([
        this.initData('raceLibrary'),
        this.initData('classLibrary'),
        this.initData('disciplineLibrary'),
        this.initData('powerLibrary'),
        this.initLog(),
        this.initIssues(),
      ]).then(() => resolve()).catch(err => { reject(err); return; });
    });
  }

  private static initData(name: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.run(this.db.tableList()).then((result: string[]) => {

        if(result.findIndex(t => t === name) < 0) {
          this.run(this.db.tableCreate(name))
              .then(table => resolve()); // or put in sample data

        } else resolve(); // or put in sample data

      }).catch(err => reject(err));
    });
  }

  private static initLog(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.run(this.db.tableList()).then((list: string[]) => {

        if(list.findIndex(t => t === 'apiLog') < 0) {
          this.run(this.db.tableCreate('apiLog')).then(table => {
            (this.log as any).indexCreate('tags', { multi: true }).run()
              .then(result => resolve());
          });
        } else resolve();
      }).catch(err => reject(err));
    });
  }

  private static initIssues(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.run(this.db.tableList()).then((list: string[]) => {

        if(list.findIndex(t => t === 'issues') < 0) {
          this.run(this.db.tableCreate('issues'))
            .then(table => resolve()); // or index things
        } else resolve(); // or index things
      }).catch(err => reject(err));
    });
  }
}
