import {test,expect} from '@playwright/test';
import {evaluateChoice,shuffle,seededRandom,dailyKey} from '../lib/engine';
import {games} from '../lib/games';
import {localize,type GameItem} from '../lib/game-types';
const item=(value:number):GameItem=>({id:String(value),name:localize('عنصر','Item','Élément'),value});
test('comparison evaluates directions, ties, and small decimal differences',()=>{
 expect(evaluateChoice(item(10),item(11),'higher')).toBe(true);
 expect(evaluateChoice(item(10),item(11),'lower')).toBe(false);
 expect(evaluateChoice(item(10),item(9),'lower')).toBe(true);
 expect(evaluateChoice(item(10),item(9),'higher')).toBe(false);
 expect(evaluateChoice(item(10),item(10),'higher')).toBe(true);
 expect(evaluateChoice(item(10),item(10),'lower')).toBe(true);
 expect(evaluateChoice(item(.33),item(.331),'higher')).toBe(true);
});
test('a shuffled deck is deterministic when seeded and has no repeated items',()=>{
 const input=Array.from({length:100},(_,i)=>i);const a=shuffle(input,seededRandom('2026-11-06'));
 expect(a).toEqual(shuffle(input,seededRandom('2026-11-06')));expect(a).not.toEqual(shuffle(input,seededRandom('2026-11-07')));
 expect(new Set(a).size).toBe(input.length);expect([...a].sort((a,b)=>a-b)).toEqual(input);expect(input[0]).toBe(0);
});
test('daily dates use the Moroccan calendar across UTC boundaries',()=>{
 expect(dailyKey(new Date('2026-11-05T22:59:00Z'))).toBe('2026-11-05');
 expect(dailyKey(new Date('2026-11-05T23:01:00Z'))).toBe('2026-11-05');
 expect(dailyKey(new Date('2026-11-06T00:01:00Z'))).toBe('2026-11-06');
 expect(dailyKey(new Date('2026-07-05T23:01:00Z'))).toBe('2026-07-06');
});
test('every published game has enough valid sourced and localized data',()=>{
 expect(games.length).toBeGreaterThanOrEqual(23);expect(new Set(games.map(g=>g.id)).size).toBe(games.length);
 for(const game of games){expect(game.source).toMatch(/^https:\/\//);expect(game.snapshot).toMatch(/^\d{4}-\d{2}-\d{2}$/);const items=game.quiz??game.items;expect(items.length,game.id).toBeGreaterThanOrEqual(8);expect(new Set(items.map(i=>i.id)).size,game.id).toBe(items.length);for(const lang of ['ary','ar','fr','en'] as const){expect(game.title[lang],game.id).toBeTruthy();expect(game.description[lang],game.id).toBeTruthy();}if(!game.quiz){expect(game.items.every(i=>Number.isFinite(i.value)),game.id).toBe(true);expect(new Set(game.items.map(i=>i.value)).size).toBeGreaterThan(1);}}
 expect(games.find(g=>g.id==='moroccan-cities')!.items.find(i=>i.id==='casablanca')!.value).toBe(3215935);
 expect(games.find(g=>g.id==='moroccan-clubs')!.items.find(i=>i.id==='wac')!.value).toBe(17);
});
