import { Router } from 'express';
import { Issue } from '../data';
import { Logger } from '../util';
import { MetaService } from '../service';
import { Api, Route } from '../deco';

@Api('meta')
export class MetaApi {

  constructor(router: Router) { }

  @Route('issue')
  postIssue(req, res): void {
    try {
      const issue = Issue.fromDTO(req.body);
      MetaService.createIssue(issue).then(
        () => res.sendStatus(204),
        err => {
          res.status(err.status).send(err.message);
          Logger.error('POST: /issue', err);
      });
    } catch (err) {
        res.sendStatus(500);
        Logger.error('POST: /issue', err);
    }
  }
}
