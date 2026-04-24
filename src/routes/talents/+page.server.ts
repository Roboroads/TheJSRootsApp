import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { user } from '$lib/server/db/schema';
import { asc } from 'drizzle-orm';

export const load: PageServerLoad = async () => {
	const talents = await db
		.select({
			id: user.id,
			firstName: user.firstName,
			lastName: user.lastName,
			aboutMyself: user.aboutMyself,
			profilePicturePath: user.profilePicturePath
		})
		.from(user)
		.orderBy(asc(user.firstName), asc(user.lastName));

	return { talents };
};
