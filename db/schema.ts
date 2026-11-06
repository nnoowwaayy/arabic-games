import { integer, sqliteTable, text, index, uniqueIndex } from 'drizzle-orm/sqlite-core';
export const users=sqliteTable('users',{
 id:text('id').primaryKey(),email:text('email').notNull().unique(),name:text('name').notNull(),
 password:text('password').notNull(),salt:text('salt').notNull(),country:text('country').notNull().default('MA'),createdAt:text('created_at').notNull(),
});
export const sessions=sqliteTable('sessions',{
 id:text('id').primaryKey(),userId:text('user_id').notNull().references(()=>users.id),expiresAt:integer('expires_at').notNull(),
});
export const runs=sqliteTable('runs',{
 id:text('id').primaryKey(),gameId:text('game_id').notNull(),userId:text('user_id').references(()=>users.id),guestId:text('guest_id').notNull(),
 deck:text('deck').notNull(),turn:integer('turn').notNull().default(0),score:integer('score').notNull().default(0),lives:integer('lives').notNull(),
 snapshot:text('snapshot'),
 difficulty:text('difficulty').notNull(),status:text('status').notNull().default('playing'),daily:text('daily'),
 createdAt:text('created_at').notNull(),finishedAt:text('finished_at'),
},table=>[index('runs_leaderboard').on(table.gameId,table.status,table.score),index('runs_user').on(table.userId),uniqueIndex('runs_guest_daily').on(table.guestId,table.daily),uniqueIndex('runs_user_daily').on(table.userId,table.daily)]);
export const authAttempts=sqliteTable('auth_attempts',{
 key:text('key').primaryKey(),count:integer('count').notNull(),resetAt:integer('reset_at').notNull(),
});
export const datasets=sqliteTable('datasets',{
 gameId:text('game_id').primaryKey(),data:text('data').notNull(),active:integer('active').notNull().default(1),updatedAt:text('updated_at').notNull(),updatedBy:text('updated_by').references(()=>users.id),
});
