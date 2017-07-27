import 'source-map-support/register';

import * as fs from 'fs';
import * as path from 'path';
import * as simpleGit from 'simple-git';
import * as jsonfile from 'jsonfile';
import * as r from 'rethinkdb';
import { DatabaseService as db } from './service/database.service';

const git = simpleGit('');

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
            for(const v of val.changes)
              console.log('- Removed ' + v.old_val.data_type + ' ' + v.old_val.name);
          });
        }
        resolve();
        return;
      } catch (e) {
        reject(e);
        return;
      }
    }
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

db.init().then(() => LoadCrowfallData()).then(d => { console.log('Done loading!'); process.exit(); }).catch(e => console.error(e));
