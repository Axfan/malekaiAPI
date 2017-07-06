import DataObjectInterface from './data-object-interface';
import RaceSchema from './race-schema';
import ClassSchema from './class-schema';
import DisciplineSchema from './discipline-schema';
import PowerSchema from './power-schema';
import {
  RaceService,
  ClassService,
  DisciplineService,
  PowerService,
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
            limit: {
              description: 'Limit the results to an amount.',
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
          resolve: (root, { text, table, limit, sortField, sortDirection }) => {
            console.log(`gql: search (text: ${text}, table: ${table}, limit: ${limit}, `
                      + `sortField: ${sortField}, sortDirection: ${sortDirection}) {${root}}`);
            return SearchService.searchText(text, table, limit, sortField, sortDirection);
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
            console.log(`gql: data_object (id: ${id}, name: ${name}) {${root}}`);
            if(id) return DataObjectService.get(id);
            else return DataObjectService.getFromName(name);
          }
        },
        race: {
          type: RaceSchema,
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
            console.log(`gql: race (id: ${id}, name: ${name}) {${root}}`);
            if(id) return RaceService.get(id);
            else return RaceService.getFromName(name);
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
            console.log(`gql: class (id: ${id}, name: ${name}) {${root}}`);
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
            console.log(`gql: discipline (id: ${id}, name: ${name}) {${root}}`);
            if(id) return DisciplineService.get(id);
            else return DisciplineService.getFromName(name);
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
            console.log(`gql: power (id: ${id}, name: ${name}) {${root}}`);
            if(id) return PowerService.get(id);
            else return PowerService.getFromName(name);
          }
        },
        races: {
          type: new GraphQLList(RaceSchema),
          description: 'All the races.',
          resolve: (root) => {
            console.log(`gql: races {${root}}`);
            return RaceService.getAll();
          }
        },
        classes: {
          type: new GraphQLList(ClassSchema),
          description: 'All the classes.',
          resolve: (root) => {
            console.log(`gql: classes {${root}}`);
            return ClassService.getAll();
          }
        },
        disciplines: {
          type: new GraphQLList(DisciplineSchema),
          description: 'All the disciplines.',
          resolve: (root) => {
            console.log(`gql: disciplines {${root}}`);
            return DisciplineService.getAll();
          }
        },
        powers: {
          type: new GraphQLList(PowerSchema),
          description: 'All the powers.',
          resolve: (root) => {
            console.log(`gql: powers {${root}}`);
            return PowerService.getAll();
          }
        }
      },
    }),
    types: [ RaceSchema, ClassSchema, DisciplineSchema, PowerSchema ]
  });

export default RootSchema;
