import * as r from 'rethinkdb';
import { DatabaseService as db } from './database.service';

import { Issue } from '../data';
import { Rejection } from '../data/internal';

export class MetaService {

  public static get issuesTable(): r.Table { return db.issues; }

  public static createIssue(issue: Issue): Promise<void> {
    return new Promise<void>((resolve: () => void, reject: (a: Rejection) => void) => {
      db.run(this.issuesTable.insert(issue.toDBO())).then(
        (result: r.WriteResult) => resolve(),
        err => reject(new Rejection(err)));
    });
  }

}
