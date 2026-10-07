import { sqliteTable, text, integer, index, uniqueIndex, primaryKey } from 'drizzle-orm/sqlite-core';
export const reservations = sqliteTable('reservations', {
  id: text('id').primaryKey(), scope: text('scope').notNull(), date: text('date').notNull(), time: text('time').notNull(),
  service: text('service').notNull(), people: integer('people').notNull(), name: text('name').notNull(), phone: text('phone').notNull().default(''),
  notes: text('notes').notNull().default(''), status: text('status').notNull().default('confirmada'), tables: text('tables').notNull(),
  version: integer('version').notNull().default(0), mutationToken: text('mutation_token').notNull().default(''), idempotencyKey: text('idempotency_key').notNull(), createdAt: text('created_at').notNull(),
}, t => [index('idx_reservations_scope_date').on(t.scope, t.date), uniqueIndex('idx_reservations_scope_key').on(t.scope, t.idempotencyKey)]);
export const claims = sqliteTable('claims', {
  scope: text('scope').notNull(), date: text('date').notNull(), tableId: integer('table_id').notNull(), minute: integer('minute').notNull(),
  reservationId: text('reservation_id').notNull().references(() => reservations.id, { onDelete: 'cascade' }),
}, t => [primaryKey({ columns: [t.scope, t.date, t.tableId, t.minute] }), index('idx_claims_reservation').on(t.reservationId)]);
