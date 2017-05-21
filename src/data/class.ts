export class Class {

  static fromDTO(obj: any): Class {
    const c = new Class();

    return c;
  }

  static fromDBO(obj: any): Class {
    return this.fromDTO(obj);
  }

  constructor(clas?: Class) {
    if(clas != null) {

    } else {

    }
  }

  toDTO(): any {
    return {

    };
  }

  toDBO(): any {
    return this.toDTO();
  }
}
