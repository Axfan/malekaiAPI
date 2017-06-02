import { Router, Request, Response } from 'express';
import { Logger } from '../util';
import { SearchService } from '../service';
import { Api, Route } from '../deco';
import { Rejection } from '../data/internal';

@Api('search')
export class SearchApi {

  constructor(router: Router) { }

  parse(str: string): any {
    try {
      return JSON.parse(str);
    } catch (e) {
      return str;
    }
  }

  @Route()
  get(req: Request, res: Response): void {
    const params: [string, any][] = [];
    try {
      if(!req.query || JSON.stringify(req.query) === '{}')
        throw new Error('Query is null or empty!')

      const parse = (str: string) => {
        try {
          return JSON.parse(str);
        } catch (e) {
          return str;
        }
      };

      for(const key in req.query) if(req.query[key]) {
        const value = parse(req.query[key]);
        if(key && value)
          params.push([key, value]);
      }
    } catch (e) {
      const err = new Rejection(e);
      res.status(err.status).send(err.message);
      Logger.error('GET: /search pre-service', err);
      return;
    }

    SearchService.search(params).then(
      value => {
        if(value.length > 0) res.json(value.map(v => v.toDTO()))
        else res.sendStatus(404).send('{ message: "No items found with those parameters." }');
      },
      err => {
        res.status(err.status).send(err.message);
        Logger.error('GET: /search', err);
    });
  }
}
