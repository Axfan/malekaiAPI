import { IDataObject } from './interfaces';

export class Class implements IDataObject {

  static get data_type(): string { return 'class'; }
  data_type = Class.data_type;

  id: string;
  name: string;
  description: string;
  icon: string;
  races: string[];
  powers: string[];
  tags: string[];

  static fromDTO(obj: any): Class {
    if(obj.data_type !== this.data_type && obj.data_type) throw new Error(`Datatype is not "${this.data_type}"!`);
    const c = new Class();
    c.id = obj.id || '';
    c.name = obj.name || '';
    c.description = obj.description || '';
    c.icon = obj.icon || '';
    c.races = obj.races instanceof Array ? obj.races.slice() : [];
    c.powers = obj.powers instanceof Array ? obj.powers.slice() : [];
    c.tags = obj.tags instanceof Array ? obj.tags.slice() : [];
    return c;
  }

  static fromDBO(obj: any): Class {
    return this.fromDTO(obj);
  }

  constructor(clas?: Class) {
    if(clas != null) {
      this.id = clas.id || '';
      this.name = clas.name || '';
      this.description = clas.description || '';
      this.icon = clas.icon || '';
      this.races = clas.races ? clas.races.slice() : [];
      this.powers = clas.powers ? clas.powers.slice() : [];
      this.tags = clas.tags ? clas.tags.slice() : [];
    } else {
      this.id = '';
      this.name = '';
      this.description = '';
      this.icon = '';
      this.races = [];
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
      icon: this.icon,
      races: this.races.slice(),
      powers: this.powers.slice(),
      tags: this.tags.slice(),
    };
  }

  toDBO(): any {
    return this.toDTO();
  }
}
