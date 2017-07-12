import * as r from 'rethinkdb';
import { DatabaseService as db } from './database.service';

import { DataParser, sort } from '../util';
import { Rejection } from '../data/internal';
import { IDataObject } from '../data/interfaces';

export class SearchService {

  private static equals(doc: r.Expression<any>, key: string, param: any): r.Expression<any> {
    if(param instanceof Array) { // i.e. it's an array
      const col = r.expr(param);
      return ((col as any).map(val => (doc(key) as any).contains(val)) as r.Sequence).contains(false as any).eq(false);
    } else if(typeof param === 'string') {
      const groups = param.split(/\W/).filter(a => a).map(a => `(?:${a})`);
      return (doc(key) as any).match(`(?i)${groups.join('\\W*')}`);
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

  public static searchText(text: string, table?: string, skip?: number, limit?: number,
                          sortField?: string, sortDirection?: boolean): Promise<IDataObject[]> {
    table = table || '';
    limit = limit || 0;
    skip = skip || 0;
    sortField = sortField || 'name';
    sortDirection = sortDirection || false;
    let toSearch: r.Sequence | r.Table;

    switch(table.toLocaleLowerCase()) {
      case 'races': toSearch = db.races; break;
      case 'classes': toSearch = db.classes; break;
      case 'disciplines': toSearch = db.disciplines; break;
      case 'powers': toSearch = db.powers; break;
      default: toSearch = db.dataUnion;
    }

    let cmd = toSearch.filter((doc) => {
      const groups = text.split(/\W/).filter(a => a);
      const col: r.Sequence = r.expr(groups) as any;
      const regex = `(?i)${groups.map(a => `(?:${a})`).join('\\W*')}`;
      return (doc('name') as any).match(regex)
                .or(col.contains(doc('tags') as any))
                .or((doc('description') as any).match(regex));
    }).orderBy(sortDirection ? sortField : r.desc(sortField));

    if(skip) cmd = cmd.skip(skip);
    if(limit) cmd = cmd.limit(limit);

    return db.run(cmd).then(
      (result: any[]) => result.map(a => DataParser.parseDBO(a))
                          .sort((a, b) => sortDirection ? sort(a[sortField], b[sortField]) : sort(b[sortField], a[sortField])),
        err => { throw new Rejection(err); });
  }
}
