import 'source-map-support/register';

import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as https from 'https';
import * as cors from 'cors'; /// https://github.com/expressjs/cors
import * as fs from 'fs';
import * as rethinkdb from 'rethinkdb';
import * as graphqlHttp from 'express-graphql';
import { bindLogger, Logger } from './util/logger';
import { DatabaseService } from './service';
import { Api } from './api/api';
import { RootSchema } from './data/graphql/root-schema';

const logger = bindLogger('MAIN');

console.log('Initializing database...');
DatabaseService.init().then(() => {

  logger.log('Database Initialized');

  const app = express();

  app.use(cors({ origin: '*', methods: 'GET,POST' }));
  // TODO: Brute!
  // const bruteForce = new ExpressBrute(store);
  // app.use(bruteForce.prevent);
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  const port = 7070; // woo!
  const ip = '0.0.0.0';

  app.use((req, res, next) => {
    const host = req.headers.origin || req.headers.host || req.ip;
    Logger.log('HTTP', `${req.method} ${req.hostname}${req.originalUrl} from ${host}`,
                ['http', req.method, `${req.hostname}${req.originalUrl}`, (host instanceof Array ? host.join('::') : host)],
                req.ip);
    next();
  });

  const api = new Api();

  app.use('/', api.router);
  app.use('/graphql', graphqlHttp({
    schema: RootSchema,
    graphiql: true
  }));

  /*https.createServer({
    key: fs.readFileSync('privkey.pem'),
    cert: fs.readFileSync('cert.pem')
  }, app).listen(port); /// https://github.com/ebekker/ACMESharp/wiki/Quick-Start */

  app.listen(port, ip);
  logger.log('API started on ' + ip + ':' + port);

}, err => {

  logger.error('Failed to start up due to database issues' + err, ['error', 'startup']);
  process.exit(1);
});

process.on('unhandledRejection', err => {
  logger.error(err).catch(() => {}).then(() => process.exit(1));
});
