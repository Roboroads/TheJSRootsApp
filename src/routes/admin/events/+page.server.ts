import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { and, asc, eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { event, eventAttendee, user } from '$lib/server/db/schema';
import { requireAdmin, requireAuth } from '$lib/server/guards';

function parseDate(value: string | null): Date | null {
	if (!value) return null;
	const d = new Date(value);
	return Number.isNaN(d.getTime()) ? null : d;
}

export const load: PageServerLoad = async (eventCtx) => {
	const currentUser = requireAuth(eventCtx);

	const events = await db
		.select({
			id: event.id,
			title: event.title,
			description: event.description,
			startsAt: event.startsAt,
			endsAt: event.endsAt,
			createdByUserId: event.createdByUserId
		})
		.from(event)
		.orderBy(asc(event.startsAt));

	const attendees = await db
		.select({
			eventId: eventAttendee.eventId,
			userId: eventAttendee.userId,
			email: user.email,
			firstName: user.firstName,
			lastName: user.lastName
		})
		.from(eventAttendee)
		.innerJoin(user, eq(eventAttendee.userId, user.id));

	const users = await db
		.select({ id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName })
		.from(user)
		.orderBy(asc(user.email));

	return { events, attendees, users, currentUser };
};

export const actions: Actions = {
	createEvent: async (eventCtx) => {
		const currentUser = requireAdmin(eventCtx);
		const formData = await eventCtx.request.formData();
		const title = formData.get('title')?.toString().trim() ?? '';
		const description = formData.get('description')?.toString().trim() ?? '';
		const startsAt = parseDate(formData.get('startsAt')?.toString() ?? null);
		const endsAt = parseDate(formData.get('endsAt')?.toString() ?? null);

		if (!title || !description || !startsAt || !endsAt || startsAt >= endsAt) {
			return fail(400, { message: 'Valid title, description and date range are required.' });
		}

		await db
			.insert(event)
			.values({ title, description, startsAt, endsAt, createdByUserId: currentUser.id });
		return { success: true };
	},
	updateEvent: async (eventCtx) => {
		requireAdmin(eventCtx);
		const formData = await eventCtx.request.formData();
		const id = Number(formData.get('id'));
		const title = formData.get('title')?.toString().trim() ?? '';
		const description = formData.get('description')?.toString().trim() ?? '';
		const startsAt = parseDate(formData.get('startsAt')?.toString() ?? null);
		const endsAt = parseDate(formData.get('endsAt')?.toString() ?? null);

		if (!id || !title || !description || !startsAt || !endsAt || startsAt >= endsAt) {
			return fail(400, { message: 'Valid event update data is required.' });
		}

		await db.update(event).set({ title, description, startsAt, endsAt }).where(eq(event.id, id));
		return { success: true };
	},
	deleteEvent: async (eventCtx) => {
		requireAdmin(eventCtx);
		const formData = await eventCtx.request.formData();
		const id = Number(formData.get('id'));
		if (!id) {
			return fail(400, { message: 'Missing event id.' });
		}

		await db.delete(event).where(eq(event.id, id));
		return { success: true };
	},
	attend: async (eventCtx) => {
		const currentUser = requireAuth(eventCtx);
		const formData = await eventCtx.request.formData();
		const eventId = Number(formData.get('eventId'));
		const requestedUserId = formData.get('userId')?.toString() || currentUser.id;
		const userId = currentUser.isAdmin ? requestedUserId : currentUser.id;

		if (!eventId || !userId) {
			return fail(400, { message: 'Missing attendance data.' });
		}

		await db.insert(eventAttendee).values({ eventId, userId }).onConflictDoNothing();
		return { success: true };
	},
	unattend: async (eventCtx) => {
		const currentUser = requireAuth(eventCtx);
		const formData = await eventCtx.request.formData();
		const eventId = Number(formData.get('eventId'));
		const requestedUserId = formData.get('userId')?.toString() || currentUser.id;
		const userId = currentUser.isAdmin ? requestedUserId : currentUser.id;

		if (!eventId || !userId) {
			return fail(400, { message: 'Missing attendance data.' });
		}

		await db
			.delete(eventAttendee)
			.where(and(eq(eventAttendee.eventId, eventId), eq(eventAttendee.userId, userId)));
		return { success: true };
	}
};
