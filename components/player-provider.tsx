'use client';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { usePlayer } from '@/lib/store';
import { arabicMessages, messages, type MessageKey } from '@/lib/messages';
import type { Localized,GameMode } from '@/lib/game-types';
import {games} from '@/lib/games';

type User={id:string;name:string;country:string;email?:string};
type Context={user:User|null;refreshUser:()=>Promise<void>;t:(key:MessageKey)=>string;name:(text:Localized)=>string;ready:boolean;notify:(text:string)=>void;catalog:GameMode[]};
const PlayerContext=createContext<Context>(null!);
export function useApp(){return useContext(PlayerContext);}
export function PlayerProvider({children}:{children:ReactNode}){
  const locale=usePlayer(s=>s.locale);
  const [ready,setReady]=useState(false);
  const [user,setUser]=useState<User|null>(null);
  const [catalog,setCatalog]=useState<GameMode[]>(games);
  const [toast,setToast]=useState('');
  const dictionary=locale==='ar'?arabicMessages:messages[locale];
  async function refreshUser(){try{const r=await fetch('/api/account');if(r.ok){const d=await r.json() as {user:User|null};setUser(d.user??null);}}catch{setUser(null);}}
  useEffect(()=>{void usePlayer.persist.rehydrate();setReady(true);document.body.dataset.appReady='true';void refreshUser();fetch('/api/catalog').then(r=>r.ok?r.json():null).then(d=>{if(d)setCatalog((d as {games:GameMode[]}).games);}).catch(()=>{});},[]);
  useEffect(()=>{document.documentElement.lang=locale==='ary'?'ar-MA':locale;document.documentElement.dir=locale==='ary'||locale==='ar'?'rtl':'ltr';},[locale]);
  useEffect(()=>{if(!toast)return;const id=setTimeout(()=>setToast(''),3500);return()=>clearTimeout(id);},[toast]);
  return <PlayerContext.Provider value={{user,refreshUser,t:key=>dictionary[key],name:text=>text[locale],ready,notify:setToast,catalog}}><NextIntlClientProvider locale={locale==='ary'?'ar-MA':locale} messages={dictionary} timeZone="Africa/Casablanca"><div key={ready?'ready':'initial'} className="app-root">{children}</div>{toast&&<div className="toast" role="status">{toast}</div>}</NextIntlClientProvider></PlayerContext.Provider>;
}
