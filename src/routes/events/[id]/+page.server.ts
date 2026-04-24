import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { event, eventAttendee, user } from '$lib/server/db/schema';

export const load: PageServerLoad = async ({ params }) => {
	const eventId = Number(params.id);
	if (!eventId) {
		throw error(404, 'Event not found');
	}

	const [selectedEvent] = await db
		.select({
			id: event.id,
			title: event.title,
			description: event.description,
			startsAt: event.startsAt,
			endsAt: event.endsAt
		})
		.from(event)
		.where(eq(event.id, eventId));

	if (!selectedEvent) {
		throw error(404, 'Event not found');
	}

	const attendees = await db
		.select({
			userId: user.id,
			firstName: user.firstName,
			lastName: user.lastName,
			profilePicturePath: user.profilePicturePath,
			aboutMyself: user.aboutMyself
		})
		.from(eventAttendee)
		.innerJoin(user, eq(eventAttendee.userId, user.id))
		.where(eq(eventAttendee.eventId, eventId));

	return { event: selectedEvent, attendees };
};
