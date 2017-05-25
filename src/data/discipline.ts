export class Discipline {

  name: string; // i.e. "Agent Provocateur"
  description: string; // i.e. "Agent Provocateurs are sneaky, well-hidden, and difficult to track."
  type: string; // i.e. major/weapon/minor

  icon: string; // i.e. ''

  can_equip: string[]; // i.e. ["Assassin","Duelist","Ranger"]

  stats_granted: string[]; // i.e. ["Stealth"], ties in with stats_values
  stats_values: number[]; // i.e. [6.25], ties in with stats_granted

  equips_granted: string[];

  slots_granted: string[];
  slots_removed: string[];

  trays_granted: string;
  trays_removed: string;

  powers_granted: string[]; // i.e.  ["Caltrops","Lay Low","Stink Bomb","Preparation"]

  public static fromDTO(obj: any) {
    const d = new Discipline();
    d.name = obj.name || '';
    d.description = obj.description || '';
    d.type = obj.type || '';

    d.icon = obj.icon || '';

    d.can_equip = obj.can_equip instanceof Array ? obj.can_equip.slice() : [];

    d.stats_granted = obj.stats_granted instanceof Array ? obj.stats_granted.slice() : [];
    d.stats_values = obj.stats_values instanceof Array ? obj.stats_values.slice() : [];

    d.equips_granted = obj.equips_granted instanceof Array ? obj.equips_granted.slice() : [];

    d.slots_granted = obj.slots_granted instanceof Array ? obj.slots_granted.slice() : [];
    d.slots_removed = obj.slots_removed instanceof Array ? obj.slots_removed.slice() : [];

    d.trays_granted = obj.trays_granted || '';
    d.trays_removed = obj.trays_removed || '';

    d.powers_granted = obj.powers_granted ? obj.powers_granted.slice() : [];
    return d;
  }

  static fromDBO(obj: any): Discipline {
    obj.name = obj.id;
    delete obj.id;
    return this.fromDTO(obj);
  }

  constructor(disc?: Discipline) {
    if(disc != null) {

      this.name = disc.name || '';
      this.description = disc.description || '';
      this.type = disc.type || '';

      this.icon = disc.icon || '';

      this.can_equip = disc.can_equip ? disc.can_equip.slice() : [];

      this.stats_granted = disc.stats_granted ? disc.stats_granted.slice() : [];
      this.stats_values = disc.stats_values ? disc.stats_values.slice() : [];

      this.equips_granted = disc.equips_granted ? disc.equips_granted.slice() : [];

      this.slots_granted = disc.slots_granted ? disc.slots_granted.slice() : [];
      this.slots_removed = disc.slots_removed ? disc.slots_removed.slice() : [];

      this.trays_granted = disc.trays_granted || '';
      this.trays_removed = disc.trays_removed || '';

      this.powers_granted = disc.powers_granted ? disc.powers_granted.slice() : [];

    } else {

      this.name =  '';
      this.description = '';
      this.type = '';

      this.icon =  '';

      this.can_equip = [];

      this.stats_granted = [];
      this.stats_values = [];

      this.equips_granted = [];

      this.slots_granted = [];
      this.slots_removed = [];

      this.trays_granted =  '';
      this.trays_removed =  '';

      this.powers_granted = [];
    }
  }

  toDTO(): any {
    return {
      name: this.name,
      description: this.description,
      type: this.type,

      icon: this.icon,

      can_equip: this.can_equip,

      stats_granted: this.stats_granted,
      stats_values: this.stats_values,

      equips_granted: this.equips_granted,

      slots_granted: this.slots_granted,
      slots_removed: this.slots_removed,

      trays_granted: this.trays_granted,
      trays_removed: this.trays_removed,

      powers_granted: this.powers_granted,
    };
  }

  toDBO(): any {
    const o = this.toDTO();
    o.id = o.name;
    delete o.name;
    return o;
  }
}
