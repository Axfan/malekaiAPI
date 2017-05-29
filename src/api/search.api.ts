import { Router, Request, Response } from 'express';
import { Logger } from '../util';
import { SearchService } from '../service';
import { Api, Route } from '../deco';
import { Rejection } from '../data/internal';

@Api('search')
export class SearchApi {

  constructor(router: Router) { }

  @Route()
  post(req: Request, res: Response): void {
    const params: [string, any][] = [];
    try {
      const hasBody = !req.body || JSON.stringify(req.body) === '{}'; // body params (i.e. graphql)
      const hasQuery = !req.query || JSON.stringify(req.query) === '{}'; // url params

      if(!(hasBody || hasQuery))
        throw new Error('Nothing to search for!');

      const from = hasBody ? req.body : req.query;

      for(const key in from)
        params.push([key, from[key]]);

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
