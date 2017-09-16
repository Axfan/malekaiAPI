import 'source-map-support/register';

import * as express from 'express';
import * as session from 'express-session';
import * as bodyParser from 'body-parser';
import * as https from 'https';
import * as cors from 'cors'; /// https://github.com/expressjs/cors
import * as fs from 'fs';
import * as rethinkdb from 'rethinkdb';
import * as graphqlHttp from 'express-graphql';
import * as jsonfile from 'jsonfile';
import { bindLogger, Logger } from './util/logger';
import { DatabaseService } from './service';
import { Api } from './api/api';
import { RootSchema } from './data/graphql/root-schema';

import { SessionStore } from './data/internal/session-store';

import * as passport from 'passport';
import * as passportDiscord from 'passport-discord';
const DiscordStrategy = passportDiscord.Strategy

const logger = bindLogger('MAIN');

const discordScope = ['identify'];

let secret: {
  session: {
    secret: string;
  };
  discord: {
    clientID: string;
    clientSecret: string;
  };
};

try {
  secret = jsonfile.readFileSync('./secret.json');
} catch(e) {
  console.error('Couldn\'t read "secret"! ' + e);
  process.exit(1);
}

console.log('Initializing database...');
DatabaseService.init().then(() => {

  logger.log('Database Initialized');

  const app = express();
  app.set('trust proxy', 1);

  passport.serializeUser((user, cb) => {
    cb(null, user);
  });

  passport.deserializeUser((user, cb) => {
    cb(null, user);
  });

  app.use(cors({ origin: '*', methods: 'GET,POST' }));
  // TODO: Brute!
  // const bruteForce = new ExpressBrute(store);
  // app.use(bruteForce.prevent);
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(session({
    secret: secret.session.secret,
    resave: false,
    saveUninitialized: false,
    store: new SessionStore(),
    cookie: { domain: process.env.production ? 'malekai.org' : '127.0.0.1' }
  }));

  passport.use(new DiscordStrategy(
    {
      clientID: secret.discord.clientID,
      clientSecret: secret.discord.clientSecret,
      callbackURL: process.env.production ? 'https://api.malekai.network/secure/auth/discord/callback' :
                                            'http://127.0.0.1:7070/secure/auth/discord/callback',
      scope: discordScope,
    }, (accessToken, refreshToken, profile, cb) => {
      console.log('Authed:', profile.id);
      cb(null, profile);
    }
  ));

  app.use(passport.initialize());
  app.use(passport.session());

  const port = 7070; // woo!
  const ip = '0.0.0.0';

  app.use((req, res, next) => {
    const host = req.headers.origin || req.headers.host || req.ip;
    Logger.log('HTTP', `${req.method} ${req.hostname}${req.originalUrl} from ${host} (ip: ${req.ip}, ips: [${req.ips}])`,
                ['http', req.method, `${req.hostname}${req.originalUrl}`, (host instanceof Array ? host.join('::') : host)],
                `[${req.ips.toString()}]`);
    next();
  });

  const api = new Api();

  app.use('/', api.router);
  app.use('/graphql', graphqlHttp({
    schema: RootSchema,
    graphiql: true
  }));

  /*let c = null;
  DatabaseService.getConnection().then(conn => {
    c = conn;
    DatabaseService.sessions.changes().run(conn, (err, change) => {
      if(err) { console.error(err); return; }
      else change.each(console.log);
    })
  }).catch(e => {
    if(c && c.close) c.close();
    console.error(e);
  });*/

  /*https.createServer({
    key: fs.readFileSync('privkey.pem'),
    cert: fs.readFileSync('cert.pem')
  }, app).listen(port); /// https://github.com/ebekker/ACMESharp/wiki/Quick-Start */

  app.listen(port, ip);
  logger.log('API started on ' + ip + ':' + port);

}, err => {
  logger.error('Failed to start up due to database issues; ' + err, ['error', 'startup']);
  process.exit(1);
});

process.on('unhandledRejection', err => {
  logger.error(err).catch(() => {}).then(() => process.exit(1));
});
