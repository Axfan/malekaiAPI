import { Router, Request, Response } from 'express';
import { Logger } from '../util';
import { Api, Route } from '../deco';
import { Rejection } from '../data/internal/rejection';
import { DatabaseService as db } from '../service/database.service';
import { DataUtil } from '../util';
import * as fs from 'fs';
import * as cors from 'cors';
import * as passport from 'passport';
import { WriteResult } from 'rethinkdb';

@Api('secure')
export class SecureApi {

  site: string;
  discordScope = ['identify'];

  constructor(router: Router) {

    const origin = process.env.production ? 'https://malekai.org' : 'http://127.0.0.1:4200';
    this.site = origin + (process.env.production ? '/' :  '/#/');

    router.options('*', cors({ origin: origin, credentials: true }));
    router.use(cors({ origin: origin, credentials: true, methods: 'GET,POST,UPDATE,DELETE' }));

    router.get('/auth/discord', passport.authenticate('discord', { scope: this.discordScope }, (req, res) => { }));
    router.get('/auth/discord/callback', passport.authenticate('discord', { failureRedirect: this.site }), (req, res) => res.redirect(this.site));
  }

  @Route('authed')
  get(req: Request, res: Response) {
    try {
      if(req.isAuthenticated()) res.send('true');
      else res.send('false');
    } catch (e) {
      res.status(500).send('' + e);
      Logger.error('GET: /secure', e);
    }
  }

  @Route('auth/logout')
  getAuthLogout(req: Request, res: Response) {
    try {
      req.logout();
      res.redirect(this.site);
    } catch (e) {
      res.status(500).send('' + e);
      Logger.error('GET: /secure', e);
    }
  }

  @Route(':data_type/:id')
  putItem(req: Request, res: Response) {
    try {
      if(!req.isAuthenticated()) { res.sendStatus(403); return; }
      if(req.user.id !== '125676857545719808') { res.sendStatus(403); return; }
      const table = db.getTable(req.params.data_type);
      if(!table) { res.status(404).send('Data type not valid.'); return; }
      if(typeof req.body !== 'object') { res.status(400).send('Must send a JSON object.'); return; }
      db.run(table.get(req.params.id)).then(data => {
        if(!data) { res.status(404).send('No entry found with that ID.'); return; }
        return db.run(table.get(req.params.id).update(DataUtil.changes(DataUtil.parseDBO(data), req.body))).then(() => res.sendStatus(204));
      }).catch(err => {
        if(!(err instanceof Rejection)) err = new Rejection(err);
        res.status(err.status).send(err.message);
        Logger.error('GET: /disciplines', err);
      });
    } catch (e) {
      res.status(500).send('' + e);
      Logger.error('GET: /secure', e);
    }
  }

  @Route(':data_type/:id')
  deleteItem(req: Request, res: Response) {
    try {
      if(!req.isAuthenticated()) { res.sendStatus(403); return; }
      if(req.user.id !== '125676857545719808') { res.sendStatus(403); return; }
      const table = db.getTable(req.params.data_type);
      if(!table) { res.status(404).send('Data type not valid.'); return; }
      db.run(table.get(req.params.id).delete()).then((result: WriteResult) => {
        if(result.skipped) { res.status(404).send('No entry found with that ID.'); return; }
        res.sendStatus(204);
      }).catch(err => {
        if(!(err instanceof Rejection)) err = new Rejection(err);
        res.status(err.status).send(err.message);
        Logger.error('GET: /disciplines', err);
      });
    } catch (e) {
      res.status(500).send('' + e);
      Logger.error('GET: /secure', e);
    }
  }

  @Route(':data_type')
  postItem(req: Request, res: Response) {
    try {
      if(!req.isAuthenticated()) { res.sendStatus(403); return; }
      if(req.user.id !== '125676857545719808') { res.sendStatus(403); return; }
      const table = db.getTable(req.params.data_type);
      if(!table) { res.status(404).send('Data type not valid.'); return; }
      db.run(table.get(req.body.id)).then(data => {
        if(data) { res.status(400).send('Entry already found with that ID.'); return; }
        return db.run(table.insert(DataUtil.parseDTO(req.body))).then(() => res.sendStatus(204));
      }).catch(err => {
        if(!(err instanceof Rejection)) err = new Rejection(err);
        res.status(err.status).send(err.message);
        Logger.error('GET: /disciplines', err);
      });
    } catch (e) {
      res.status(500).send('' + e);
      Logger.error('GET: /secure', e);
    }
  }
}
