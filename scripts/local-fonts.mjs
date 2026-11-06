import {mkdir,writeFile} from 'node:fs/promises';
const dir=new URL('../public/fonts/',import.meta.url);await mkdir(dir,{recursive:true});
const url='https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;650;700;750;800;900&family=Noto+Sans+Arabic:wght@400;500;600;650;700;750;800;900&display=swap';
let css=await(await fetch(url,{headers:{'User-Agent':'Mozilla/5.0 Chrome/131.0.0.0 Safari/537.36'}})).text();
let i=0;for(const original of new Set([...css.matchAll(/url\((https:[^)]+)\)/g)].map(m=>m[1]))){const name=`font-${i++}.woff2`;const res=await fetch(original);if(!res.ok)throw new Error('Font unavailable');await writeFile(new URL(name,dir),Buffer.from(await res.arrayBuffer()));css=css.replaceAll(original,`/fonts/${name}`);}
await writeFile(new URL('../app/fonts.css',import.meta.url),css);console.log(`Saved ${i} self-hosted font subsets.`);
