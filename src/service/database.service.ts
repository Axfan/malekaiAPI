import { Db, Table, Connection } from 'rethinkdb';
import * as r from 'rethinkdb';
import { DbPool } from '../data/internal';

export class DatabaseService {

  private static pool: DbPool;

  public static get dbName(): string { return 'crowfallData'; } /// @todo: adjust via env

  public static get db(): Db { return r.db(this.dbName); }

  public static get tables() { return ['class', 'discipline', 'power']; }

  public static get classes(): Table { return this.db.table('classLibrary'); }
  public static get disciplines(): Table { return this.db.table('disciplineLibrary'); }
  public static get powers(): Table { return this.db.table('powerLibrary'); }

  public static getTable(name: string): Table {
    const t = this.tables.find(a => name.substr(0, a.length) === a);
    if(t === 'class') return this.classes;
    if(t === 'discipline') return this.disciplines;
    if(t === 'power') return this.powers;
    return null;
  }

  public static get dataUnion(): r.Sequence {
    return this.classes.union(this.disciplines, this.powers);
  }

  public static emptyTables(): Promise<any> {
    return Promise.all([
      this.run(this.classes.delete()),
      this.run(this.disciplines.delete()),
      this.run(this.powers.delete())
    ]);
  }

  public static get log(): Table { return this.db.table('apiLog'); }
  public static get issues(): Table { return this.db.table('issuesQueue'); }
  public static get changelogs(): Table { return this.db.table('changeLog'); }

  public static run<T>(query: r.Operation<T>): Promise<T | any[]> {
    return this.pool.run(query);
  }

  public static init(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.pool = new DbPool({
        host: '127.0.0.1',
        port: 28015
      });
      this.run(r.dbList()).then((result: string[]) => {
        if(result.indexOf('crowfallData') < 0)
          return this.run(r.dbCreate('crowfallData')).then(a => console.log('Created db "crowfallData"!'));
        else
          return Promise.resolve();
      }).then(() => Promise.all([
        ...this.tables.map(a => this.initData(a + 'Library')),
        this.initLog(),
        this.initIssues(),
      ]).then(() => resolve()).catch(err => { reject(err); return; }));
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
            this.run(this.log.indexCreate('tags', { multi: true }))
              .then(result => resolve());
          });
        } else resolve();
      }).catch(err => reject(err));
    });
  }

  private static initIssues(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.run(this.db.tableList()).then((list: string[]) => {

        if(list.findIndex(t => t === 'issuesQueue') < 0) {
          this.run(this.db.tableCreate('issuesQueue'))
            .then(table => resolve()); // or index things
        } else resolve(); // or index things
      }).catch(err => reject(err));
    });
  }
}
