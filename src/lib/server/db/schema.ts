import { relations } from 'drizzle-orm';
import { pgTable, serial, integer, text, timestamp, index, uniqueIndex } from 'drizzle-orm/pg-core';
import { user } from './auth.schema';

export const event = pgTable(
	'event',
	{
		id: serial('id').primaryKey(),
		title: text('title').notNull(),
		description: text('description').notNull(),
		startsAt: timestamp('starts_at').notNull(),
		endsAt: timestamp('ends_at').notNull(),
		createdByUserId: text('created_by_user_id')
			.notNull()
			.references(() => user.id, { onDelete: 'restrict' })
	},
	(table) => [
		index('event_starts_at_idx').on(table.startsAt),
		index('event_ends_at_idx').on(table.endsAt)
	]
);

export const eventAttendee = pgTable(
	'event_attendee',
	{
		id: serial('id').primaryKey(),
		eventId: integer('event_id')
			.notNull()
			.references(() => event.id, { onDelete: 'cascade' }),
		userId: text('user_id')
			.notNull()
			.references(() => user.id, { onDelete: 'cascade' }),
		createdAt: timestamp('created_at').defaultNow().notNull()
	},
	(table) => [
		uniqueIndex('event_attendee_event_user_uidx').on(table.eventId, table.userId),
		index('event_attendee_event_idx').on(table.eventId),
		index('event_attendee_user_idx').on(table.userId)
	]
);

export const eventRelations = relations(event, ({ one, many }) => ({
	createdBy: one(user, {
		fields: [event.createdByUserId],
		references: [user.id]
	}),
	attendees: many(eventAttendee)
}));

export const eventAttendeeRelations = relations(eventAttendee, ({ one }) => ({
	event: one(event, {
		fields: [eventAttendee.eventId],
		references: [event.id]
	}),
	user: one(user, {
		fields: [eventAttendee.userId],
		references: [user.id]
	})
}));

export * from './auth.schema';
