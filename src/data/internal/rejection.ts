import { Response } from 'express';

export class Rejection {

  status = 500;
  message = 'Internal server error';
  stack = '';

  constructor(rejection?: Rejection)
  constructor(error?: Error, status?: number);
  constructor(message: string, status?: number);
  constructor(errorOrRejectionOrMessage?: Rejection | Error | string, status?: number) {
    if(errorOrRejectionOrMessage instanceof Rejection) {
      this.status = (errorOrRejectionOrMessage as Rejection).status;
      this.message = (errorOrRejectionOrMessage as Rejection).message;
      this.stack = (errorOrRejectionOrMessage as Rejection).stack;
    } else if(errorOrRejectionOrMessage instanceof Error) {
      this.status = status || this.status;
      this.message = (errorOrRejectionOrMessage as Error).message;
      this.stack = (errorOrRejectionOrMessage as Error).stack;
    } else {
      this.status = status || this.status;
      this.message = '' + errorOrRejectionOrMessage;
    }
  }

  send(res: Response): Response {
    return res.status(this.status).send({ message: this.message });
  }

  toString(): string {
    return `${this.message}[${this.status}]:\n ${this.stack}`;
  }
}
