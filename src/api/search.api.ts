import { Router, Request, Response } from 'express';
import { Logger } from '../util';
import { SearchService } from '../service';
import { Api, Route } from '../deco';
import { Rejection } from '../data/internal';

@Api('search')
export class SearchApi {

  constructor(router: Router) { }

  parse(str: string) {
    try {
      return JSON.parse(str);
    } catch (e) {
      return str;
    }
  }

  @Route()
  post(req: Request, res: Response): void {
    const params: [string, any][] = [];
    try {
      if(req.body && JSON.stringify(req.body) !== '{}') { // body params (i.e. graphql)
        for(const key in req.body)
          params.push([key, req.body[key]]);
      } else if(req.query && JSON.stringify(req.query) !== '{}') { // url params
        for(const key in req.query)
        params.push([key, this.parse(req.query[key])]);
      } else throw new Error('Nothing to search for!');

    } catch (e) {
      const err = new Rejection(e);
      res.status(err.status).send(err.message);
      Logger.error('POST: /search pre-service', err);
      return;
    }

    SearchService.search(params).then(
      value => res.json(value), // .map(v => v.toDTO())),
      err => {
        res.status(err.status).send(err.message);
        Logger.error('POST: /search', err);
    });
  }
}
