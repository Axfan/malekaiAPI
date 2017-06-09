import { Race, Class, Discipline, Power } from '../data';
import { IDataObject } from '../data/interfaces';

export class DataParser {
  static parseDBO(obj: any): IDataObject {
    switch(obj.data_type) {
      case Race.data_type: return Race.fromDBO(obj);
      case Class.data_type: return Class.fromDBO(obj);
      case Discipline.data_type: return Discipline.fromDBO(obj);
      case Power.data_type: return Power.fromDBO(obj);
      default:
        console.warn(new Error(`Could not parse object: bad data_type "${obj.data_type}"!`));
        return obj;
    }
  }
}
