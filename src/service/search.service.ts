import * as r from 'rethinkdb';
import { DatabaseService as db } from './database.service';

import { Rejection } from '../data/internal';

export class SearchService {

  public static search(params: [string, any][]): Promise<any[]> {
    return new Promise<any[]>((resolve, reject) => {
      db.run(db.dataUnion.filter((doc) => {
        let current = doc(params[0][0]).eq(params[0][1]);
        for(let i = 1; i < params.length; i++) {
          current = current.and(doc(params[i][0]).eq(params[i][1]));
        }
        return current;
      })).then((result: any[]) => {
        resolve(result);
      }).catch(err => reject(new Rejection(err)));
    });
  }
}
