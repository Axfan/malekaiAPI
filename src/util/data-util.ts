import { Logger } from './logger';
import { Class, Discipline, Power } from '../data';
import { IDataObject } from '../data/interfaces';

export class DataUtil {
  static parseDBO(obj: any): IDataObject {
    switch(obj.data_type) {
      case Class.data_type: return Class.fromDBO(obj);
      case Discipline.data_type: return Discipline.fromDBO(obj);
      case Power.data_type: return Power.fromDBO(obj);
      default:
        Logger.error('DataParser', `Object: ${JSON.stringify(obj, null, 2)}` +
                    new Error(`Could not parse object: bad data_type "${obj.data_type}"!`));
        return obj;
    }
  }

  static parseDTO(obj: any): IDataObject {
    switch(obj.data_type) {
      case Class.data_type: return Class.fromDTO(obj);
      case Discipline.data_type: return Discipline.fromDTO(obj);
      case Power.data_type: return Power.fromDTO(obj);
      default:
        Logger.error('DataParser', `Object: ${JSON.stringify(obj, null, 2)}` +
                    new Error(`Could not parse object: bad data_type "${obj.data_type}"!`));
        return obj;
    }
  }

  static changes(base: Object, updated: Object): Object {
    const changes = { };
    for(const key in base) {
      if(JSON.stringify(updated[key]) !== JSON.stringify(base[key]) && (typeof base[key] === typeof updated[key]))
        changes[key] = updated[key];
    }
    return changes;
  }
}
