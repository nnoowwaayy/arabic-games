import {writeFile} from 'node:fs/promises';
const titles=['The_Shawshank_Redemption','The_Godfather','The_Dark_Knight','Inception','Interstellar','Titanic_(1997_film)','Avatar_(2009_film)','Parasite_(2019_film)','The_Lion_King_(1994_film)','Spirited_Away','Whiplash_(2014_film)','Gladiator_(2000_film)','Oppenheimer_(film)','The_Matrix','Jaws_(film)','Toy_Story'];
const evidence=[];
for(let start=0;start<titles.length;start++){const title=titles[start];try{
 const url=`https://en.wikipedia.org/w/api.php?action=parse&prop=wikitext&format=json&page=${encodeURIComponent(title)}`;
 const response=await fetch(url,{signal:AbortSignal.timeout(12000)});if(!response.ok)throw new Error(`HTTP ${response.status}`);
 const data=await response.json();const wikitext=data.parse?.wikitext?.['*']??'';
 const runtime=wikitext.match(/\|\s*runtime\s*=([^\n]+)/)?.[1]?.replace(/<ref[\s\S]*/,'').trim();
 evidence.push({index:start,title,runtime,source:`https://en.wikipedia.org/wiki/${encodeURIComponent(title)}`,verifiedAt:new Date().toISOString()});
 console.log(title,runtime);
}catch(error){evidence.push({index:start,title,error:error.message});console.log(title,error.message);}await new Promise(r=>setTimeout(r,200));}
await writeFile(new URL('../data/film-evidence.json',import.meta.url),JSON.stringify(evidence.sort((a,b)=>a.index-b.index),null,2));
