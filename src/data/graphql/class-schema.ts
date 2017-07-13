import { Class } from '../class';
import { RaceService, PowerService } from '../../service';
import { DataObjectInterface } from './data-object-interface';
import { RaceSchema } from './race-schema';
import { PowerSchema } from './power-schema';

import { Env } from '../../env';

import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLList
} from 'graphql';

export const ClassSchema: GraphQLObjectType = new GraphQLObjectType({
  name: Class.data_type,
  description: 'A class.',
  fields: () => ({
    data_type: {
      type: new GraphQLNonNull(GraphQLString),
      description: `The data type (${Class.data_type}).`,
      resolve: () => Class.data_type
    },
    id: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The id of the class.'
    },
    name: {
      type: GraphQLString,
      description: 'The name of the class.'
    },
    description: {
      type: GraphQLString,
      description: 'The description of the class.'
    },
    icon: {
      type: GraphQLString,
      description: 'The url to the icon of the class.'
    },
    icon_svg: {
      type: GraphQLString,
      description: 'The url to the svg icon of the class.'
    },
    races: {
      type: new GraphQLList(RaceSchema),
      description: 'The races the class can be used by.',
      resolve: (clas: Class) => RaceService.load(clas.races)
    },
    powers: {
      type: new GraphQLList(PowerSchema),
      description: 'The default powers the class gives.',
      resolve: (clas: Class) => PowerService.load(clas.powers)
    },
    tags: {
      type: new GraphQLList(GraphQLString),
      description: 'The tags that describe the class.'
    }
  }),
  interfaces: () => [ DataObjectInterface ]
});

export default ClassSchema;
