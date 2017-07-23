import { Router, Request, Response } from 'express';
import { Issue } from '../data';
import { Rejection } from '../data/internal';
import { Logger } from '../util';
import { MetaService } from '../service';
import { Api, Route } from '../deco';

@Api('meta')
export class MetaApi {

  constructor(router: Router) { }

  @Route('issue')
  postIssue(req: Request, res: Response): void {
    try {
      req.body.status = 'open';
      const issue = Issue.fromDTO(req.body, req);
      MetaService.createIssue(issue).then(
        () => res.sendStatus(204),
        err => {
          Logger.error('POST: /meta/issue', err);
          err = err instanceof Rejection ? err : new Rejection(err);
          res.status(err.status).send(err.message);
      });
    } catch (err) {
        Logger.error('POST: /meta/issue', err);
        res.status(500).send('' + err);
    }
  }

  @Route('issue/:data_type/:data_id')
  get(req, res) {
    try {
      // const data_id = atob(req.params.data_id);
      MetaService.hasIssue('' + req.params.data_type, '' + req.params.data_id).then(
        value => res.json(value),
        err => {
          Logger.error('GET: /meta/issue/' + req.params.data_type + '/' + req.params.data_id, err);
          err = err instanceof Rejection ? err : new Rejection(err);
          res.status(err.status).send(err.message);
      });
    } catch (e) {
      Logger.error('GET: /meta/issue/' + req.params.data_type + '/' + req.params.data_id, e);
      res.status(500).send('' + e);
    }
  }
}
