import { AvatarObject } from 'components/Avatar';
import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';

export const Quests = sqliteTable('Quests', {
  ID: integer('ID').notNull().primaryKey(),
  Name: text('Name'),
  DESCRIPTION: text('DESCRIPTION').notNull(),
  IMAGE: text('IMAGE').notNull(),
  PROGRESS: integer('PROGRESS').notNull(),
});

export const Nuggets = sqliteTable('nuggets', {
  id: integer('id').notNull().primaryKey(),
  title: text('title'),
  type: text('type').notNull(),
  image: text('image').notNull(),
  content: integer('content').notNull(),
});

export const Stats = sqliteTable('stats', {
  id: integer('id').notNull().primaryKey(),
  level: integer('level').notNull(),
  points: integer('points').notNull(),
  high_score: integer('high_score').notNull(),
  games_played: integer('games_played').notNull(),
  wins: integer('wins').notNull(),
  losses: integer('losses').notNull(),
  login_streak: integer('login_streak').notNull(),
  claimed_for_day: text('claimed_for_day').notNull(),
});

export const Invites = sqliteTable('invites', {
  game_id: text('game_id').notNull().primaryKey(),
  avatar: text('avatar', { mode: 'json' }).$type<AvatarObject>().notNull(),
  host: text('host').notNull(),
  guests: text('guests', { mode: 'json' }).notNull().$type<string[]>(),
  created_at: text('created_at').notNull(),
});
