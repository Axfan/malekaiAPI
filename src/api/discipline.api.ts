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

  @Route(':id')
  get(req, res) {
    DisciplineService.get(req.params.id).then(
      value => res.json(value.toDTO()),
      err => {
        res.status(err.status).send(err.message);
        Logger.error('GET: /discs/' + req.params.id, err);
    });
  }
}
