import * as r from 'rethinkdb';
import { DatabaseService as db } from './database.service';
import { Logger } from '../util/logger';
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

  public static hasIssue(data_type: string, data_id: string): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      db.run(this.issuesTable.filter(doc => doc('data_id').eq(data_id)
                                            .and(doc('data_type').eq(data_type))
                                            .and(doc('status').eq('open')))
                              .isEmpty()).then(
        (result: boolean) => resolve(!result),
        err => reject(new Rejection(err)));
    });
  }

}
