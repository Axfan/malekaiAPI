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

  stats: { name: string, value: number }[];

  equips: string[];

  slots_granted: string[];
  slots_removed: string[];

  tray_granted: string;
  tray_removed: string;

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

    d.stats = obj.stats instanceof Array ? obj.stats.slice() : [];

    d.equips = obj.equips instanceof Array ? obj.equips.slice() : [];

    d.slots_granted = obj.slots_granted instanceof Array ? obj.slots_granted.slice() : [];
    d.slots_removed = obj.slots_removed instanceof Array ? obj.slots_removed.slice() : [];

    d.tray_granted = obj.tray_granted || '';
    d.tray_removed = obj.tray_removed || '';

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

      this.stats = disc.stats ? disc.stats.slice() : [];

      this.equips = disc.equips ? disc.equips.slice() : [];

      this.slots_granted = disc.slots_granted ? disc.slots_granted.slice() : [];
      this.slots_removed = disc.slots_removed ? disc.slots_removed.slice() : [];

      this.tray_granted = disc.tray_granted || '';
      this.tray_removed = disc.tray_removed || '';

      this.powers = disc.powers ? disc.powers.slice() : [];
      this.tags = disc.tags ? disc.tags.slice() : [];

    } else {

      this.id = '';
      this.name =  '';
      this.description = '';
      this.type = '';

      this.classes = [];

      this.stats = [];

      this.equips = [];

      this.slots_granted = [];
      this.slots_removed = [];

      this.tray_granted =  '';
      this.tray_removed =  '';

      this.powers = [];
      this.tags = [];
    }
  }

  getIcon(): string {
    const category = this.type === 'race' ? 'races' : 'disciplines';
    return `${Env.cdnUrl}/images/${category}/${this.id}.png`
  }

  getIconSVG(): string {
    const category = this.type === 'race' ? 'races' : 'disciplines';
    return `${Env.cdnUrl}/svgs/${category}/${this.id}.svg`
  }

  toDTO(): any {
    return {
      data_type: this.data_type,

      id: this.id,
      name: this.name,
      description: this.description,
      type: this.type,

      icon: this.getIcon(),
      icon_svg: this.getIconSVG(),

      classes: this.classes,

      stats: this.stats.map(a => Object.assign({}, a)),

      equips: this.equips,

      slots_granted: this.slots_granted,
      slots_removed: this.slots_removed,

      tray_granted: this.tray_granted,
      tray_removed: this.tray_removed,

      powers: this.powers,
      tags: this.powers,
    };
  }

  toDBO(): any {
    return this.toDTO();
  }
}
