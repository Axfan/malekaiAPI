import { IDataObject } from './interfaces';

export class Class implements IDataObject {

  static get data_type(): string { return 'class'; }
  data_type = Class.data_type;

  id: string;
  name: string;
  description: string;
  icon: string;
  races: string[];

  static fromDTO(obj: any): Class {
    if(obj.data_type !== this.data_type && obj.data_type) throw new Error(`Datatype is not "${this.data_type}"!`);
    const r = new Class();
    r.id = obj.id || '';
    r.name = obj.name || '';
    r.description = obj.description || '';
    r.icon = obj.icon || '';
    r.races = obj.races instanceof Array ? obj.races.slice() : [];
    return r;
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
    } else {
      this.id = '';
      this.name = '';
      this.description = '';
      this.icon = '';
      this.races = [];
    }
  }

  toDTO(): any {
    return {
      data_type: this.data_type,
      id: this.id,
      name: this.name,
      description: this.description,
      icon: this.icon,
      races: this.races.slice()
    };
  }

  toDBO(): any {
    return this.toDTO();
  }
}
