import {test,expect,type APIRequestContext} from '@playwright/test';
import {games} from '../lib/games';
type Round={id:string;gameId:string;turn:number;score:number;lives:number;status:string;total:number;daily:string|null;left?:{id:string;value:number};right?:{id:string;value?:number};question?:{id:string;answer?:boolean}};
function correctChoice(gameId:string,r:Round){const game=games.find(g=>g.id===gameId)!;if(game.quiz)return game.quiz.find(q=>q.id===r.question!.id)!.answer?'true':'false';return game.items.find(i=>i.id===r.right!.id)!.value>=r.left!.value?'higher':'lower';}
async function start(request:APIRequestContext,gameId:string,difficulty='classic',daily=false){const response=await request.post('/api/runs',{data:{gameId,difficulty,daily}});expect(response.status()).toBe(200);return response.json() as Promise<Round>;}
test('every published game starts and validates a correct answer on the server',async({request})=>{
 for(const game of games){const r=await start(request,game.id);expect(r.status,game.id).toBe('playing');expect(r.score).toBe(0);if(r.right)expect(r.right.value).toBeUndefined();if(r.question)expect(r.question.answer).toBeUndefined();const response=await request.post(`/api/runs/${r.id}/answer`,{data:{choice:correctChoice(game.id,r),turn:0}});expect(response.status(),game.id).toBe(200);const result=await response.json();expect(result.correct,game.id).toBe(true);expect(result.next.score,game.id).toBe(1);expect(result.next.turn).toBe(1);}
});
test('game over, relaxed lives, duplicate answers, and foreign runs are protected',async({request,playwright,baseURL})=>{
 const r=await start(request,'moroccan-cities');const correct=correctChoice('moroccan-cities',r);const wrong=correct==='higher'?'lower':'higher';
 const result=await(await request.post(`/api/runs/${r.id}/answer`,{data:{choice:wrong,turn:0}})).json();expect(result.correct).toBe(false);expect(result.next.status).toBe('lost');expect(result.next.lives).toBe(0);expect(result.next.score).toBe(0);
 const duplicate=await request.post(`/api/runs/${r.id}/answer`,{data:{choice:correct,turn:0}});expect(duplicate.status()).toBe(409);
 const other=await playwright.request.newContext({baseURL});const foreign=await other.post(`/api/runs/${r.id}/answer`,{data:{choice:correct,turn:0}});expect(foreign.status()).toBe(404);await other.dispose();
 const relaxed=await start(request,'moroccan-cities','relaxed');const c=correctChoice('moroccan-cities',relaxed);const response=await(await request.post(`/api/runs/${relaxed.id}/answer`,{data:{choice:c==='higher'?'lower':'higher',turn:0}})).json();expect(response.next.lives).toBe(2);expect(response.next.status).toBe('playing');
 const injected=await request.post(`/api/runs/${relaxed.id}/answer`,{data:{choice:'higher',turn:1,score:999}});expect(injected.status()).toBe(400);
 const admin=await request.put('/api/admin/datasets/moroccan-cities',{data:{}});expect(admin.status(),await admin.text()).toBe(403);
 // The local Wrangler proxy can restart its origin routing after this deliberate
 // foreign-origin probe, so keep it after the independent mutation checks.
 const csrf=await request.post('/api/runs',{headers:{origin:'https://unrelated.example'},data:{gameId:'moroccan-cities'}});expect(csrf.status()).toBe(403);
 // GET is retried automatically by Wrangler while its local proxy settles.
 expect((await request.get('/api/account')).status()).toBe(200);
});
test('concurrent answers cannot advance a round twice',async({request})=>{
 const r=await start(request,'moroccan-cities');const data={choice:correctChoice('moroccan-cities',r),turn:0};const responses=await Promise.all([request.post(`/api/runs/${r.id}/answer`,{data}),request.post(`/api/runs/${r.id}/answer`,{data})]);expect(responses.map(r=>r.status()).sort()).toEqual([200,409]);
});
test('a daily challenge is deterministic and resumes the first attempt',async({request,playwright,baseURL})=>{
 const a=await start(request,'moroccan-cities','classic',true);const resumed=await start(request,'moroccan-cities','classic',true);expect(a.id).toBe(resumed.id);expect(a.total).toBe(10);expect(a.daily).toBeTruthy();
 const other=await playwright.request.newContext({baseURL});const b=await start(other,'moroccan-cities','classic',true);expect(b.gameId).toBe(a.gameId);expect(b.left?.id??b.question?.id).toBe(a.left?.id??a.question?.id);expect(b.right?.id).toBe(a.right?.id);await other.dispose();
});
test('registration persists progress and publishes only server-calculated scores',async({request,playwright,baseURL})=>{
 const email=`pw-${Date.now()}@example.com`;const registered=await request.post('/api/auth/register',{data:{name:'Browser QA',email,password:'correct-horse-4921',country:'MA'}});expect(registered.status()).toBe(200);expect((await registered.json()).user.name).toBe('Browser QA');
 let r=await start(request,'world-cup-titles');while(r.status==='playing'){r=(await(await request.post(`/api/runs/${r.id}/answer`,{data:{choice:correctChoice('world-cup-titles',r),turn:r.turn}})).json()).next;}
 expect(r.status).toBe('won');expect(r.score).toBe(7);
 const scores=await(await request.get('/api/leaderboard?game=world-cup-titles&region=MA')).json();expect(scores.scores.some((s:{name:string;score:number})=>s.name==='Browser QA'&&s.score===7)).toBe(true);
 const newDevice=await playwright.request.newContext({baseURL});const login=await newDevice.post('/api/auth/login',{data:{email,password:'correct-horse-4921'}});expect(login.status()).toBe(200);const progress=await(await newDevice.get('/api/progress')).json();expect(progress.runs.some((run:{id:string;score:number})=>run.id===r.id&&run.score===7)).toBe(true);
 await newDevice.post('/api/auth/logout',{data:{}});expect((await(await newDevice.get('/api/account')).json()).user).toBeNull();await newDevice.dispose();
});
