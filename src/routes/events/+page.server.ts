import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { event, eventAttendee } from '$lib/server/db/schema';
import { asc, count } from 'drizzle-orm';

export const load: PageServerLoad = async () => {
	const now = new Date();

	const allEvents = await db
		.select({
			id: event.id,
			title: event.title,
			description: event.description,
			startsAt: event.startsAt,
			endsAt: event.endsAt
		})
		.from(event)
		.orderBy(asc(event.startsAt));

	const attendanceCounts = await db
		.select({ eventId: eventAttendee.eventId, attendeeCount: count() })
		.from(eventAttendee)
		.groupBy(eventAttendee.eventId);

	const countByEvent = new Map(attendanceCounts.map((r) => [r.eventId, Number(r.attendeeCount)]));
	const withCounts = allEvents.map((e) => ({ ...e, attendeeCount: countByEvent.get(e.id) ?? 0 }));

	const past = withCounts.filter((e) => new Date(e.endsAt) < now);
	const present = withCounts.filter(
		(e) => new Date(e.startsAt) <= now && new Date(e.endsAt) >= now
	);
	const upcoming = withCounts.filter((e) => new Date(e.startsAt) > now);

	return { past, present, upcoming };
};
