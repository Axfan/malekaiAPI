import { Db, Table, Connection } from 'rethinkdb';
import * as r from 'rethinkdb';
import { DbPool } from '../data/internal';

export class DatabaseService {

  private static pool: DbPool;

  private static get connectOpts(): r.ConnectionOptions { return {
    host: '127.0.0.1',
    port: 28015
  } };

  public static getConnection(): Promise<r.Connection> {
    return r.connect(this.connectOpts);
  }

  public static get crowfallDbName(): string { return 'crowfallData'; } /// @todo: adjust via env
  public static get apiDbName(): string { return 'apiData'; }

  public static get cfDb(): Db { return r.db(this.crowfallDbName); }
  public static get apiDb(): Db { return r.db(this.apiDbName); }

  public static get tables() { return ['class', 'discipline', 'power', 'guild']; }

  public static get classes(): Table { return this.cfDb.table('classLibrary'); }
  public static get disciplines(): Table { return this.cfDb.table('disciplineLibrary'); }
  public static get powers(): Table { return this.cfDb.table('powerLibrary'); }
  public static get guilds(): Table { return this.cfDb.table('guildLibrary'); }

  public static getTable(name: string): Table {
    const t = this.tables.find(a => name.substr(0, a.length) === a);
    if(t === 'class') return this.classes;
    if(t === 'discipline') return this.disciplines;
    if(t === 'power') return this.powers;
    if(t === 'guild') return this.guilds;
    return null;
  }

  public static get dataUnion(): r.Sequence {
    return this.classes.union(this.disciplines, this.powers);
  }

  public static emptyTables(): Promise<any> {
    return Promise.all([
      this.run(this.classes.delete()),
      this.run(this.disciplines.delete()),
      this.run(this.powers.delete()),
      this.run(this.guilds.delete())
    ]);
  }

  public static get issues(): Table { return this.cfDb.table('issuesQueue'); }
  public static get changelogs(): Table { return this.cfDb.table('changeLog'); }

  public static get log(): Table { return this.apiDb.table('apiLog'); }
  public static get sessions(): Table { return this.apiDb.table('sessions'); }

  public static run<T>(query: r.Operation<T>): Promise<T | any[]> {
    return this.pool.run(query);
  }

  public static init(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.pool = new DbPool(this.connectOpts);
      this.run(r.dbList()).then(async (result: string[]) => {
        if(result.indexOf(this.crowfallDbName) < 0)
          await this.run(r.dbCreate(this.crowfallDbName)).then(a => console.log(`Created db "${this.crowfallDbName}"!`));
        if(result.indexOf(this.apiDbName) < 0)
          await this.run(r.dbCreate(this.apiDbName)).then(a => console.log(`Created db "${this.apiDbName}"!`));
      }).then(() => Promise.all([
        ...this.tables.map(a => this.initData(a + 'Library')),
        this.initLog(),
        this.initIssues(),
        this.initChangelogs(),
        this.initSessions(),
      ]).then(() => resolve()).catch(err => { reject(err); return; }));
    });
  }

  private static initData(name: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.run(this.cfDb.tableList()).then((result: string[]) => {

        if(result.findIndex(t => t === name) < 0) {
          this.run(this.cfDb.tableCreate(name))
              .then(table => resolve()); // or put in sample data

        } else resolve(); // or put in sample data

      }).catch(err => reject(err));
    });
  }

  private static initLog(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.run(this.apiDb.tableList()).then((list: string[]) => {

        if(list.findIndex(t => t === 'apiLog') < 0) {
          this.run(this.apiDb.tableCreate('apiLog')).then(table => {
            this.run(this.log.indexCreate('tags', { multi: true }))
              .then(result => resolve());
          });
        } else resolve();
      }).catch(err => reject(err));
    });
  }

  private static initIssues(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.run(this.apiDb.tableList()).then((list: string[]) => {

        if(list.findIndex(t => t === 'issuesQueue') < 0) {
          this.run(this.apiDb.tableCreate('issuesQueue'))
            .then(table => resolve()); // or index things
        } else resolve(); // or index things
      }).catch(err => reject(err));
    });
  }

  private static initChangelogs(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.run(this.apiDb.tableList()).then((list: string[]) => {

        if(list.findIndex(t => t === 'changeLog') < 0) {
          this.run(this.apiDb.tableCreate('changeLog'))
            .then(table => resolve()); // or index things
        } else resolve(); // or index things
      }).catch(err => reject(err));
    });
  }

  private static initSessions(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.run(this.apiDb.tableList()).then((list: string[]) => {

        if(list.findIndex(t => t === 'sessions') < 0) {
          this.run(this.apiDb.tableCreate('sessions'))
            .then((table: any) => {
              this.run(table.filter(doc => doc('expires').lt(new Date())).delete())
                .then(() => resolve());
            }); // or index things
        } else {
          this.run(this.sessions.filter(doc => doc('expires').lt(new Date())).delete())
              .then(() => resolve());
        }
      }).catch(err => reject(err));
    });
  }
}
