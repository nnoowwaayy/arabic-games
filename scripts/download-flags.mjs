import {readFile,mkdir,writeFile} from 'node:fs/promises';
const countries=JSON.parse(await readFile(new URL('../data/countries.json',import.meta.url),'utf8')).filter(c=>c.unMember);
const root=new URL('../public/flags/',import.meta.url);await mkdir(root,{recursive:true});
for(let start=0;start<countries.length;start+=12){await Promise.all(countries.slice(start,start+12).map(async c=>{const code=c.cca2.toLowerCase();const r=await fetch(`https://flagcdn.com/${code}.svg`);if(!r.ok)throw new Error(`${code} ${r.status}`);await writeFile(new URL(`${code}.svg`,root),await r.text());}));}
console.log(`Saved ${countries.length} country flags.`);
