import { Router, Request, Response } from 'express';
import { Logger } from '../util';
import { Api, Route } from '../deco';
import { Rejection } from '../data/internal/rejection';
import { DatabaseService as db } from '../service/database.service';
import { DataUtil } from '../util';
import env from '../env';
import * as fs from 'fs';
import * as cors from 'cors';
import * as passport from 'passport';
import { WriteResult } from 'rethinkdb';

@Api('secure', { scoped: true })
export class SecureApi {

  site: string;
  discordScope = ['identify'];

  constructor(router: Router) {

    const origin = env.production ? 'https://malekai.org' : 'http://localhost:4200';
    this.site = origin + (env.production ? '/' :  '/#/');

    router.options('*', cors({ origin: origin, credentials: true }));
    router.use(cors({ origin: origin, credentials: true, methods: 'GET,POST,UPDATE,DELETE' }));

    router.get('/auth/discord',
              passport.authenticate('discord', { scope: this.discordScope }));
    router.get('/auth/discord/callback',
              passport.authenticate('discord', { failureRedirect: this.site }),
              (req, res) => res.redirect(this.site));
  }

  @Route('authdump')
  getAuthdump(req: Request, res: Response) {
    try {
      if(req.query['key'] !== env.masterKey) { res.status(403).send('Nope.'); return; }
      db.run(db.sessions).then(sess => res.json(sess)).catch(err => {
        if(!(err instanceof Rejection)) err = new Rejection(err);
        res.status(err.status).send(err.message);
        Logger.error('GET: /secure/authdump', err);
      });
    } catch (e) {
      res.status(500).send('' + e);
      Logger.error('GET: /secure/authdump', e);
    }
  }

  @Route('authed')
  getAuthed(req: Request, res: Response) {
    try {
      if(req.isAuthenticated()) res.send('true');
      else res.send('false');
    } catch (e) {
      res.status(500).send('' + e);
      Logger.error('GET: /secure/authed', e);
    }
  }

  @Route('auth/logout')
  getAuthLogout(req: Request, res: Response) {
    try {
      req.logout();
      res.redirect(this.site);
    } catch (e) {
      res.status(500).send('' + e);
      Logger.error('GET: /secure/auth/logout', e);
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
        Logger.error(`PUT: /secure/${req.params.data_type}/${req.params.id}`, err);
      });
    } catch (e) {
      res.status(500).send('' + e);
      Logger.error(`PUT: /secure/${req.params.data_type}/${req.params.id}`, e);
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
        Logger.error(`DELETE: /secure/${req.params.data_type}/${req.params.id}`, err);
      });
    } catch (e) {
      res.status(500).send('' + e);
      Logger.error(`DELETE: /secure/${req.params.data_type}/${req.params.id}`, e);
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
        Logger.error(`POST: /secure/${req.params.data_type}`, err);
      });
    } catch (e) {
      res.status(500).send('' + e);
      Logger.error(`POST: /secure/${req.params.data_type}`, e);
    }
  }
}
