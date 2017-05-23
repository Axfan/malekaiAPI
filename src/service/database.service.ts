import { Db, Table, Connection } from 'rethinkdb';
import * as rethinkdb from 'rethinkdb';
import { series } from 'async';

export class DatabaseService {

  private static _connection: Connection;
  public static get connection() { return this._connection; }

  public static get dbName(): string { return 'crowfallData'; } /// @todo: adjust via env

  public static _r: typeof rethinkdb = rethinkdb
  public static get r(): typeof rethinkdb { return this._r; }

  public static get db(): Db { return this.r.db(this.dbName); }

  public static get races(): Table { return this.db.table('raceLibrary'); }
  public static get classes(): Table { return this.db.table('classLibrary'); }
  public static get disciplines(): Table { return this.db.table('disciplineLibrary'); }
  public static get powers(): Table { return this.db.table('powerLibrary'); }

  public static get log(): Table { return this.db.table('apiLog'); }
  public static get issues(): Table { return this.db.table('issues'); }

  public static init(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.r.connect({
        host: '127.0.0.1',
        port: 28015
      }).then(conn => {
        conn.use(this.dbName);
        this._connection = conn;
        Promise.all([
          this.initData('raceLibrary'),
          this.initData('classLibrary'),
          this.initData('disciplineLibrary'),
          this.initData('powerLibrary'),
          this.initLog(),
          this.initIssues(),
        ]).then(() => resolve());
      }).catch(err => { reject(err); return; });
    });
  }

  private static initData(name: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.db.tableList().run(this.connection).then(result => {

        if(result.findIndex(t => t === name) < 0) {
          this.db.tableCreate(name).run(this.connection)
              .then(table => resolve()); // or put in sample data

        } else resolve(); // or put in sample data

      }).catch(err => reject(err));
    });
  }

  private static initLog(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.db.tableList().run(this.connection).then(list => {

        if(list.findIndex(t => t === 'apiLog') < 0) {
          this.db.tableCreate('apiLog').run(this.connection).then(table => {
            (this.log as any).indexCreate('tags', { multi: true }).run()
              .then(result => resolve());
          });
        } else resolve();
      }).catch(err => reject(err));
    });
  }

  private static initIssues(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.db.tableList().run(this.connection).then(list => {

        if(list.findIndex(t => t === 'issues') < 0) {
          this.db.tableCreate('issues').run(this.connection)
            .then(table => resolve()); // or index things
        } else resolve(); // or index things
      }).catch(err => reject(err));
    });
  }
}
