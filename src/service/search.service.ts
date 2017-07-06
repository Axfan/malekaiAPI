import * as r from 'rethinkdb';
import { DatabaseService as db } from './database.service';

import { DataParser } from '../util';
import { Rejection } from '../data/internal';
import { IDataObject } from '../data/interfaces';

export class SearchService {

  private static equals(doc: r.Expression<any>, key: string, param: any): r.Expression<any> {
    if(param instanceof Array) { // i.e. it's an array
      const col = r.expr(param);
      return ((col as any).map(val => (doc(key) as any).contains(val)) as r.Sequence).contains(false as any).eq(false);
    } else if(typeof param === 'string') {
      const groups = param.split(/\W/).filter(a => a).map(a => `(?:${a})`);
      return (doc(key) as any).match(`(?i)${groups.join('')}`);
    } else
      return doc(key).eq(param);
  }

  public static search(params: [string, any][]): Promise<IDataObject[]> {
    return new Promise<any[]>((resolve: (a: IDataObject[]) => void, reject: (a: Rejection) => void) => {
      db.run(db.dataUnion.filter((doc) => {
        let current = this.equals(doc, params[0][0], params[0][1]);
        for(let i = 1; i < params.length; i++)
          current = current.and(this.equals(doc, params[i][0], params[i][1]));
        return current;
      })).then((result: any[]) => {
        resolve(result.map(a => DataParser.parseDBO(a)));
      }).catch(err => reject(new Rejection(err)));
    });
  }
}
