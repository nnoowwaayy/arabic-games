import {cookies} from 'next/headers';
import {database} from './database';
const text=new TextEncoder();
export type Account={id:string;name:string;email:string;country:string};
export async function digest(value:string){const bytes=new Uint8Array(await crypto.subtle.digest('SHA-256',text.encode(value)));return Array.from(bytes).map(b=>b.toString(16).padStart(2,'0')).join('');}
export async function account():Promise<Account|null>{const jar=await cookies();const token=jar.get('kter_session')?.value;if(!token)return null;return database().prepare('SELECT u.id,u.name,u.email,u.country FROM users u JOIN sessions s ON s.user_id=u.id WHERE s.id=? AND s.expires_at>?').bind(await digest(token),Date.now()).first<Account>();}
