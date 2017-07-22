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

  public static getIssue(data_id: string): Promise<Issue> {
    return new Promise<Issue>((resolve, reject) => {
      db.run(this.issuesTable.filter(doc => doc('data_id').eq(data_id))).then((result: any[]) => {
        if(!result || result.length === 0) { reject(new Rejection('Issue not found with data_id ' + data_id, 404)); return; }
        if(result.length > 0)
          Logger.warn('MetaService', 'Multiple issues with the same id :U');
        resolve(Issue.fromDBO(result[0]));
      }, err => reject(new Rejection(err)));
    });
  }

}
