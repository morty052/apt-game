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
