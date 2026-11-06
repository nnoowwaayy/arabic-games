import {readdirSync,readFileSync,existsSync,mkdirSync,writeFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
const stateFile=new URL('../.sites-runtime/applied-migrations.json',import.meta.url);
const applied=existsSync(stateFile)?JSON.parse(readFileSync(stateFile,'utf8')):[];
for(const file of readdirSync(new URL('../drizzle/',import.meta.url)).filter(f=>f.endsWith('.sql')).sort()){
 if(applied.includes(file))continue;
 const result=spawnSync(process.execPath,['--import','./scripts/sites-env.mjs','./node_modules/wrangler/bin/wrangler.js','d1','execute','DB','--local','--config','dist/server/wrangler.json','--persist-to','.wrangler/state','--file',`drizzle/${file}`],{cwd:root,stdio:'inherit'});
 if(result.status!==0)process.exit(result.status??1);applied.push(file);mkdirSync(new URL('../.sites-runtime/',import.meta.url),{recursive:true});writeFileSync(stateFile,JSON.stringify(applied,null,2));
}
console.log('Local schema is current.');
