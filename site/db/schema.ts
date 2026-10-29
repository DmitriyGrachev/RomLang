import {sqliteTable,text,primaryKey,index} from 'drizzle-orm/sqlite-core';
export const learningEvents=sqliteTable('learning_events',{
 userId:text('user_id').notNull(),id:text('event_id').notNull(),type:text('type').notNull(),payload:text('payload').notNull(),at:text('occurred_at').notNull(),createdAt:text('created_at').notNull()
},t=>[primaryKey({columns:[t.userId,t.id]}),index('learning_events_user_time').on(t.userId,t.createdAt)]);
