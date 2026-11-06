import { z } from 'zod';
import { ApiError,account,authenticate,logout,updateAccount,startRun,answerRun,leaderboard,progress } from '@/lib/server';
import {publishedGames,adminCatalog,saveDataset} from '@/lib/datasets';

const json=(value:unknown,status=200)=>Response.json(value,{status,headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
async function readBody(request:Request){const limit=new URL(request.url).pathname.startsWith('/api/admin/datasets/')?2_000_000:12_000;const data=await request.text();if(data.length>limit)throw new ApiError(413,'Request too large');return JSON.parse(data);}
async function handle(request:Request){try{const url=new URL(request.url);const path=url.pathname.replace('/api/','');const method=request.method;
 if(method!=='GET'){const origin=request.headers.get('origin');if(origin&&origin!==url.origin)throw new ApiError(403,'Cross-origin requests are not allowed');const max=path.startsWith('admin/datasets/')?2_000_000:12_000;if(Number(request.headers.get('content-length')??0)>max)throw new ApiError(413,'Request too large');}
 if(method==='GET'){if(path==='catalog')return json({games:await publishedGames()});if(path==='admin/datasets')return json(await adminCatalog());if(path==='account')return json({user:await account()});if(path==='leaderboard')return json(await leaderboard(url));if(path==='progress')return json(await progress());}
 if(method==='POST'){const body=await readBody(request);if(path==='auth/login'||path==='auth/register')return json(await authenticate(body,path.endsWith('register'),request.headers.get('cf-connecting-ip')??'local'));if(path==='auth/logout')return json(await logout());if(path==='runs')return json(await startRun(body));const match=path.match(/^runs\/([a-f0-9-]{36})\/answer$/);if(match)return json(await answerRun(match[1],body));}
 if(method==='PATCH'&&path==='account')return json(await updateAccount(await readBody(request)));
 const datasetMatch=path.match(/^admin\/datasets\/([a-z0-9-]+)$/);if(method==='PUT'&&datasetMatch)return json(await saveDataset(datasetMatch[1],await readBody(request)));
 return json({error:'Not found'},404);
 }catch(error){if(error instanceof ApiError)return json({error:error.message},error.status);if(error instanceof z.ZodError||error instanceof SyntaxError)return json({error:'Invalid request data'},400);console.error('API request failed',error instanceof Error?error.message:'Unknown error');return json({error:'Service unavailable. Please try again.'},503);}}
export const GET=handle;export const POST=handle;export const PATCH=handle;export const PUT=handle;
