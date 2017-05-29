import { IDataObject } from './interfaces';

export class Race implements IDataObject {

  static get data_type(): string { return 'race'; }
  data_type = Race.data_type;

  id: string;
  name: string;
  description: string;
  icon: string;
  classes: string[];

  static fromDTO(obj: any): Race {
    if(obj.data_type !== this.data_type && obj.data_type) throw new Error(`Datatype is not "${this.data_type}"!`);
    const r = new Race();
    r.id = obj.id || '';
    r.name = obj.name || '';
    r.description = obj.description || '';
    r.icon = obj.icon || '';
    r.classes = obj.classes instanceof Array ? obj.classes.slice() : [];
    return r;
  }

  static fromDBO(obj: any): Race {
    return this.fromDTO(obj);
  }

  constructor(race?: Race) {
    if(race != null) {
      this.id = race.id || '';
      this.name = race.name || '';
      this.description = race.description || '';
      this.icon = race.icon || '';
      this.classes = race.classes ? race.classes.slice() : [];
    } else {
      this.id = '';
      this.name = '';
      this.description = '';
      this.icon = '';
      this.classes = [];
    }
  }

  toDTO(): any {
    return {
      data_type: this.data_type,
      id: this.id,
      name: this.name,
      description: this.description,
      icon: this.icon,
      classes: this.classes.slice()
    };
  }

  toDBO(): any {
    return this.toDTO();
  }
}
