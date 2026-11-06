import { Suspense } from 'react';
import { Shell } from './shell';
import { Catalog } from './catalog';
export default function Home(){return <Shell><Suspense><Catalog/></Suspense></Shell>;}
