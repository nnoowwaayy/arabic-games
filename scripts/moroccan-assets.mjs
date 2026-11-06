import { writeFile } from 'node:fs/promises';
const sources=[['morocco','Aït_Benhaddou'],['mountain','Toubkal'],['desert','Erg_Chebbi']];
const credits=[];
for(const [name,title] of sources){
 const data=await (await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`)).json();
 const url=data.thumbnail.source.replace(/\/\d+px-/,'/1280px-').split('?')[0];
 const res=await fetch(url);if(!res.ok)throw new Error(`${name}: ${res.status}`);
 await writeFile(new URL(`../public/images/${name}.jpg`,import.meta.url),Buffer.from(await res.arrayBuffer()));
 const filename=decodeURIComponent(url.split('/').at(-2));
 const meta=await (await fetch(`https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent('File:'+filename)}&prop=imageinfo&iiprop=extmetadata&format=json`)).json();
 const info=Object.values(meta.query.pages)[0]?.imageinfo?.[0]?.extmetadata;
 credits.push({name,title,url,page:`https://commons.wikimedia.org/wiki/File:${filename}`,artist:info?.Artist?.value,license:info?.LicenseShortName?.value,licenseUrl:info?.LicenseUrl?.value});
 console.log(`Saved verified Moroccan photo: ${name}`);
}
await writeFile(new URL('../data/image-credits.json',import.meta.url),JSON.stringify(credits,null,2));
