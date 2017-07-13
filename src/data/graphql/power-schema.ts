import { Power } from '../power';
import { PowerService, DataObjectService } from '../../service';
import { DataLoaderParser } from '../../util';
import DataObjectInterface from './data-object-interface';
import RaceSchema from './race-schema';

import { Env } from '../../env';

import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLFloat
} from 'graphql';

const CostSchema: GraphQLObjectType = new GraphQLObjectType({
  name: 'cost',
  description: 'A cost.',
  fields: () => ({
    pips: {
      type: GraphQLInt,
      description: 'The pip cost.'
    },
    resource: {
      type: GraphQLFloat,
      description: 'The resource cost.'
    }
  })
})

export const PowerSchema: GraphQLObjectType = new GraphQLObjectType({
  name: Power.data_type,
  description: 'A power.',
  fields: () => ({
    data_type: {
      type: new GraphQLNonNull(GraphQLString),
      description: `The data type (${Power.data_type}).`,
      resolve: () => Power.data_type
    },
    id: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The id of the power.'
    },
    name: {
      type: GraphQLString,
      description: 'The name of the power.'
    },
    description: {
      type: GraphQLString,
      description: 'The description of the power.'
    },
    icon: {
      type: GraphQLString,
      description: 'The url to the icon of the class.'
    },
    icon_svg: {
      type: GraphQLString,
      description: 'The url to the svg icon of the class.'
    },
    sources: {
      type: new GraphQLList(DataObjectInterface),
      description: 'The source of the power.',
      resolve: (obj: Power) => obj.sources.map(a => DataLoaderParser.parseAndLoad(a))
    },
    type: {
      type: GraphQLString,
      description: 'The type of the power.'
    },
    cast_type: {
      type: GraphQLString,
      description: 'The cast type of the power.'
    },
    cost: {
      type: CostSchema,
      description: 'The cost of the power.'
    },
    duration: {
      type: GraphQLFloat,
      description: 'The duration of the power.'
    },
    cooldown: {
      type: GraphQLFloat,
      description: 'The cooldown time of the power.'
    },
    targeting: {
      type: GraphQLString,
      description: 'The targeting type of the power.'
    },
    max_targets: {
      type: GraphQLFloat,
      description: 'The max targets of the power.'
    },
    range: {
      type: GraphQLFloat,
      description: 'The range of the power.'
    },
    next_chain: {
      type: new GraphQLList(PowerSchema),
      description: 'The next powers in the chain.',
      resolve: (obj: Power) => PowerService.load(obj.next_chain)
    },
    previous_chain: {
      type: new GraphQLList(PowerSchema),
      description: 'The previous powers in the chain.',
      resolve: (obj: Power) => PowerService.load(obj.previous_chain)
    },
    tags: {
      type: new GraphQLList(GraphQLString),
      description: 'The tags that describe the power.'
    }
  }),
  interfaces: () => [ DataObjectInterface ]
});

export default PowerSchema;
