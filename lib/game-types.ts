export type Locale = 'ary' | 'ar' | 'fr' | 'en';
export type Localized = Record<Locale, string>;
export const localize = (ary: string, en: string, fr = en, ar = ary): Localized => ({ary, ar, en, fr});
export type Category = 'all' | 'morocco' | 'world' | 'sports' | 'science' | 'entertainment' | 'gaming';
export type GameItem = { id: string; name: Localized; value: number; symbol?: string; image?: string; source?: string; };
export type QuizItem = { id: string; statement: Localized; answer: boolean; explanation: Localized; source: string; };
export type GameMode = {
  id: string; title: Localized; description: Localized; category: Category;
  morocco?: boolean; image: string; color: string; icon: string; unit: Localized;
  items: GameItem[]; quiz?: QuizItem[]; kind?: 'comparison' | 'quiz';
  source: string; sourceLabel: string; snapshot: string; scope: Localized;
  featured?: boolean; isNew?: boolean;
};
export type Choice = 'higher' | 'lower' | 'true' | 'false';
export type Difficulty = 'classic' | 'relaxed';
export type RunResult = { id: string; gameId: string; score: number; date: string; difficulty: Difficulty; daily?: string; verified?: boolean; };
