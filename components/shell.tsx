'use client';
import Link from '@/components/link';
import { usePathname } from 'next/navigation';
import { useState, type ReactNode } from 'react';
import { useApp } from './player-provider';
import { usePlayer } from '@/lib/store';
import { Icon } from './icon';
import type { Locale } from '@/lib/game-types';
export function Brand(){return <Link href="/" className="brand" aria-label="Kter Wla 9el — home"><span className="brand-mark"><Icon name="ArrowUp" size={24}/><Icon name="ArrowDown" size={24}/></span><span className="brand-type" dir="ltr">KTER <span>WLA</span> 9EL<small>كتر ولا قل</small></span></Link>;}
export function Shell({children}:{children:ReactNode}){
 const {t,user}=useApp();const path=usePathname();const {locale,setLocale,muted,toggleMute}=usePlayer();const [menu,setMenu]=useState(false);
 const links=[['/',t('home'),''],['/games',t('games'),'Gamepad2'],['/morocco',t('morocco'),''],['/leaderboard',t('leaderboard'),'Trophy']];
 return <><header className="site-header"><div className="header-inner"><Brand/><nav className={menu?'main-nav is-open':'main-nav'} aria-label="Main navigation">{links.map(([href,label,icon])=><Link key={href} href={href} onClick={()=>setMenu(false)} className={path===href?'nav-link active':'nav-link'}>{icon&&<Icon name={icon} size={17}/>}<span>{label}</span>{href==='/morocco'&&<i/>}</Link>)}</nav><div className="header-tools"><label className="language-control"><Icon name="Globe2" size={16}/><select aria-label="Language" value={locale} onChange={e=>setLocale(e.target.value as Locale)}><option value="ary">الدارجة</option><option value="ar">العربية</option><option value="fr">Français</option><option value="en">English</option></select><Icon name="ChevronDown" size={12}/></label><span className="tool-divider"/><button className="icon-button mute-button" onClick={toggleMute} aria-label={muted?t('soundOn'):t('soundOff')}><Icon name={muted?'VolumeX':'Volume2'} size={18}/></button><Link href="/profile" className="profile-link" aria-label={t('profile')}><Icon name="User" size={19}/>{user&&<span className="online-dot"/>}</Link><button className="icon-button menu-button" aria-label="Menu" aria-expanded={menu} onClick={()=>setMenu(!menu)}><Icon name={menu?'X':'Menu'}/></button></div></div></header><main className="page-wrap">{children}</main><footer className="site-footer"><div><Brand/><p>{t('tagline')}</p></div><div className="footer-links"><Link href="/about">{t('about')}</Link><Link href="/how-to-play">{t('how')}</Link><Link href="/sources">{t('sources')}</Link><Link href="/privacy">{t('privacy')}</Link></div><div className="footer-made"><span>{t('made')} <span className="red">♡</span></span><small>{t('rights')}</small></div></footer></>;
}
