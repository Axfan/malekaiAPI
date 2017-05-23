export class Class {

  name: string;
  description: string;
  icon: string;
  races: string[];

  static fromDTO(obj: any): Class {
    const r = new Class();
    r.name = obj.name || '';
    r.description = obj.description || '';
    r.icon = obj.icon || '';
    r.races = obj.races instanceof Array ? obj.races.slice() : [];
    return r;
  }

  static fromDBO(obj: any): Class {
    obj.name = obj.id;
    delete obj.id;
    return this.fromDTO(obj);
  }

  constructor(clas?: Class) {
    if(clas != null) {
      this.name = clas.name || '';
      this.description = clas.description || '';
      this.icon = clas.icon || '';
      this.races = clas.races ? clas.races.slice() : [];
    } else {
      this.name = '';
      this.description = '';
      this.icon = '';
      this.races = [];
    }
  }

  toDTO(): any {
    return {
      name: this.name,
      description: this.description,
      icon: this.icon,
      races: this.races.slice()
    };
  }

  toDBO(): any {
    const o = this.toDTO();
    o.id = o.name;
    delete o.name;
    return o;
  }
}
