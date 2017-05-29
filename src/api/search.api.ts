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
      if(!(req.body || req.query))
        throw new Error('Nothing to search for: ' + JSON.stringify(req.body) + ', ' + JSON.stringify(req.query));

      const from = req.body ? req.body : req.query; // body params (i.e. graphql) : url params
      for(const key in from)
        params.push([key, from[key]]);

    } catch (err) {
      err = new Rejection(err);
      res.status(err.status).send(err.message);
      Logger.error('POST: /search', err);
      return;
    }

    SearchService.search(params).then(
      value => res.json(value.map(v => v.toDTO())),
      err => {
        res.status(err.status).send(err.message);
        Logger.error('POST: /search', err);
    });
  }
}
