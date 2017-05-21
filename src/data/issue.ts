export class Issue {

  date: Date;
  table: string;
  id: string;
  field: string;
  desc: string;

  static fromDTO(obj: any): Issue {
    const i = new Issue();
    i.date = new Date(obj.date);
    i.table = obj.table || '';
    i.id = obj.id || '';
    i.field = obj.field || '';
    i.desc = obj.desc || '';
    return i;
  }

  static fromDBO(obj: any): Issue {
    return this.fromDTO(obj);
  }

  constructor(issue?: Issue) {
    if(issue != null) {
      this.date = new Date(issue.date);
      this.table = issue.table || '';
      this.id = issue.id || '';
      this.field = issue.field || '';
      this.desc = issue.desc || '';
    } else {
      this.date = new Date();
      this.table = '';
      this.id = '';
      this.field = '';
      this.desc = '';
    }
  }

  toDTO(): any {
    return {
      date: new Date(this.date),
      table: this.table,
      id: this.id,
      field: this.field,
      desc: this.desc
    };
  }

  toDBO(): any {
    return this.toDTO();
  }
}
