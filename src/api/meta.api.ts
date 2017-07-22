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
      const issue = Issue.fromDTO(req.body, req);
      MetaService.createIssue(issue).then(
        () => res.sendStatus(204),
        err => {
          Logger.error('POST: /issue', err);
          err = err instanceof Rejection ? err : new Rejection(err);
          res.status(err.status).send(err.message);
      });
    } catch (err) {
        Logger.error('POST: /issue', err);
        res.sendStatus(500);
    }
  }
}
