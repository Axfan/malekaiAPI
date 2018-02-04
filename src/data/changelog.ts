/**
 * The changelog class.
 *
 * Notes:
 *
 * To determine if an entire object (class/discipline/power/etc) was added or
 * removed, `attribute_new_value` and `attribute_old_value` will both be
 * empty, and `attribute_name` will be the name of the object. `action`
 * will be the action that happened to it (added/removed).
 */
export class Changelog {

  changedate: Date;

  static get data_type() { return "patchnote" }
  data_type = Changelog.data_type;
  category: string; // applies_to => data_type
  applies_to: string; // id

  change: string; // description, etc
  action: string; // 'added' | 'removed' | 'updated'

  attribute_name: string;
  attribute_new_value: string;
  attribute_old_value: string;

  static fromDTO(obj: any): Changelog {
    if(obj.data_type !== this.data_type && obj.data_type) throw new Error(`Datatype is not "${this.data_type}"!`);
    const log = new Changelog();
    log.changedate = new Date(obj.changedate);
    log.category = obj.category || '';
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
      this.category = log.category || '';
      this.applies_to = log.applies_to || '';
      this.change = log.change || '';
      this.action = log.action || '';
      this.attribute_name = log.attribute_name || '';
      this.attribute_new_value = log.attribute_new_value || '';
      this.attribute_old_value = log.attribute_old_value || '';
    } else {
      this.changedate = new Date();
      this.category = '';
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
      data_type: this.data_type,
      changedate: new Date(this.changedate),
      category: this.category,
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
