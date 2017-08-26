import { Changelog } from '../changelog';
import { DataObjectService } from '../../service';
import { DataObjectInterface } from './data-object-interface';

import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLList,
} from 'graphql';

interface AttributeChange {
  attribute_name: string;
  attribute_new_value: any;
  attribute_old_value: any;
}

const AttributeChangeSchema: GraphQLObjectType = new GraphQLObjectType({
  name: 'attribute_change',
  description: 'An attribute change entry.',
  fields: () => ({
    attribute_name: {
      type:  new GraphQLNonNull(GraphQLString),
      description: 'The name of the attribute.'
    },
    attribute_new_value: {
      type:  new GraphQLNonNull(GraphQLString),
      description: 'The JSON string new value of the stat.',
      resolve: (a: AttributeChange) => JSON.stringify(a.attribute_new_value)
    },
    attribute_old_value: {
      type:  new GraphQLNonNull(GraphQLString),
      description: 'The JSON string old value of the stat.',
      resolve: (a: AttributeChange) => JSON.stringify(a.attribute_old_value)
    }
  })
});

export const ClassSchema: GraphQLObjectType = new GraphQLObjectType({
  name: 'changelog',
  description: 'A class.',
  fields: () => ({
    changedate: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The date which the change occured.',
      resolve: (cl: Changelog) => JSON.stringify(cl.changedate)
    },
    data_type: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The data type of the object which was changed.',
    },
    applies_to: {
      type: DataObjectInterface,
      description: 'The object which was changed.',
      resolve: (cl: Changelog) => DataObjectService.get(cl.applies_to)
    },
    change: {
      type: GraphQLString,
      description: 'The english changelog text.'
    },
    attributes: {
      type: new GraphQLList(GraphQLString),
      description: 'A list of attributes about the changes.'
    },
    changes: {
      type: new GraphQLList(AttributeChangeSchema),
      description: 'A list of specific changes that happened within the object.'
    }
  })
});

export default ClassSchema;
