// The HTTP Prisma client is compatible with the hosted Worker runtime.
// Configure a PostgreSQL database through Prisma Accelerate to enable it.
import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';
let client:ReturnType<typeof makeClient>|undefined;
function makeClient(url:string){return new PrismaClient({datasourceUrl:url}).$extends(withAccelerate());}
function normalize(row:Record<string,unknown>){return Object.fromEntries(Object.entries(row).map(([k,v])=>[k,typeof v==='bigint'?Number(v):v]));}
export function postgresDatabase(url:string){
 if(!/^prisma(?:\+postgres)?:\/\//.test(url))throw new Error('Hosted PostgreSQL requires a Prisma Accelerate connection URL.');
 const db=client??=makeClient(url);
 function statement(query:string,values:unknown[]=[]){let n=0;const sql=query.replace(/\?/g,()=>`$${++n}`);return {
  bind(...next:unknown[]){return statement(query,next);},
  async first<T=Record<string,unknown>>(){const rows=await db.$queryRawUnsafe<Record<string,unknown>[]>(sql,...values);return rows[0]?normalize(rows[0]) as T:null;},
  async all<T=Record<string,unknown>>(){const rows=await db.$queryRawUnsafe<Record<string,unknown>[]>(sql,...values);return {results:rows.map(normalize) as T[]};},
  async run(){await db.$executeRawUnsafe(sql,...values);return {success:true};},
 };}
 return {prepare:(query:string)=>statement(query)};
}
