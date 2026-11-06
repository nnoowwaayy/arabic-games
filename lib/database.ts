import {env} from 'cloudflare:workers';
import {postgresDatabase} from './postgres';
export function database(){if(env.DATABASE_URL)return postgresDatabase(env.DATABASE_URL);if(!env.DB)throw new Error('Database unavailable');return env.DB;}
