import { IDataObject } from './interfaces';

import { Env } from '../env';

export class Discipline implements IDataObject {

  static get data_type(): string { return 'discipline'; }
  data_type = Discipline.data_type;

  id: string; // i.e. "agent_provocateur"
  name: string; // i.e. "Agent Provocateur"
  description: string; // i.e. "Agent Provocateurs are sneaky, well-hidden, and difficult to track."
  type: string; // i.e. major/weapon/minor/race

  classes: string[]; // i.e. ["Assassin","Duelist","Ranger"]

  stats_granted: string[]; // i.e. ["Stealth"], ties in with stats_values
  stats_values: number[]; // i.e. [6.25], ties in with stats_granted

  equips_granted: string[];

  slots_granted: string[];
  slots_removed: string[];

  trays_granted: string;
  trays_removed: string;

  powers: string[]; // i.e.  ["Caltrops","Lay Low","Stink Bomb","Preparation"]
  tags: string[];

  public static fromDTO(obj: any) {
    if(obj.data_type !== this.data_type && obj.data_type) throw new Error(`Datatype is not "${this.data_type}"!`);
    const d = new Discipline();
    d.id = obj.id || '';
    d.name = obj.name || '';
    d.description = obj.description || '';
    d.type = obj.type || '';

    d.classes = obj.classes instanceof Array ? obj.classes.slice() : [];

    d.stats_granted = obj.stats_granted instanceof Array ? obj.stats_granted.slice() : [];
    d.stats_values = obj.stats_values instanceof Array ? obj.stats_values.slice() : [];

    d.equips_granted = obj.equips_granted instanceof Array ? obj.equips_granted.slice() : [];

    d.slots_granted = obj.slots_granted instanceof Array ? obj.slots_granted.slice() : [];
    d.slots_removed = obj.slots_removed instanceof Array ? obj.slots_removed.slice() : [];

    d.trays_granted = obj.trays_granted || '';
    d.trays_removed = obj.trays_removed || '';

    d.powers = obj.powers ? obj.powers.slice() : [];
    d.tags = obj.tags ? obj.tags.slice() : [];
    return d;
  }

  static fromDBO(obj: any): Discipline {
    return this.fromDTO(obj);
  }

  constructor(disc?: Discipline) {
    if(disc != null) {

      this.id = disc.id || '';
      this.name = disc.name || '';
      this.description = disc.description || '';
      this.type = disc.type || '';

      this.classes = disc.classes ? disc.classes.slice() : [];

      this.stats_granted = disc.stats_granted ? disc.stats_granted.slice() : [];
      this.stats_values = disc.stats_values ? disc.stats_values.slice() : [];

      this.equips_granted = disc.equips_granted ? disc.equips_granted.slice() : [];

      this.slots_granted = disc.slots_granted ? disc.slots_granted.slice() : [];
      this.slots_removed = disc.slots_removed ? disc.slots_removed.slice() : [];

      this.trays_granted = disc.trays_granted || '';
      this.trays_removed = disc.trays_removed || '';

      this.powers = disc.powers ? disc.powers.slice() : [];
      this.tags = disc.tags ? disc.tags.slice() : [];

    } else {

      this.id = '';
      this.name =  '';
      this.description = '';
      this.type = '';

      this.classes = [];

      this.stats_granted = [];
      this.stats_values = [];

      this.equips_granted = [];

      this.slots_granted = [];
      this.slots_removed = [];

      this.trays_granted =  '';
      this.trays_removed =  '';

      this.powers = [];
      this.tags = [];
    }
  }

  toDTO(): any {
    return {
      data_type: this.data_type,

      id: this.id,
      name: this.name,
      description: this.description,
      type: this.type,

      icon: `${Env.cdnUrl}/images/disciplines/${this.type}/${this.id}.png`,
      icon_svg: `${Env.cdnUrl}/svgs/disciplines/${this.type}/${this.id}.svg`,

      classes: this.classes,

      stats_granted: this.stats_granted,
      stats_values: this.stats_values,

      equips_granted: this.equips_granted,

      slots_granted: this.slots_granted,
      slots_removed: this.slots_removed,

      trays_granted: this.trays_granted,
      trays_removed: this.trays_removed,

      powers: this.powers,
      tags: this.powers,
    };
  }

  toDBO(): any {
    return this.toDTO();
  }
}
