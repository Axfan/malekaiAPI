import { Router, Request, Response } from 'express';
import { Class } from '../data';
import { Logger } from '../util';
import { ChangelogService } from '../service';
import { Api, Route } from '../deco';

@Api('changelog')
export class ChangelogApi {

  constructor(router: Router) { }

  @Route('')
  get(req: Request, res: Response) {
     try {
      // const id = atob(req.params.id);
      const skip = (req.query.skip && typeof req.query.skip === 'number') ? req.query.skip : 0;
      let amt = (req.query.amount && typeof req.query.amount === 'number') ? req.query.last : 50;
      amt = Math.max(amt < 1 ? 1 : amt, 50);
      ChangelogService.getLast(skip, amt).then(
        value => res.json(value.map(a => a.toDTO())),
        err => {
          res.status(err.status).send(err.message);
          Logger.error('GET: /changelog' + req.params.id, err);
      });
    } catch (e) {
      res.status(500).send('' + e);
      Logger.error('GET: /changelog', e);
    }
  }

  @Route(':data_type/:id')
  getId(req: Request, res: Response) {
    try {
      // const id = atob(req.params.id);
      const skip = (req.query.skip && typeof req.query.skip === 'number') ? req.query.skip : 0;
      let amt = (req.query.amount && typeof req.query.amount === 'number') ? req.query.last : 50;
      amt = Math.max(amt < 1 ? 1 : amt, 50);
      ChangelogService.get('' + req.params.data_type, '' + req.params.id, skip, amt).then(
        value => res.json(value.map(a => a.toDTO())),
        err => {
          res.status(err.status).send(err.message);
          Logger.error(`GET: /changelog/${req.params.data_type}/${req.params.id}`, err);
      });
    } catch (e) {
      res.status(500).send('' + e);
      Logger.error(`GET: /changelog/${req.params.data_type}/${req.params.id}`, e);
    }
  }
}
