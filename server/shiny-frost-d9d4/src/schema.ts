import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const comments = sqliteTable('comments', {
  id: integer('id').primaryKey(),
  author: text('author').notNull(),
  body: text('body').notNull(),
  postSlug: text('post_slug').notNull(),
});
