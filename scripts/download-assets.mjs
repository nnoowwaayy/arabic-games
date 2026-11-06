import { mkdir, writeFile } from 'node:fs/promises';
const root=new URL('../public/images/',import.meta.url);
await mkdir(root,{recursive:true});
const assets={
  morocco:'photo-1519451241324-20b4ea2c4220',city:'photo-1539020140153-e479b8c22e70',
  mountain:'photo-1464822759023-fed622ff2c3b',football:'photo-1522778119026-d647f0596c20',
  world:'photo-1614730321146-b6fa6a46bcb4',cinema:'photo-1489599849927-2ee91cede3ba',
  science:'photo-1532187863486-abf9dbad1b69',gaming:'photo-1511512578047-dfb367046420',
  heritage:'photo-1489749798305-4fea3ae63d43',river:'photo-1437482078695-73f5ca6c96e2',
  skyline:'photo-1519501025264-65ba15a82390',desert:'photo-1509316785289-025f5b846b35'
};
await Promise.all(Object.entries(assets).map(async([name,id])=>{
  const url=`https://images.unsplash.com/${id}?auto=format&fit=crop&w=1100&q=85`;
  const res=await fetch(url,{signal:AbortSignal.timeout(30000)});
  if(!res.ok)throw new Error(`${name}: ${res.status}`);
  await writeFile(new URL(`${name}.jpg`,root),Buffer.from(await res.arrayBuffer()));
  console.log(`Saved ${name}`);
}));
