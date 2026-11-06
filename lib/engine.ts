import type { Choice, GameItem } from './game-types';

export function seededRandom(seed: string) {
  let state = 2166136261;
  for (let i = 0; i < seed.length; i++) state = Math.imul(state ^ seed.charCodeAt(i), 16777619);
  return () => { state += 0x6D2B79F5; let t = state; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; };
}
export function shuffle<T>(items: T[], random = Math.random): T[] {
  const next = [...items];
  for (let i=next.length-1;i>0;i--) { const j = Math.floor(random()*(i+1)); [next[i],next[j]]=[next[j],next[i]]; }
  return next;
}
export function evaluateChoice(left: GameItem, right: GameItem, choice: Choice) {
  if (left.value === right.value) return true;
  return choice === 'higher' ? right.value > left.value : choice === 'lower' && right.value < left.value;
}
export function dailyKey(date = new Date()) {
  return new Intl.DateTimeFormat('en-CA',{timeZone:'Africa/Casablanca',year:'numeric',month:'2-digit',day:'2-digit'}).format(date);
}
export function formatValue(value: number, locale: string) {
  return new Intl.NumberFormat(locale === 'fr' ? 'fr-FR' : 'en-US', {maximumFractionDigits: value < 10 && !Number.isInteger(value) ? 3 : 1}).format(value);
}
