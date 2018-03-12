import { Router } from 'express';
import { Guild } from '../data';
import { Logger } from '../util';
import { GuildService } from '../service';
import { Api, Route } from '../deco';

@Api('guilds')
export class GuildApi {

  constructor(router: Router) { }

  @Route()
  getAll(req, res): void {
    GuildService.getAll().then(
      value => res.json(value.map(v => v.toDTO())),
      err => {
        res.status(err.status).send(err.message);
        Logger.error('GET: /guilds', err);
    });
  }

  @Route(':id')
  get(req, res) {
    try {
      GuildService.get('' + req.params.id).then(
        value => res.json(value.toDTO()),
        err => {
          res.status(err.status).send(err.message);
          Logger.error('GET: /guilds/' + req.params.id, err);
      });
    } catch (e) {
      res.status(500).send('' + e);
      Logger.error('GET: /guilds/' + req.params.id, e);
    }
  }

  @Route('name/:name')
  getFromName(req, res) {
    try {
      GuildService.getFromName('' + req.params.name).then(
        value => res.json(value.toDTO()),
        err => {
          res.status(err.status).send(err.message);
          Logger.error('GET: /guilds/' + req.params.name, err);
        }
       )
    } catch (e) {
      res.status(500).send('' + e);
      Logger.error('GET: /guilds/' + req.params.name, e);
    }
  }
}
