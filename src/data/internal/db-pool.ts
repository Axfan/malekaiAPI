import * as r from 'rethinkdb';
import * as genericPool from 'generic-pool';
import LoggerLite from '../../util/logger-lite';

/**
 * Inspired from 'chrisvariety' (chrisvariety at github).
 * https://github.com/thoughtindustries/rethinkdb-pool and
 * https://www.npmjs.com/package/generic-pool
 */
export class DbPool {

  min = 2;
  max = 10;
  idleTimeoutMillis = 60 * 60 * 1000; // 1 hour (rethinkdb default)

  pool: {
    acquire(): Promise<r.Connection>;
    release(resource: r.Connection)
    drain(): Promise<void>;
    clear(): void;
  };

  constructor(connectOptions: r.ConnectionOptions) {

    this.pool = genericPool.createPool({
      create: (done) => r.connect(connectOptions),
      destroy: (connection) => connection.close()
    }, {
      max: this.max,
      min: this.min,
      idleTimeoutMillis: this.idleTimeoutMillis
    });
  }

  run<T>(query: r.Operation<T>): Promise<T | any[]> {
    return this.pool.acquire().then(connection => {
      return query.run.call(query, connection).then(cursorOrResult => {
        let result;

        if(cursorOrResult && typeof cursorOrResult.toArray === 'function') {
          result = cursorOrResult.toArray();
        } else {
          result = cursorOrResult as T;
        }
        this.pool.release(connection);
        return result;
      }).catch(e => {
        LoggerLite.error('[DbPool]', 'ERROR in Pool: ' + e);
        throw e;
      });
    }).catch(e => {
      LoggerLite.error('[DbPool]', 'ERROR in Pool (2): ' + e);
      throw e;
    })
  }

  drain() {
    return this.pool.drain().then(() => this.pool.clear());
  }
}
