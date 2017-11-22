declare module "rethinkdb" {
  interface Expression<T> extends Writeable, Operation<T>, HasFields<Expression<number>> {
    contains(prop: string | boolean | number | Expression<any> | ExpressionFunction<any>): Expression<boolean>;
    <U>(prop: string): Expression<U>;
    match(regexp: string): Expression<any>;
  }

  export function not(e: Expression<boolean>): Expression<boolean>;
  export function expr(stuff: any): Expression<any> | Sequence;
  export function and(...e: (Expression<boolean> | boolean)[]);
  export function or(...e: (Expression<boolean> | boolean)[]);

  interface Sequence extends Operation<Cursor>, Writeable {
    union(...sequence: Sequence[]): Sequence;
    union(options?: { interLeave: boolean }, ...sequence: Sequence[]): Sequence;
    map(transform: ExpressionFunction<any>): Sequence;
    map(sequence: Sequence, transform: ExpressionFunction<any>): Sequence;
    map(...sequenceAndThenExpressionFunction: [Sequence | ExpressionFunction<any>][]): Sequence;
    contains(prop: string | boolean | number | Expression<any> | ExpressionFunction<any>): Expression<boolean>;
  }

  interface Table extends Sequence, HasFields<Sequence> {
    indexCreate(name: string, options?: { multi?: boolean, geo?: boolean }): Operation<CreateResult>;
    indexCreate(name: string, index?: ExpressionFunction<any>, options?: { multi: boolean, geo: boolean }): Operation<CreateResult>;
  }
}
