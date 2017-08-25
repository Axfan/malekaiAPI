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
      // const amt = (req.query.last && typeof req.query.last === 'number') ? req.query.last : 50;
      ChangelogService.getLast(50).then(
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
      // const amt = (req.query.last && typeof req.query.last === 'number') ? Math.min(0, Math.max(req.query.last, 500)) : 50;
      ChangelogService.get('' + req.params.data_type, '' + req.params.id, 50).then(
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
