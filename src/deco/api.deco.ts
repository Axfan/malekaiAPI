import { Router } from 'express';
import { ApiRoute } from '../data/internal';

export function Api(baseRoute?: string, options?: { scoped?: boolean }) {

  if(baseRoute) { // the base route must begin and end with a '/'
    if(baseRoute[0] !== '/')
      baseRoute = '/' + baseRoute;
  } else baseRoute = '/';

  return function<T extends {new(...args: any[]): {}}>(constructor: T) {

    return class extends constructor {

      private __routes: ApiRoute[];

      constructor(...args: any[]);
      constructor(router: Router, ...args: any[]) {
        if(typeof router !== typeof Router) throw new Error('No router was passed!');
        const r = (options && options.scoped) ? Router() : router;
        super(r, ...args);
        const prefix = (options && options.scoped) ? '' : baseRoute;
        // const router = Router();
        this.__routes.forEach(route => {
          try {
            r[route.type](`${prefix}/${route.route}`, route.reqHandler);
          } catch(e) {
              throw new Error(`Couldn't bootstrap route ${route.type.toUpperCase}: ${baseRoute}/${route.route}; `
                      + `Either type '${route.type}' is unknown or no router (${router}) was passed`);
          }
        });
        if(options && options.scoped) router.use(baseRoute, r);
      }

    }
  }
}
