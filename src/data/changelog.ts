export class Changelog {

  changedate: Date;

  data_type: string;
  applies_to: string; // id

  change: string; // description, etc

  attributes: {
    attribute_name: string;
    attribute_new_value: any;
    attribute_old_value: any;
  }[];

  static fromDTO(obj: any): Changelog {
    const log = new Changelog();
    log.changedate = new Date(obj.changedate);
    log.data_type = obj.data_type || '';
    log.applies_to = obj.applies_to || '';
    log.change = obj.change || '';
    log.attributes = obj.changes instanceof Array ? obj.changes.slice().map(a => { return {
        attribute_name: a.attribute_name || '',
        attribute_new_value: a.attribute_new_value || null,
        attribute_old_value: a.attribute_old_value || null,
      }; }) : [];
    return log;
  }

  static fromDBO(obj: any): Changelog {
    return this.fromDTO(obj);
  }

  constructor(log?: Changelog) {
    if(log != null) {
      this.changedate = new Date(log.changedate);
      this.data_type = log.data_type || '';
      this.applies_to = log.applies_to || '';
      this.change = log.change || '';
      this.attributes = log.attributes.slice(); // I know, keeps references.. but I don't want to use
      //                                      the resources to deep copy.
    } else {
      this.changedate = new Date();
      this.data_type = '';
      this.applies_to = '';
      this.change = '';
      this.attributes = [];
    }
  }

  toDTO(): any {
    return {
      changedate: new Date(this.changedate),
      data_type: this.data_type,
      applies_to: this.applies_to,
      change: this.change,
      attributes: this.attributes.map(a => Object.assign({}, a))
    };
  }

  toDBO(): any {
    return this.toDTO();
  }
}
