import * as r from 'rethinkdb';
import { DatabaseService as db } from './database.service';

import { Issue } from '../data';
import { Rejection } from '../data/internal';

export class MetaService {

  public static get issuesTable(): r.Table { return db.issues; }

  public static createIssue(issue: Issue): Promise<void> {
    return new Promise<void>((resolve: () => void, reject: (a: Rejection) => void) => {
      const data = issue.toDBO();
      data.Date = new Date();
      db.run(this.issuesTable.insert(data)).then((result: r.WriteResult) => {
        data.id = result.generated_keys[0];
        resolve();
      }, err => reject(new Rejection(err)));
    });
  }

}
