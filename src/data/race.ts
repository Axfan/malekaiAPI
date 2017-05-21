export class Race {

  static fromDTO(obj: any): Race {
    const r = new Race();

    return r;
  }

  static fromDBO(obj: any): Race {
    return this.fromDTO(obj);
  }

  constructor(race?: Race) {
    if(race != null) {

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
