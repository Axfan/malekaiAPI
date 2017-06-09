# malekaiApi

The api for the malekai project.

## Route Reference
*Standard api route is [https://api.crowfall.wiki](https://api.crowfall.wiki)*

 - `/races` - fetches all the races
   - `/races/{id}` - fetches a race with the specified id
  
 - `/classes` - fetches all the classes
   - `/classes/{id}` - fetches a class with the specified id

 - `/disciplines` - fetches all the disciplines
   - `/disciplines/{id}` - fetches a discipline with the specified id

 - `/powers` - fetches all the powers (there's a lot so watch out)
   - `/powers/{id}` - fetches a power with the specified id

 - `/search` - search all the data in the db
   - do params like this: `{field}={value}`, i.e. `/search?data_type=race&name=Fae`

   - strings/numbers are parsed normally, arrays are like so

    - `/search?classes=["Knight"]` - this will grab every object with a `classes` field, and one that contains
    a `Knight` value inside of it.

   - important fields you should know about:
     - `data_type`: the data type (i.e. `race`/`class`/`discipline`/`power`)

 - `/graphql` - we have graphql support!
   - Schemas are in [/src/data/graphql](/src/data/graphql)
   - `graphiql` is enabled so you can have fun [exploring](https://api.crowfall.wiki/graphql)!

## To setup:

Install node v6+, start up a rethinkdb server with default ports/etc.

`npm install` the project.

## To run:

`npm start` or `npm run tsc && node dist/server.js`.

Make sure to clear the dist folder if you want to remove old files (important for building
for release!).
