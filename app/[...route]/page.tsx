import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { Shell } from '@/components/shell';
import { Catalog } from '@/components/catalog';
import { Game } from '@/components/game';
import { Profile,Leaderboard } from '@/components/account';
import { Content } from '@/components/content';
import { getGame } from '@/lib/games';
import {publishedGame} from '@/lib/datasets';
import {Admin} from '@/components/admin';
export default async function Route({params}:{params:Promise<{route:string[]}>}){const {route}=await params;let content;
 if(route.length===2&&route[0]==='games'){const game=await publishedGame(route[1]);if(!game)notFound();content=<Game key={game.id} game={game}/>;}
 else if(route.length===1){const page=route[0];if(page==='games'||page==='morocco')content=<Catalog page={page}/>;else if(page==='admin')content=<Admin/>;else if(page==='profile')content=<Profile/>;else if(page==='leaderboard')content=<Leaderboard/>;else if(['daily','about','how-to-play','sources','privacy','admin'].includes(page))content=<Content page={page}/>;else notFound();}
 else notFound();return <Shell><Suspense>{content}</Suspense></Shell>;
}
