import DataObjectInterface from './data-object-interface';
import ClassSchema from './class-schema';
import DisciplineSchema from './discipline-schema';
import PowerSchema from './power-schema';
import ChangelogSchema from './changelog-schema';
import {
  ClassService,
  DisciplineService,
  PowerService,
  ChangelogService,
  DataObjectService,
  SearchService
} from '../../service';

import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLInt,
  GraphQLEnumType,
  GraphQLList
} from 'graphql';

export const RootSchema: GraphQLSchema = new GraphQLSchema({
    query: new GraphQLObjectType({
      name: 'RootQueryType',
      fields: {
        hello: {
          description: 'Hello world!',
          type: GraphQLString,
          resolve() { return 'world'; }
        },
        search: {
          description: 'Search the Database',
          type: new GraphQLList(DataObjectInterface),
          args: {
            text: {
              description: 'The search text.',
              type: new GraphQLNonNull(GraphQLString),
            },
            table: {
              description: 'The table to search. Leave empty for "all".',
              type: new GraphQLEnumType({
                name: 'TableEnum',
                values: { RACES: {}, CLASSES: {}, DISCIPLINES: {}, POWERS: {} }
              })
            },
            skip: {
              description: 'Where to start the results.',
              type: GraphQLInt
            },
            limit: {
              description: 'Limit the results to an amount. Capped between 1 and 50.',
              type: GraphQLInt
            },
            sortField: {
              description: 'How to order the results.',
              type: GraphQLString
            },
            sortDirection: {
              description: 'The sort direction',
              type: new GraphQLEnumType({
                name: 'SortDirection',
                values: { ASCENDING: { value: false }, DESCENDING: { value: true } },
              })
            }
          },
          resolve: (root, { text, table, skip, limit, sortField, sortDirection }) => {
            sortDirection = !(sortDirection || false);
            return SearchService.searchText(text, table, skip, limit, sortField, sortDirection);
          }
        },
        data_object: {
          type: DataObjectInterface,
          description: 'A data object.',
          args: {
            id: {
              description: 'The id of the data object.',
              type: GraphQLString
            },
            name: {
              description: 'The name of the data object.',
              type: GraphQLString
            }
          },
          resolve: (root, { id, name }) => {
            if(id) return DataObjectService.get(id);
            else return DataObjectService.getFromName(name);
          }
        },
        race: {
          type: DisciplineSchema,
          description: 'A race.',
          args: {
            id: {
              description: 'The id of the race.',
              type: GraphQLString
            },
            name: {
              description: 'The name of the race.',
              type: GraphQLString
            }
          },
          resolve: (root, { id, name }) => {
            if(id) return DisciplineService.get(id, { include: ['race'] });
            else return DisciplineService.getFromName(name, { include: ['race'] });
          }
        },
        class: {
          type: ClassSchema,
          description: 'A class.',
          args: {
            id: {
              description: 'The id of the class.',
              type: GraphQLString
            },
            name: {
              description: 'The name of the class.',
              type: GraphQLString
            }
          },
          resolve: (root, { id, name }) => {
            if(id) return ClassService.get(id);
            else return ClassService.getFromName(name);
          }
        },
        discipline: {
          type: DisciplineSchema,
          description: 'A discipline.',
          args: {
            id: {
              description: 'The id of the discipline.',
              type: GraphQLString
            },
            name: {
              description: 'The name of the discipline.',
              type: GraphQLString
            }
          },
          resolve: (root, { id, name }) => {
            if(id) return DisciplineService.get(id, { exclude: ['race'] });
            else return DisciplineService.getFromName(name, { exclude: ['race'] });
          }
        },
        power: {
          type: PowerSchema,
          description: 'A power.',
          args: {
            id: {
              description: 'The id of the power.',
              type: GraphQLString
            },
            name: {
              description: 'The name of the power.',
              type: GraphQLString
            }
          },
          resolve: (root, { id, name }) => {
            if(id) return PowerService.get(id);
            else return PowerService.getFromName(name);
          }
        },
        changelog: {
          type: new GraphQLList(ChangelogSchema),
          description: 'All the changelogs for a specific data object.',
          args: {
            data_type: {
              description: 'The data type of the object',
              type: new GraphQLNonNull(GraphQLString)
            },
            id: {
              description: 'The id of the object',
              type: new GraphQLNonNull(GraphQLString)
            },
            skip: {
              description: 'The amount to skip.',
              type: GraphQLInt
            },
            amount: {
              description: 'The amount to get.',
              type: GraphQLInt
            }
          },
          resolve: (root, { data_type, id, skip, amount }) => {
            return ChangelogService.get(data_type, id, skip, amount);
          }
        },
        races: {
          type: new GraphQLList(DisciplineSchema),
          description: 'All the races.',
          resolve: (root) => {
            return DisciplineService.getAll({ include: ['race'] });
          }
        },
        classes: {
          type: new GraphQLList(ClassSchema),
          description: 'All the classes.',
          resolve: (root) => {
            return ClassService.getAll();
          }
        },
        disciplines: {
          type: new GraphQLList(DisciplineSchema),
          description: 'All the disciplines.',
          resolve: (root) => {
            return DisciplineService.getAll({ exclude: ['race'] });
          }
        },
        powers: {
          type: new GraphQLList(PowerSchema),
          description: 'All the powers.',
          resolve: (root) => {
            return PowerService.getAll();
          }
        },
        changelogs: {
          type: new GraphQLList(ChangelogSchema),
          description: 'All the changelogs.',
          args: {
            skip: {
              description: 'The amount to skip.',
              type: GraphQLInt
            },
            amount: {
              description: 'The amount to get.',
              type: GraphQLInt
            }
          },
          resolve: (root, { skip, amount }) => {
            return ChangelogService.getLast(skip, amount);
          }
        }
      },
    }),
    types: [ ClassSchema, DisciplineSchema, PowerSchema ]
  });

export default RootSchema;
