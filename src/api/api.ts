import { Router } from 'express';
import { DisciplineApi } from './discipline.api';

export class Api {

  private _router: Router = Router();
  public get router(): Router { return this._router; }

  private _disc: DisciplineApi;
  public get disc(): DisciplineApi { return this._disc; }

  constructor() {
    this._disc = new DisciplineApi(this.router);
  }
}
