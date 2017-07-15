import { Router } from 'express';
import { Power } from '../data';
import { Logger } from '../util';
import { PowerService } from '../service';
import { Api, Route } from '../deco';

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

  @Route(':id')
  get(req, res) {
    try {
      // const id = atob(req.params.id);
      // req.query ?!
      // const classes: string = req.options.classes; // ?classes=cleric,assassin
      PowerService.get('' + req.params.id).then(
        value => res.json(value.toDTO()),
        err => {
          res.status(err.status).send(err.message);
          Logger.error('GET: /powers/' + req.params.id, err);
      });
    } catch (e) {
      res.status(500).send('' + e);
      Logger.error('GET: /powers/' + req.params.id, e);
    }
  }
}
