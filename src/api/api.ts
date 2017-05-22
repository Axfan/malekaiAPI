import { Router } from 'express';
import { MetaApi } from './meta.api';
import { RaceApi } from './race.api';
import { ClassApi } from './class.api';
import { DisciplineApi } from './discipline.api';
import { PowerApi } from './power.api';

export class Api {

  private _router: Router = Router();
  public get router(): Router { return this._router; }

  private _meta: MetaApi;
  public get meta(): MetaApi { return this._meta; }

  private _race: RaceApi;
  public get race(): RaceApi { return this._race; }

  private _class: ClassApi;
  public get class(): ClassApi { return this._class; }

  private _disc: DisciplineApi;
  public get disc(): DisciplineApi { return this._disc; }

  private _power: PowerApi;
  public get power(): PowerApi { return this._power; }

  constructor() {
    this._meta = new MetaApi(this.router);
    this._race = new RaceApi(this.router);
    this._class = new ClassApi(this.router);
    this._disc = new DisciplineApi(this.router);
    this._power = new PowerApi(this.router);
  }
}
