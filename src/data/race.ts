export class Race {

  name: string;
  description: string;
  icon: string;
  classes: string[];

  static fromDTO(obj: any): Race {
    const r = new Race();
    r.name = obj.name || '';
    r.description = obj.description || '';
    r.icon = obj.icon || '';
    r.classes = obj.classes instanceof Array ? obj.classes.slice() : [];
    return r;
  }

  static fromDBO(obj: any): Race {
    obj.name = obj.id;
    delete obj.id;
    return this.fromDTO(obj);
  }

  constructor(race?: Race) {
    if(race != null) {
      this.name = race.name || '';
      this.description = race.description || '';
      this.icon = race.icon || '';
      this.classes = race.classes ? race.classes.slice() : [];
    } else {
      this.name = '';
      this.description = '';
      this.icon = '';
      this.classes = [];
    }
  }

  toDTO(): any {
    return {
      name: this.name,
      description: this.description,
      icon: this.icon,
      classes: this.classes.slice()
    };
  }

  toDBO(): any {
    const o = this.toDTO();
    o.id = o.name;
    delete o.name;
    return o;
  }
}
