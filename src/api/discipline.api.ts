import { Router } from 'express';
import { Discipline } from '../data';
import { Logger } from '../util';
import { DisciplineService } from '../service';
import { Api, Route } from '../deco';
import { atob, btoa } from '../polyfills';

@Api('disciplines')
export class DisciplineApi {

  constructor(router: Router) { }

  @Route()
  getAll(req, res): void {
    DisciplineService.getAll().then(
      value => res.json(value.map(v => v.toDTO())),
      err => {
        res.status(err.status).send(err.message);
        Logger.error('GET: /disciplines', err);
    });
  }

  @Route(':id')
  get(req, res) {
    try {
      // const id = atob(req.params.id);
      DisciplineService.get('' + req.params.id).then(
        value => res.json(value.toDTO()),
        err => {
          res.status(err.status).send(err.message);
          Logger.error('GET: /disciplines/' + req.params.is, err);
      });
    } catch (e) {
      res.status(500).send('' + e);
      Logger.error('GET: /disciplines/' + req.params.is, e);
    }
  }
}
