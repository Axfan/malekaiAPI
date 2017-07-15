import { Router, Request, Response } from 'express';
import { Discipline } from '../data';
import { Logger } from '../util';
import { DisciplineService } from '../service';
import { Api, Route } from '../deco';

@Api('races')
export class RaceApi {

  constructor(router: Router) { }

  @Route()
  getAll(req: Request, res: Response): void {
    DisciplineService.getAll({ include: ['race'] }).then(
      value => res.json(value.map(v => v.toDTO())),
      err => {
        res.status(err.status).send(err.message);
        Logger.error('GET: /races', err);
    });
  }

  @Route(':id')
  get(req: Request, res: Response) {
    try {
      // const is = atob(req.params.is);
      DisciplineService.get('' + req.params.id, { include: ['race'] }).then(
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
