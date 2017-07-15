import { IDataObject } from './interfaces';

import { Env } from '../env';

export class Power implements IDataObject {

  static get data_type(): string { return 'power'; }
  data_type = Power.data_type;

  id: string;
  name: string;
  description: string

  sources: { type: string, id: string }[];

  type: string;
  cast_type: string;

  cost: { pips: number, resource: number };
  duration: number;
  cooldown: number;

  targeting: string;
  max_targets: number;
  range: number;

  next_chain: string[];
  previous_chain: string[];
  tags: string[];

  static fromDTO(obj: any): Power {
    if(obj.data_type !== this.data_type && obj.data_type) throw new Error(`Datatype is not "${this.data_type}"!`);
    const p = new Power();
    p.id = obj.id || '';
    p.name = obj.name || '';
    p.description = obj.description || '';

    p.sources = obj.sources instanceof Array ? obj.sources.map(a => { return { type: a.type, id: a.id }; }) : [];

    p.type = obj.type || '';
    p.cast_type = obj.cast_type || '';

    p.cost = obj.cost ? { pips: obj.cost.pips || 0, resource: obj.cost.resource || 0 } : { pips: 0, resource: 0 };
    p.duration = obj.duration || 0;
    p.cooldown = obj.cooldown || 0;

    p.targeting = obj.targeting || '';
    p.max_targets = obj.max_targets || 0;
    p.range = obj.range || 0;

    p.next_chain = obj.next_chain instanceof Array ? obj.next_chain.slice() : [];
    p.previous_chain = obj.previous_chain instanceof Array ? obj.previous_chain.slice() : [];

    p.tags = obj.tags instanceof Array ? obj.tags.slice() : [];
    return p;
  }

  static fromDBO(obj: any): Power {
    return this.fromDTO(obj);
  }

  constructor(power?: Power) {
    if(power != null) {
      this.id = power.id || '';
      this.name = power.name || '';
      this.description = power.description || '';

      this.sources = power.sources instanceof Array ? power.sources.map(a => { return { type: a.type, id: a.id }; }) : [];

      this.type = power.type || '';
      this.cast_type = power.cast_type || '';

      this.cost = power.cost ? { pips: power.cost.pips || 0, resource: power.cost.resource || 0 } : { pips: 0, resource: 0 };
      this.duration = power.duration || 0;
      this.cooldown = power.cooldown || 0;

      this.targeting = power.targeting || '';
      this.max_targets = power.max_targets || 0;
      this.range = power.range || 0;

      this.next_chain = power.next_chain instanceof Array ? power.next_chain.slice() : [];
      this.previous_chain = power.previous_chain instanceof Array ? power.previous_chain.slice() : [];

      this.tags = power.tags instanceof Array ? power.tags.slice() : [];
    } else {
      this.id = '';
      this.name = '';
      this.description = '';

      this.sources = [];

      this.type = '';
      this.cast_type = '';

      this.cost = { pips: 0, resource: 0 };
      this.duration = 0;
      this.cooldown = 0;

      this.targeting = '';
      this.max_targets = 0;
      this.range = 0;

      this.next_chain = [];
      this.previous_chain = [];

      this.tags = [];
    }
  }

  getIcon(): string {
    return `${Env.cdnUrl}/images/classes/${this.type}/${this.id}.png`
  }

  getIconSVG(): string {
    return `${Env.cdnUrl}/svgs/classes/${this.type}/${this.id}.svg`
  }

  toDTO(): any {
    return {
      data_type: this.data_type,

      id: this.id,
      name: this.name,
      description: this.description,
      icon: this.getIcon(),
      icon_svg: this.getIconSVG(),

      sources: this.sources.map(a => { return { type: a.type, id: a.id }; }),

      type: this.type,
      cast_type: this.cast_type,

      cost: { pips: this.cost.pips, resource: this.cost.resource },
      duration: this.duration,
      cooldown: this.cooldown,

      targeting: this.targeting,
      max_targets: this.max_targets,
      range: this.range,

      next_chain: this.next_chain.slice(),
      previous_chain: this.previous_chain.slice(),

      tags: this.tags.slice(),
    };
  }

  toDBO(): any {
    return this.toDTO();
  }
}
