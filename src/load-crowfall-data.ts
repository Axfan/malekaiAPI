import 'source-map-support/register';

import * as fs from 'fs';
import * as path from 'path';
import * as simpleGit from 'simple-git';
import * as jsonfile from 'jsonfile';
import * as r from 'rethinkdb';
import * as json2csv from 'json2csv';
import { DatabaseService as db } from './service/database.service';

import { Class, Discipline, Power } from './data';

const git = simpleGit('');

function capitalize(str: string) {
  if(!str) return str;
  return str.split(/\s+|-|_/g).map(a => `${a[0].toLocaleUpperCase() + a.slice(1)}`).filter(a => a).join(' ');
}

function cleanEntries(obj: any) {
  for(const key in obj) {
    if(obj[key] instanceof Array) {
      if(obj[key].length <= 0) {
        obj[key] = '';
      } else if(typeof obj[key][0] === 'string') {
        obj[key] = (obj[key] as string[]).map(b => capitalize(b)).join(', ');
      } else if(typeof obj[key][0] === 'object') {
        if(Object.keys(obj[key][0]).reduce((s, k, i) => s && i < 2 && (k === 'name' || k === 'value'), true)) {
          obj[key] = (obj[key] as { name: string, value: string }[]).map(
            a => `${capitalize(a.name)}: ${typeof a.value === 'string' ? capitalize(a.value) : a.value}`
          ).join(', ');
        } else if(Object.keys(obj[key][0]).reduce((s, k, i) => s && i < 2 && (k === 'data_type' || k === 'id'), true)) {
          obj[key] = (obj[key] as { data_type: string, id: string }[]).map(
            a => `${capitalize(a.id)} (${capitalize(a.data_type)})`
          ).join(', ');
        } else if(Object.keys(obj[key][0]).reduce((s, k, i) => s && i < 2 && (k === 'name' || k === 'cost'), true)) {
          obj[key] = (obj[key] as { name: string, cost: number }[]).map(
            a => `${capitalize(a.name)}: ${a.cost}`
          ).join(', ');
        }
      }
    } else if (typeof obj[key] === 'string' && key !== 'description' && key !== 'name' && obj[key]) {
      obj[key] = capitalize(obj[key] as string);
    }
  }
  return obj;
}

const bufferSize = 99;
async function loadDir(dir: string, ids: {[key: string]: string[]}, data_type?: string) {
  // console.log('== Loading directory ' + dir + (data_type ? ', ' + data_type : ''));
  let tbl = null;

  if(data_type) {

    tbl = db.getTable(data_type);

    if(!(ids[data_type] instanceof Array)) {
      console.log('== Loading Data Type ' + data_type);
      ids[data_type] = [];
    }

    if(!tbl)  { console.error(`Couldn't find table "${data_type}"!`); return; }

  } else console.log('=== Loading data...');

  const buffer = [];

  const run = async () => {
    // console.log('# Inserting Buffer into the ' + data_type + ' table!');
    await db.run(tbl.insert(buffer, { conflict: 'replace', returnChanges: true })).then((res: any) => {

      for(const change of res.changes as { new_val: any, old_val: any }[]) {
        if(change.old_val)
          console.log('~ Replaced ' + change.new_val.data_type + ' ' + change.new_val.name);
        else
          console.log('+ Added ' + change.new_val.data_type + ' ' + change.new_val.name);
      }
      // if(res.errors) console.error('! ' + res.errors + ' Errors');
      // if(res.unchanged) console.log('= ' + res.unchanged + ' Unchanged');
      // if(res.skipped) console.log('= ' + res.skipped + ' Skipped');
    });

    buffer.length = 0;
  };

  for(const file of fs.readdirSync(dir)) {
    const p = path.join(dir, file);
    if(fs.lstatSync(p).isDirectory()) await loadDir(p, ids, data_type || file);
    else if(data_type) {
      // console.log('+ Buffering file ' + p);
      const json = jsonfile.readFileSync(p);

      const basename = path.basename(p);
      json.id = basename.substr(0, basename.length - 5); // for ".json"
      ids[data_type].push(json.id);
      json.data_type = data_type;

      buffer.push(json);
      if(buffer.length > bufferSize) await run();
    }
  }
  if(buffer.length) await run();
}

export function LoadCrowfallData(): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const logic = async (error, _) => {

      if(error) { reject(error); return; }

      const ids: {[key: string]: string[]} = {};

      try {

        await loadDir('./crowfall-data/data', ids);

        console.log('=== Filtering data...');
        for(const key in ids) if(ids[key] instanceof Array) {

          const tbl = db.getTable(key);
          if(!tbl) { console.error('Couldn\'t find table for data_type ' + key + '!'); continue; }

          const col = r.expr(ids[key]);

          // removed deleted objects
          await db.run(tbl.filter(doc => r.not(col.contains(doc('id')))).delete({ returnChanges: true })).then((val: any) => {
            if(val.changes) for(const v of val.changes)
              console.log('- Removed ' + v.old_val.data_type + ' ' + v.old_val.name);
          });
        }

        console.log('=== Generating CSVs')
        // generate CSV
        if(!fs.existsSync('./csv')) fs.mkdirSync('./csv');

        let data: any[];
        let fields: json2csv.Field[];
        const genFields = obj => Object.keys(data[0]).map(key => { return { label: capitalize(key), value: key } });
        console.log('== Disciplines');

        for(const type of ['race', 'major', 'minor']) {
          console.log('= ' + type[0].toLocaleUpperCase() + type.slice(1))
          data = (await db.run(db.disciplines.filter({ type: type })) as Discipline[]).map(a => {
            a = Discipline.fromDBO(a);
            if(a.type !== null) delete a.type;
            if(a.data_type !== null) delete a.data_type;
            if(a.id !== null) delete a.id;
            return cleanEntries(a);
          });
          fields = data.length > 0 ? genFields(data[0]) : null;
          fs.writeFileSync(`./csv/${type}_disciplines.csv`, json2csv({ data: data, fields: fields }));
        }

        console.log('== Classes');
        data = (await db.run(db.classes) as Class[]).map(a => {
          a = Class.fromDBO(a);
          if(a.data_type !== null) delete a.data_type;
          if(a.id !== null) delete a.id;
          return cleanEntries(a);
        });
        fields = data.length > 0 ? genFields(data[0]) : null;
        fs.writeFileSync('./csv/classes.csv', json2csv({ data: data, fields: fields }));

        console.log('== Powers');
        data = (await db.run(db.powers) as Power[]).map(a => {
          a = Power.fromDBO(a);
          if(a.data_type !== null) delete a.data_type;
          if(a.id !== null) delete a.id;
          return cleanEntries(a);
        });
        fields = data.length > 0 ? genFields(data[0]) : null;
        fs.writeFileSync('./csv/powers.csv', json2csv({ data: data, fields: fields }));

        resolve();
        return;
      } catch (e) {
        reject(e);
        return;
      }
    }

    console.log('== Fetching data...');

    if(!fs.existsSync('crowfall-data')) {
      git.clone('https://github.com/MalekaiProject/crowfall-data', './crowfall-data', null, logic);
    } else {
      git.cwd('./crowfall-data').reset('hard', (err) => {
        if(err) { console.error(err); reject(); return; }
        git.pull(logic);
      });
    }
  });
}

export default LoadCrowfallData;

console.log('== Initializing DB...');

db.init().then(() => LoadCrowfallData()).then(d => { console.log('Done loading!'); process.exit(); }).catch(e => { console.error(e); process.exit(); });
