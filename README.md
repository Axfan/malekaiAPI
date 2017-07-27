# malekaiApi

The api for the malekai project.

## Route Reference
*Standard api route is [https://api.malekai.network](https://api.malekai.network)*

 - `GET /races` - fetches all the races
   - `GET /races/{id}` - fetches a race with the specified id
  
 - `GET /classes` - fetches all the classes
   - `GET /classes/{id}` - fetches a class with the specified id

 - `GET /disciplines` - fetches all the disciplines
   - `GET /disciplines/{id}` - fetches a discipline with the specified id

 - `GET /powers` - fetches all the powers (there's a lot so watch out)
   - `GET /powers/{id}` - fetches a power with the specified id

 - `GET /search` - search all the data in the db
   - do params like this: `{field}={value}`, i.e. `/search?data_type=race&name=Fae`

   - strings/numbers are parsed normally, arrays are like so

     - `GET /search?classes=["Knight"]` - this will grab every object with a `classes` field, and one that contains
      a `Knight` value inside of it.

   - important fields you should know about:
     - `data_type`: the data type (i.e. `race`/`class`/`discipline`/`power`)

 - `GET /graphql` - we have graphql support!
   - Schemas are in [/src/data/graphql](/src/data/graphql)
   - `graphiql` is enabled so you can have fun [exploring](https://api.malekai.network/graphql)!

## To setup:

Install node v6+, start up a rethinkdb server with default ports/etc.

`npm install` the project.

`npm run load-crowfall-data` downloads and updates the database with new data from git.

## To run:

`npm start` or `npm run tsc && node dist/api.js`.

Make sure to clear the dist folder if you want to remove old files (important for building
for release!).
