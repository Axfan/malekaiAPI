import { Router } from 'express';
import { Race } from '../data';
import { Logger } from '../util';
import { RaceService } from '../service';
import { Api, Route } from '../deco';
import { atob, btoa } from '../polyfills';

@Api('races')
export class RaceApi {

  constructor(router: Router) { }

  @Route()
  getAll(req, res): void {
    RaceService.getAll().then(
      value => res.json(value.map(v => v.toDTO())),
      err => {
        res.status(err.status).send(err.message);
        Logger.error('GET: /races', err);
    });
  }

  @Route(':id')
  get(req, res) {
    try {
      // const is = atob(req.params.is);
      RaceService.get('' + req.params.id).then(
        value => res.json(value.toDTO()),
        err => {
          res.status(err.status).send(err.message);
          Logger.error('GET: /races/' + req.params.id, err);
      });
    } catch (e) {
      res.status(500).send('' + e);
      Logger.error('GET: /races/' + req.params.id, e);
    }
  }
}
