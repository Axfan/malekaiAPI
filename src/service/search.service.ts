import * as r from 'rethinkdb';
import { DatabaseService as db } from './database.service';

import { DataParser, sort } from '../util';
import { Rejection } from '../data/internal';
import { IDataObject } from '../data/interfaces';

export class SearchService {

  private static equals(doc: r.Expression<any>, key: string, param: any): r.Expression<any> {
    if(param instanceof Array) { // i.e. it's an array
      const col: r.Sequence = r.expr(param) as any;
      return col.map(val => doc(key).contains(val)).contains(false).eq(false);
    } else if(typeof param === 'string') {
      const groups = param.split(/\W/).filter(a => a);
      const regex = `(?i)${groups.map(a => `(?:${a})`).join('\\W*')}`;
      return doc<string>(key).match(regex);
    } else
      return doc(key).eq(param);
  }

  public static search(params: [string, any][]): Promise<IDataObject[]> {
    const skip = (params.find(a => a[0] === 'skip') || { 1: 0 })[1];
    let limit = (params.find(a => a[0] === 'limit') || { 1: 50 })[1];
    limit = Math.min(limit < 1 ? 1 : limit, 50);

    let cmd = db.dataUnion.filter((doc) => {
      let current = this.equals(doc, params[0][0], params[0][1]);
      for(let i = 1; i < params.length; i++)
        current = current.and(this.equals(doc, params[i][0], params[i][1]));
      return current;
    });

    if(skip && limit) cmd = cmd.slice(skip, skip + limit);
    else if(skip) cmd = cmd.skip(skip);
    else if(limit) cmd = cmd.limit(limit);

    return new Promise<any[]>((resolve: (a: IDataObject[]) => void, reject: (a: Rejection) => void) => {
      db.run(cmd).then((result: any[]) => {
        resolve(result.map(a => DataParser.parseDBO(a)));
      }).catch(err => reject(new Rejection(err)));
    });
  }

  public static searchText(text: string, table?: string, skip?: number, limit?: number,
                          sortField?: string, sortDirection?: boolean): Promise<IDataObject[]> {
    table = table || '';
    limit = limit == null ? 50 : limit;
    limit = Math.min(limit < 1 ? 1 : limit, 50);
    skip = skip || 0;
    sortField = sortField || 'name';
    sortDirection = sortDirection || false;
    let toSearch: r.Sequence | r.Table;

    switch(table.toLocaleLowerCase()) {
      case 'classes': toSearch = db.classes; break;
      case 'disciplines': toSearch = db.disciplines; break;
      case 'powers': toSearch = db.powers; break;
      default: toSearch = db.dataUnion;
    }

    const groups = text.split(/\W/).filter(a => a);
    const regex = `(?i)${groups.map(a => `(?:${a})`).join('\\W*')}`;

    let cmd = toSearch.filter(doc => {
      return doc('name').match(regex)
                .or(doc('data_type').match(regex))
                .or(doc('description').match(regex))
                .or(doc('tags').contains(d => d.match(regex)))
                .or(doc('type').match(regex));
    }).orderBy(sortDirection ? sortField : r.desc(sortField));

    if(skip && limit) cmd = cmd.slice(skip, skip + limit);
    else if(skip) cmd = cmd.skip(skip);
    else if(limit) cmd = cmd.limit(limit);

    const sortFun = sortDirection ? (a, b) => sort(a[sortField], b[sortField]) : (a, b) =>  sort(b[sortField], a[sortField]);

    return db.run(cmd).then(
        (result: any[]) => result.map(a => DataParser.parseDBO(a)).sort(sortFun),
        err => { throw new Rejection(err); });
  }
}
