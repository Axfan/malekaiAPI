export class Power {

  name: string;
  tooltip: string;
  icon: string;

  source: string;
  source_type: string;

  type: string;
  cast_type: string;
  cost: { pips: number, resource: number };

  duration: number;
  cooldown: number;
  targeting: string;
  max_targets: number;
  range: number;
  next_chain: string[];

  static fromDTO(obj: any): Power {
    const p = new Power();
    p.name = obj.name || '';
    p.tooltip = obj.tooltip || '';
    p.icon = obj.icon || '';
    p.source = obj.source || '';
    p.source_type = obj.source_type || '';
    p.type = obj.type || '';
    p.cast_type = obj.cast_type || '';
    p.cost = obj.cost ? { pips: obj.cost.pips || 0, resource: obj.cost.resource || 0 } : { pips: 0, resource: 0 };
    p.duration = obj.duration || 0;
    p.cooldown = obj.cooldown || 0;
    p.targeting = obj.targeting || '';
    p.max_targets = obj.max_targets || 0;
    p.range = obj.range || 0;
    p.next_chain = obj.next_chain instanceof Array ? obj.next_chain.slice() : [];
    return p;
  }

  static fromDBO(obj: any): Power {
    return this.fromDTO(obj);
  }

  constructor(power?: Power) {
    if(power != null) {
      this.name = power.name || '';
      this.tooltip = power.tooltip || '';
      this.icon = power.icon || '';
      this.source = power.source || '';
      this.source_type = power.source_type || '';
      this.type = power.type || '';
      this.cast_type = power.cast_type || '';
      this.cost = power.cost ? { pips: power.cost.pips || 0, resource: power.cost.resource || 0 } : { pips: 0, resource: 0 };
      this.duration = power.duration || 0;
      this.cooldown = power.cooldown || 0;
      this.targeting = power.targeting || '';
      this.max_targets = power.max_targets || 0;
      this.range = power.range || 0;
      this.next_chain = power.next_chain instanceof Array ? power.next_chain.slice() : [];
    } else {
      this.name = '';
      this.tooltip = '';
      this.icon = '';
      this.source = '';
      this.source_type = '';
      this.type = '';
      this.cast_type = '';
      this.cost = { pips: 0, resource: 0 };
      this.duration = 0;
      this.cooldown = 0;
      this.targeting = '';
      this.max_targets = 0;
      this.range = 0;
      this.next_chain = [];
    }
  }

  toDTO(): any {
    return {
      name: this.name,
      tooltip: this.tooltip,
      icon: this.icon,
      source: this.source,
      source_type: this.source_type,
      type: this.type,
      cost: { pips: this.cost.pips, resource: this.cost.resource },
      duration: this.duration,
      cooldown: this.cooldown,
      targeting: this.targeting,
      max_targets: this.max_targets,
      range: this.range,
      next_chain: this.next_chain.slice()
    };
  }

  toDBO(): any {
    return this.toDTO();
  }
}
