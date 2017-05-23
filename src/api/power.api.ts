import { Router } from 'express';
import { Power } from '../data';
import { Logger } from '../util';
import { PowerService } from '../service';
import { Api, Route } from '../deco';
import { atob, btoa } from '../polyfills';

@Api('powers')
export class PowerApi {

  constructor(router: Router) { }

  @Route()
  getAll(req, res): void {
    PowerService.getAll().then(
      value => res.json(value.map(v => v.toDTO())),
      err => {
        res.status(err.status).send(err.message);
        Logger.error('GET: /powers', err);
    });
  }

  @Route(':name')
  get(req, res) {
    try {
      const name = atob(req.params.name);
      PowerService.get(name).then(
        value => res.json(value.toDTO()),
        err => {
          res.status(err.status).send(err.message);
          Logger.error('GET: /powers/' + req.params.name, err);
      });
    } catch (e) {
      res.status(500).send('' + e);
      Logger.error('GET: /powers/' + req.params.name, e);
    }
  }
}
