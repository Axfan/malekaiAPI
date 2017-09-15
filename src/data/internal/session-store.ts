import { EventEmitter } from 'events';
import * as session from 'express-session';
import { DatabaseService as db } from '../../service/database.service';

/// inspired by: https://github.com/knownasilya/rethinkdb-express-session

class SessionStoreItem {
  id: string;
  expires: Date;
  session: Express.Session;
}

export class SessionStore extends session.Store {

  public cookieAge = 604800000;

  constructor(options?: any) {
    super(options);
    if(options && options.cookieAge) this.cookieAge = options.cookieAge;
  }

  /** @override */
  get = function(sid: string, callback: (err?: any, session?: any) => void): void {
    db.run(db.sessions.filter(doc => doc('expires').lt(new Date())).delete()).then(
      () => db.run(db.sessions.get(sid)).then((res: any) => callback(null, res ? res.session : null), err => callback(err))
    );
  }

  set = function(sid: string, session: any, callback: (err?: any) => void) {
    db.run(db.sessions.insert({
      id: sid,
      expires: new Date(Date.now() + this.cookieAge),
      session: session
    } as SessionStoreItem, { conflict: 'replace' })).then(res => callback(), err => callback(err));
  }

  destroy = function(sid: string, callback: (err?: any) => void) {
    db.run(db.sessions.get(sid).delete()).then(res => callback(), err => callback(err));
  };

  all = function(callback: (err?: any, sessions?: {[key: string]: any}) => void): void {
    db.run(db.sessions.filter(doc => doc('expires').lt(new Date())).delete()).then(
      () => db.run(db.sessions).then((res: any[]) => {
        const obj = { };
        for(const s of res) obj[s.id] = s;
        callback(null, obj);
      }, err => callback(err))
    );
  }

  clear = function(callback: (err?: any) => void): void {
    db.run(db.sessions.delete()).then(res => callback(), err => callback(err));
  }

  length = function(callback: (err?: any, len?: number) => void): void {
    db.run(db.sessions.filter(doc => doc('expires').lt(new Date())).delete()).then(
      () => db.run(db.sessions.count()).then((res: number) => callback(null, res), err => callback(err))
    );
  }

  touch(sid: string, session: Express.Session, callback: (err?: any) => void): void {
    db.run(db.sessions.get(sid).update({ expires: new Date(Date.now() + this.cookieAge) })).then(() => callback(), err => callback(err));
  }
}
