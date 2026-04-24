import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { event, eventAttendee, user } from '$lib/server/db/schema';
import { count } from 'drizzle-orm';
import { requireAuth } from '$lib/server/guards';

export const load: PageServerLoad = async (eventCtx) => {
	requireAuth(eventCtx);

	const [userCount] = await db.select({ value: count() }).from(user);
	const [eventCount] = await db.select({ value: count() }).from(event);
	const [attendanceCount] = await db.select({ value: count() }).from(eventAttendee);

	return {
		stats: {
			users: userCount?.value ?? 0,
			events: eventCount?.value ?? 0,
			attendances: attendanceCount?.value ?? 0
		}
	};
};
