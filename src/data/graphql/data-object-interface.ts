import { IDataObject } from '../interfaces';
import { Race, Class, Discipline, Power } from '..';
import RaceSchema from './race-schema';
import ClassSchema from './class-schema';
import DisciplineSchema from './discipline-schema';
import PowerSchema from './power-schema';

import {
  GraphQLInterfaceType,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLList,
  GraphQLString
} from 'graphql';

export const DataObjectInterface: GraphQLInterfaceType = new GraphQLInterfaceType({
  name: 'data_object',
  description: 'A data object.',
  fields: () => ({
    data_type: {
      type: new GraphQLNonNull(GraphQLString),
      description: `The data type.`,
    },
    id: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The id of the data object.'
    },
    name: {
      type: GraphQLString,
      description: 'The name of the data object.'
    },
    description: {
      type: GraphQLString,
      description: 'The description of the data object.'
    },
    icon: {
      type: GraphQLString,
      description: 'The url to the icon of the data object.'
    },
    tags: {
      type: new GraphQLList(GraphQLString),
      description: 'The tags that describe the data object.'
    }
  }),
  resolveType (obj: IDataObject): GraphQLObjectType {
    switch(obj.data_type) {
      case Race.data_type: return RaceSchema;
      case Class.data_type: return ClassSchema;
      case Discipline.data_type: return DisciplineSchema;
      case Power.data_type: return PowerSchema;
      default:
        console.warn(new Error(`Could not parse object: bad data_type "${obj.data_type}"!`));
    }
  }
});

export default DataObjectInterface;
