export class Changelog {

  changedate: Date;

  data_type: string;
  applies_to: string; // id

  change: string; // description, etc
  action: string; // 'added' | 'removed' | 'updated'

  attribute_name: string;
  attribute_new_value: string;
  attribute_old_value: string;

  static fromDTO(obj: any): Changelog {
    const log = new Changelog();
    log.changedate = new Date(obj.changedate);
    log.data_type = obj.data_type || '';
    log.applies_to = obj.applies_to || '';
    log.change = obj.change || '';
    log.action = obj.action || '';
    log.attribute_name = obj.attribute_name || '';
    log.attribute_new_value = obj.attribute_new_value || '';
    log.attribute_old_value = obj.attriute_old_value || '';
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
      this.action = log.action || '';
      this.attribute_name = log.attribute_name || '';
      this.attribute_new_value = log.attribute_new_value || '';
      this.attribute_old_value = log.attribute_old_value || '';
    } else {
      this.changedate = new Date();
      this.data_type = '';
      this.applies_to = '';
      this.change = '';
      this.action = '';
      this.attribute_name = '';
      this.attribute_new_value = '';
      this.attribute_old_value = '';
    }
  }

  toDTO(): any {
    return {
      changedate: new Date(this.changedate),
      data_type: this.data_type,
      applies_to: this.applies_to,
      change: this.change,
      action: this.action,
      attribute_name: this.attribute_name,
      attribute_new_value: this.attribute_new_value,
      attribute_old_value: this.attribute_old_value,
    };
  }

  toDBO(): any {
    return this.toDTO();
  }
}
