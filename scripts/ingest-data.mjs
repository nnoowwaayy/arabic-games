import { mkdir, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';

const root = new URL('../data/', import.meta.url);
await mkdir(root, { recursive: true });
const fetchedAt = new Date().toISOString();
const sources = [
  ['countries', 'https://raw.githubusercontent.com/mledoze/countries/master/countries.json'],
  ['population', 'https://api.worldbank.org/v2/country/all/indicator/SP.POP.TOTL?date=2023&format=json&per_page=400'],
  ['density', 'https://api.worldbank.org/v2/country/all/indicator/EN.POP.DNST?date=2023&format=json&per_page=400'],
  ['elements', 'https://raw.githubusercontent.com/Bowserinator/Periodic-Table-JSON/master/PeriodicTableJSON.json'],
];
const manifest = [];
for (const [name, url] of sources) {
  const response = await fetch(url, { signal: AbortSignal.timeout(45000) });
  if (!response.ok) throw new Error(`${name}: HTTP ${response.status}`);
  const text = await response.text();
  const data = JSON.parse(text);
  if (name === 'countries' && (!Array.isArray(data) || data.length < 190)) throw new Error('Invalid country feed');
  if (['population', 'density'].includes(name) && !Array.isArray(data[1])) throw new Error('Invalid World Bank feed');
  const trimmed = name === 'countries' ? data.map(c=>({name:{common:c.name.common},cca2:c.cca2,unMember:c.unMember,translations:{ara:{common:c.translations.ara?.common},fra:{common:c.translations.fra?.common}},area:c.area,borders:c.borders,flag:c.flag}))
    : name === 'elements' ? {elements:data.elements.map(e=>({name:e.name,symbol:e.symbol,number:e.number,atomic_mass:e.atomic_mass,boil:e.boil}))}
    : [data[0],data[1].map(r=>({country:{id:r.country.id},value:r.value}))];
  await writeFile(new URL(`${name}.json`, root), JSON.stringify(trimmed));
  manifest.push({ name, url, fetchedAt, sha256: createHash('sha256').update(text).digest('hex') });
  console.log(`Saved ${name}`);
}
const pokemon = [];
for (let start = 1; start <= 40; start += 8) {
  pokemon.push(...await Promise.all(Array.from({length: Math.min(8, 41-start)}, async (_, offset) => {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${start+offset}`, {signal: AbortSignal.timeout(20000)});
    if (!response.ok) throw new Error('PokéAPI unavailable');
    const p = await response.json();
    return {id:p.id,name:p.name,weight:p.weight,stats:p.stats.map(s=>({name:s.stat.name,value:s.base_stat}))};
  })));
}
await writeFile(new URL('pokemon.json', root), JSON.stringify(pokemon));
manifest.push({name:'pokemon',url:'https://pokeapi.co/api/v2/pokemon/{1…40}',fetchedAt});
await writeFile(new URL('manifest.json', root), JSON.stringify(manifest,null,2));
console.log(`Saved ${pokemon.length} Pokémon; ingestion complete.`);
