import { Connection, Db, Table } from 'rethinkdb';
import { DatabaseService } from './database.service';

import { Issue } from '../data';
import { Rejection } from '../data/internal';

export class MetaService {

  public static get connection(): Connection { return DatabaseService.connection; }
  public static get issuesTable(): Table { return DatabaseService.issues; }

  public static createIssue(issue: Issue): Promise<void> {
    return new Promise<void>((resolve: () => void, reject: (a: Rejection) => void) => {
      const data = issue.toDBO();
      data.Date = new Date();
      this.issuesTable.insert(data).run(this.connection).then(result => {
        data.id = result.generated_keys[0];
        resolve();
      }, err => reject(new Rejection(err)));
    });
  }

}
