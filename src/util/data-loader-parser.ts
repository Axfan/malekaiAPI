import { Class, Discipline, Power } from '../data';
import { ClassService, DisciplineService, PowerService } from '../service';
import { IDataObject } from '../data/interfaces';

export class DataLoaderParser {
  static parseAndLoad(obj: { type: string, sub_type?: string, id: string }): Promise<IDataObject | Error> {
    switch(obj.type) {
      case Class.data_type: return ClassService.load(obj.id);
      case Discipline.data_type: return DisciplineService.load(obj.id, obj.sub_type ? { include: [obj.sub_type] } : null);
      case Power.data_type: return PowerService.load(obj.id);
      default:
        return Promise.resolve(new Error(
`Could not parse loader: bad type "${obj.type}"!
Object: ${JSON.stringify(obj, null, 2)}`));
    }
  }
}
