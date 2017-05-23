import { Router } from 'express';
import { Class } from '../data';
import { Logger } from '../util';
import { ClassService } from '../service';
import { Api, Route } from '../deco';
import { atob, btoa } from '../polyfills';

@Api('classes')
export class ClassApi {

  constructor(router: Router) { }

  @Route()
  getAll(req, res): void {
    ClassService.getAll().then(
      value => res.json(value.map(v => v.toDTO())),
      err => {
        res.status(err.status).send(err.message);
        Logger.error('GET: /classes', err);
    });
  }

  @Route(':name')
  get(req, res) {
    try {
      const name = atob(req.params.name);
      ClassService.get(name).then(
        value => res.json(value.toDTO()),
        err => {
          res.status(err.status).send(err.message);
          Logger.error('GET: /classes/' + req.params.name, err);
      });
    } catch (e) {
      res.status(500).send('' + e);
      Logger.error('GET: /classes/' + req.params.name, e);
    }
  }
}
