export class Power {

  id: string;

  source: string;
  source_type: string;

  type: string;
  cost: { pips: number, resource: number };

  next_chain: string;

  tooltip: string;
  icon: string;

  cast_type: string;
  duration: number;
  cooldown: number;
  targeting: string;
  max_targets: number;
  range: number;

  static fromDTO(obj: any): Power {
    const p = new Power();

    return p;
  }

  static fromDBO(obj: any): Power {
    return this.fromDTO(obj);
  }

  constructor(power?: Power) {
    if(power != null) {

    } else {

    }
  }

  toDTO(): any {
    return {

    };
  }

  toDBO(): any {
    return this.toDTO();
  }
}
