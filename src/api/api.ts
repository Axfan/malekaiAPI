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

  private _races: RaceApi;
  public get races(): RaceApi { return this._races; }

  private _classes: ClassApi;
  public get classes(): ClassApi { return this._classes; }

  private _disciplines: DisciplineApi;
  public get disciplines(): DisciplineApi { return this._disciplines; }

  private _powers: PowerApi;
  public get powers(): PowerApi { return this._powers; }

  constructor() {
    this._meta = new MetaApi(this.router);
    this._races = new RaceApi(this.router);
    this._classes = new ClassApi(this.router);
    this._disciplines = new DisciplineApi(this.router);
    this._powers = new PowerApi(this.router);
  }
}
