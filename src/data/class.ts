import { IDataObject } from './interfaces';

import { Env } from '../env';

export class Class implements IDataObject {

  static get data_type(): string { return 'class'; }
  data_type = Class.data_type;

  id: string;
  name: string;
  description: string;
  races: string[];
  powers: string[];
  tags: string[];

  static fromDTO(obj: any): Class {
    if(obj.data_type !== this.data_type && obj.data_type) throw new Error(`Datatype is not "${this.data_type}"!`);
    const c = new Class();
    c.id = obj.id || '';
    c.name = obj.name || '';
    c.description = obj.description || '';
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
      this.races = clas.races ? clas.races.slice() : [];
      this.powers = clas.powers ? clas.powers.slice() : [];
      this.tags = clas.tags ? clas.tags.slice() : [];
    } else {
      this.id = '';
      this.name = '';
      this.description = '';
      this.races = [];
      this.powers = [];
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
      races: this.races.slice(),
      powers: this.powers.slice(),
      tags: this.tags.slice(),
    };
  }

  toDBO(): any {
    return this.toDTO();
  }
}
