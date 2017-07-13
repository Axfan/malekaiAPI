import { Discipline } from '../discipline';
import { ClassService, PowerService } from '../../service';
import DataObjectInterface from './data-object-interface';
import ClassSchema from './class-schema';
import PowerSchema from './power-schema';

import { Env } from '../../env';

import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLList,
  GraphQLFloat
} from 'graphql';

const StatSchema: GraphQLObjectType = new GraphQLObjectType({
  name: 'stat',
  description: 'A stat.',
  fields: () => ({
    name: {
      type: GraphQLString,
      description: 'The name of the stat.'
    },
    value: {
      type: GraphQLFloat,
      description: 'The value of the stat.'
    }
  })
});

export const DisciplineSchema: GraphQLObjectType = new GraphQLObjectType({
  name: Discipline.data_type,
  description: 'A discipline.',
  fields: () => ({
    data_type: {
      type: new GraphQLNonNull(GraphQLString),
      description: `The data type (${Discipline.data_type}).`,
      resolve: () => Discipline.data_type
    },
    id: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The id of the discipline.'
    },
    name: {
      type: GraphQLString,
      description: 'The name of the discipline.'
    },
    description: {
      type: GraphQLString,
      description: 'The description of the discipline.'
    },
    icon: {
      type: GraphQLString,
      description: 'The url to the icon of the class.'
    },
    icon_svg: {
      type: GraphQLString,
      description: 'The url to the svg icon of the class.'
    },
    type: {
      type: GraphQLString,
      description: 'The type of the discipline (i.e. Major/Minor/Weapon).'
    },
    classes: {
      type: new GraphQLList(ClassSchema),
      description: 'The classes that can equip the discipline.',
      resolve: (obj: Discipline) => ClassService.load(obj.classes)
    },
    stats_granted: {
      type: new GraphQLList(StatSchema),
      description: 'The stats that are granted by the discipline.',
      resolve: (obj: Discipline) => obj.stats_granted.map((v, i) => ({ name: v, value: obj.stats_values[i] }))
    },
    equips_granted: {
      type: new GraphQLList(GraphQLString),
      description: 'The equips granted by the discipline.' // fix
    },
    slots_granted: {
      type: new GraphQLList(GraphQLString),
      description: 'The slots granted by the discipline.'
    },
    slots_removed: {
      type: new GraphQLList(GraphQLString),
      description: 'The slots removed by the discipline.'
    },
    trays_granted: {
      type: GraphQLString,
      description: 'The trays granted by the discipline.'
    },
    trays_removed: {
      type: GraphQLString,
      description: 'The trays removed by the discipline.'
    },
    powers: {
      type: new GraphQLList(PowerSchema),
      description: 'The powers granted by the discipline.',
      resolve: (obj: Discipline) => PowerService.load(obj.powers)
    },
    tags: {
      type: new GraphQLList(GraphQLString),
      description: 'The tags that describe the discipline.'
    }
  }),
  interfaces: () => [ DataObjectInterface ]
});

export default DisciplineSchema;
