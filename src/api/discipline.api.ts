import { Router } from 'express';
import { Discipline } from '../data';
import { Logger } from '../util';
import { DisciplineService } from '../service';
import { Api, Route } from '../deco';

@Api('discs')
export class DisciplineApi {

  constructor(router: Router) { }

  @Route()
  getAll(req, res): void {
    DisciplineService.getAll().then(
      value => res.json(value.map(v => v.toDTO())),
      err => {
        res.status(err.status).send(err.message);
        Logger.error('GET: /discs', err);
    });
  }

  @Route(':name')
  get(req, res) {
    try {
      const name = atob(req.params.name);
      DisciplineService.get(req.params.name).then(
        value => res.json(value.toDTO()),
        err => {
          res.status(err.status).send(err.message);
          Logger.error('GET: /discs/' + req.params.name, err);
      });
    } catch (e) {
      res.status(500).send('' + e);
      Logger.error('GET: /discs/' + req.params.name, e);
    }
  }
}
