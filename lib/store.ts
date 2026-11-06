import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Locale, RunResult } from './game-types';
type State = { locale:Locale; muted:boolean; favorites:string[]; runs:RunResult[]; name:string;
  setLocale:(locale:Locale)=>void; toggleMute:()=>void; toggleFavorite:(id:string)=>void;
  addRun:(run:RunResult)=>void; setName:(name:string)=>void; };
export const usePlayer = create<State>()(persist((set)=>({
  locale:'ary',muted:true,favorites:[],runs:[],name:'',
  setLocale:locale=>set({locale}),toggleMute:()=>set(s=>({muted:!s.muted})),
  toggleFavorite:id=>set(s=>({favorites:s.favorites.includes(id)?s.favorites.filter(x=>x!==id):[...s.favorites,id]})),
  addRun:run=>set(s=>({runs:[run,...s.runs.filter(r=>r.id!==run.id)].slice(0,500)})),setName:name=>set({name}),
}),{name:'kter-player-v1',skipHydration:true}));
