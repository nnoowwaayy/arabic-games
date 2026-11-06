import { env } from 'cloudflare:workers';
import { z } from 'zod';
import { games,getGame } from './games';
import {database} from './database';
import {account} from './auth';
import {ApiError} from './errors';
import type { GameMode } from './game-types';
const localized=z.object({ary:z.string().min(1).max(500),ar:z.string().min(1).max(500),fr:z.string().min(1).max(500),en:z.string().min(1).max(500)});
const item=z.object({id:z.string().min(1).max(100),name:localized,value:z.number().finite(),symbol:z.string().max(16).optional(),source:z.string().url().optional()});
const question=z.object({id:z.string().min(1).max(100),statement:localized,answer:z.boolean(),explanation:localized,source:z.string().url()});
export const datasetSchema=z.object({active:z.boolean(),source:z.string().url(),sourceLabel:z.string().min(2).max(120),snapshot:z.string().regex(/^\d{4}-\d{2}-\d{2}$/),scope:localized,items:z.array(item).max(1000),quiz:z.array(question).max(1000).optional()}).superRefine((data,context)=>{const items=data.quiz??data.items;if(items.length<8)context.addIssue({code:'custom',message:'At least 8 items are required'});if(new Set(items.map(i=>i.id)).size!==items.length)context.addIssue({code:'custom',message:'Item IDs must be unique'});if(!data.quiz&&new Set(data.items.map(i=>i.value)).size<2)context.addIssue({code:'custom',message:'At least two different values are required'});});
type DatasetRow={game_id:string;data:string;active:number};
export async function publishedGames(){const {results}=await database().prepare('SELECT game_id,data,active FROM datasets').all<DatasetRow>();return games.flatMap(game=>{const row=results.find(r=>r.game_id===game.id);if(!row)return [game];if(!row.active)return [];return [{...game,...JSON.parse(row.data)} as GameMode];});}
export async function publishedGame(id:string){return (await publishedGames()).find(g=>g.id===id);}
export async function requireAdmin(){const user=await account();if(!user||!env.ADMIN_EMAIL||user.email.toLowerCase()!==env.ADMIN_EMAIL.toLowerCase())throw new ApiError(403,'Dataset editing is restricted to the configured administrator.');return user;}
export async function adminCatalog(){await requireAdmin();const {results}=await database().prepare('SELECT game_id,data,active FROM datasets').all<DatasetRow>();return {games:games.map(game=>{const row=results.find(r=>r.game_id===game.id);return row?{...game,...JSON.parse(row.data),active:!!row.active}:{...game,active:true};})};}
export async function saveDataset(id:string,body:unknown){const user=await requireAdmin();const original=getGame(id);if(!original)throw new ApiError(404,'Game not found');const data=datasetSchema.parse(body);if(!!original.quiz!==!!data.quiz)throw new ApiError(400,'The game type cannot be changed');await database().prepare('INSERT INTO datasets (game_id,data,active,updated_at,updated_by) VALUES (?,?,?,?,?) ON CONFLICT(game_id) DO UPDATE SET data=excluded.data,active=excluded.active,updated_at=excluded.updated_at,updated_by=excluded.updated_by').bind(id,JSON.stringify(data),data.active?1:0,new Date().toISOString(),user.id).run();return {ok:true};}
