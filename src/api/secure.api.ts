import { Router, Request, Response } from 'express';
import { Logger } from '../util';
import { Api, Route } from '../deco';
import * as fs from 'fs';

@Api('secure')
export class SecureApi {

  constructor(router: Router) { }

  @Route('')
  get(req: Request, res: Response) {
    try {
      res.status(200).send('hello world');
    } catch (e) {
      res.status(500).send('' + e);
      Logger.error('GET: /secure', e);
    }
  }
}
