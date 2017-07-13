import { Race } from '../race';
import { ClassService } from '../../service/class.service';
import DataObjectInterface from './data-object-interface';
import ClassSchema from './class-schema';

import { Env } from '../../env';

import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLList
} from 'graphql';

export const RaceSchema: GraphQLObjectType = new GraphQLObjectType({
  name: Race.data_type,
  description: 'A race.',
  fields: () => ({
    data_type: {
      type: new GraphQLNonNull(GraphQLString),
      description: `The data type (${Race.data_type}).`,
      resolve: () => Race.data_type
    },
    id: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The id of the race.'
    },
    name: {
      type: GraphQLString,
      description: 'The name of the race.'
    },
    description: {
      type: GraphQLString,
      description: 'The description of the race.'
    },
    icon: {
      type: GraphQLString,
      description: 'The url to the icon of the class.'
    },
    icon_svg: {
      type: GraphQLString,
      description: 'The url to the svg icon of the class.'
    },
    classes: {
      type: new GraphQLList(ClassSchema),
      description: 'The classes the race can be used by.',
      resolve: (race: Race) => ClassService.load(race.classes)
    },
    tags: {
      type: new GraphQLList(GraphQLString),
      description: 'The tags that describe the race.'
    }
  }),
  interfaces: () => [ DataObjectInterface ]
});

export default RaceSchema;
