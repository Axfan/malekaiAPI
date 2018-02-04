import { Changelog } from '../changelog';
import { DataObjectService } from '../../service';
import { DataObjectInterface } from './data-object-interface';
import { DataLoaderParser } from '../../util/data-loader-parser';

import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLList,
} from 'graphql';

export const ChangelogSchema: GraphQLObjectType = new GraphQLObjectType({
  name: 'changelog',
  description: 'A changelog entry.',
  fields: () => ({
    data_type: {
      type: new GraphQLNonNull(GraphQLString),
      description: `The data type (${Changelog.data_type}).`,
      resolve: () => Changelog.data_type
    },
    changedate: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The date which the change occured.',
      resolve: (cl: Changelog) => JSON.stringify(cl.changedate).replace(/^"|"$/g, '')
    },
    category: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The data type of the object which was changed.',
    },
    id: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The id of the object which was changed.',
      resolve: (cl: Changelog) => cl.applies_to
    },
    applies_to: {
      type: DataObjectInterface,
      description: 'The object which was changed.',
      resolve: (cl: Changelog) => {
        if(cl.applies_to !== '*')
          return DataLoaderParser.parseAndLoad({ data_type: cl.category, id: cl.applies_to }).catch(e => null);
        else return null;
      }
    },
    change: {
      type: GraphQLString,
      description: 'The english changelog text.'
    },
    action: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The change action: can be "added", "removed", or "updated".'
    },
    attribute_name: {
      type:  new GraphQLNonNull(GraphQLString),
      description: 'The name of the attribute that was changed.',
    },
    attribute_new_value: {
      type:  new GraphQLNonNull(GraphQLString),
      description: 'The stringified new value of the attribute.',
    },
    attribute_old_value: {
      type:  new GraphQLNonNull(GraphQLString),
      description: 'The stringified old value of the attribute.',
    }
  })
});

export default ChangelogSchema;
