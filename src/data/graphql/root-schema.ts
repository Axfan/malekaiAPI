import DataObjectInterface from './data-object-interface';
import RaceSchema from './race-schema';
import ClassSchema from './class-schema';
import DisciplineSchema from './discipline-schema';
import PowerSchema from './power-schema';
import { RaceService, ClassService, DisciplineService, PowerService, DataObjectService } from '../../service';

import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLList
} from 'graphql';

export const RootSchema: GraphQLSchema = new GraphQLSchema({
    query: new GraphQLObjectType({
      name: 'RootQueryType',
      fields: {
        hello: {
          type: GraphQLString,
          resolve() { return 'world'; }
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
          resolve: (root) => {
            console.log(`gql: races {${root}}`);
            return RaceService.getAll();
          }
        },
        classes: {
          type: new GraphQLList(ClassSchema),
          resolve: (root) => {
            console.log(`gql: classes {${root}}`);
            return ClassService.getAll();
          }
        },
        disciplines: {
          type: new GraphQLList(DisciplineSchema),
          resolve: (root) => {
            console.log(`gql: disciplines {${root}}`);
            return DisciplineService.getAll();
          }
        },
        powers: {
          type: new GraphQLList(PowerSchema),
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
