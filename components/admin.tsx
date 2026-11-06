'use client';
import {useEffect,useState} from 'react';
import Link from '@/components/link';
import {api} from '@/lib/api';
import type {GameMode} from '@/lib/game-types';
import {useApp} from './player-provider';
import {Icon} from './icon';
export function Admin(){const {t,name,notify}=useApp();const [catalog,setCatalog]=useState<(GameMode&{active:boolean})[]>([]);const [selected,setSelected]=useState('');const [editor,setEditor]=useState('');const [error,setError]=useState('');const [busy,setBusy]=useState(true);
 useEffect(()=>{api<{games:(GameMode&{active:boolean})[]}>('admin/datasets').then(data=>{setCatalog(data.games);setSelected(data.games[0].id);}).catch(e=>setError(e.message)).finally(()=>setBusy(false));},[]);
 useEffect(()=>{const g=catalog.find(g=>g.id===selected);if(g)setEditor(JSON.stringify({active:g.active,source:g.source,sourceLabel:g.sourceLabel,snapshot:g.snapshot,scope:g.scope,items:g.items,...(g.quiz?{quiz:g.quiz}:{})},null,2));},[selected,catalog]);
 async function save(){setBusy(true);setError('');try{const data=JSON.parse(editor);await api(`admin/datasets/${selected}`,'PUT',data);notify(t('save'));setCatalog(c=>c.map(g=>g.id===selected?{...g,...data}:g));}catch(e){setError(e instanceof Error?e.message:t('error'));}finally{setBusy(false);}}
 return <><div className="page-title"><div className="eyebrow"><Icon name="ShieldCheck" size={16}/>{t('admin')}</div><h1>{t('admin')}</h1><p>{t('adminSub')}</p></div>{error&&<p className="error-note" role="alert">{error}</p>}{busy&&catalog.length===0?<div className="empty-state">{t('loading')}</div>:catalog.length===0?<div className="empty-state"><Icon name="Lock" size={38}/><p>{t('accountSub')}</p><Link href="/profile" className="button primary">{t('profile')}</Link><Link href="/sources" className="text-link">{t('sources')}</Link></div>:<div className="panel"><label className="form-field">{t('game')}<select value={selected} onChange={e=>setSelected(e.target.value)}>{catalog.map(g=><option value={g.id} key={g.id}>{name(g.title)}{g.active?'':' · inactive'}</option>)}</select></label><textarea className="dataset-editor" aria-label="Dataset JSON" dir="ltr" value={editor} onChange={e=>setEditor(e.target.value)} spellCheck={false}/><div className="info-note"><Icon name="ShieldCheck" size={18}/>{t('dataText')}</div><button className="button primary" onClick={save} disabled={busy}>{t(busy?'loading':'save')}</button></div>}</>;
}
