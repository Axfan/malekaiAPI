import 'source-map-support/register';

import * as fs from 'fs';
import * as path from 'path';
import * as simpleGit from 'simple-git';
import * as jsonfile from 'jsonfile';
import * as r from 'rethinkdb';
import { DatabaseService as db } from './service/database.service';

const git = simpleGit('');

const bufferSize = 100;
async function loadDir(dir: string, data_type?: string) {
  console.log('== Loading directory ' + dir + (data_type ? ', ' + data_type : ''));
  const tbl = data_type ? db.getTable(data_type) : null;
  if(!tbl && data_type) { console.error(`Couldn't find table "${data_type}"!`); return; }

  const buffer = [];
  for(const file of fs.readdirSync(dir)) {
    const p = path.join(dir, file);
    if(fs.lstatSync(p).isDirectory()) await loadDir(p, data_type || file);
    else if(data_type) {
      console.log('+ Buffering file ' + p);
      const json = jsonfile.readFileSync(p);

      const basename = path.basename(p);
      json.id = basename.substr(0, basename.length - 5); // for ".json"
      json.data_type = data_type;

      buffer.push(json);
      if(buffer.length > bufferSize) {
        console.log('~ Inserting Buffer into the "' + data_type + '" table!');
        db.run(tbl.insert(buffer));
        buffer.length = 0;
      }
    }
  }
  if(buffer.length) {
    console.log('~ Inserting Buffer into the ' + data_type + ' table!');
    await db.run(tbl.insert(buffer));
    buffer.length = 0;
  }
}

export function LoadCrowfallData(): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const logic = async (error, d) => {
      if(error) { reject(error); return; }
      await db.emptyTables();
      try {
        await loadDir('./crowfall-data/data');
        resolve();
      } catch (e) {
        reject(e);
        return;
      }
    }
    if(!fs.existsSync('crowfall-data')) {
      git.clone('https://github.com/MalekaiProject/crowfall-data', './crowfall-data', null, logic);
    } else {
      git.cwd('./crowfall-data').pull(logic);
    }
  });
}

export default LoadCrowfallData;

db.init().then(() => LoadCrowfallData()).then(d => { console.log('Done loading!'); process.exit(); }).catch(e => console.error(e));
