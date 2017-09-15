import { Router, Request, Response } from 'express';
import { Logger } from '../util';
import { Api, Route } from '../deco';
import * as fs from 'fs';

@Api('csv')
export class CSVApi {

  constructor(router: Router) { }

  @Route(':name')
  get(req: Request, res: Response) {
    try {
      if(!req.params.name || !req.params.name.endsWith('.csv')) {
        res.status(400).send('Please specify a file name with a .csv extension.');
        return;
      }

      if(/\/|\\/.test(req.params.name)) {
        Logger.warn(`Someone (${req.ip}) tried to use special file-paths while getting a csv!`);
        res.sendStatus(400);
      }

      if(!fs.existsSync('./csv/' + req.params.name)) {
        res.status(404).send('The requested file doesn\'t exist!');
        return;
      }

      res.sendFile(req.params.name, { root: './csv' });
    } catch (e) {
      res.status(500).send('' + e);
      Logger.error('GET: /csv/' + req.params.name, e);
    }
  }
}
