import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { and, asc, eq } from 'drizzle-orm';
import { auth } from '$lib/server/auth';
import { db } from '$lib/server/db';
import { user } from '$lib/server/db/schema';
import { requireAdmin, requireAuth } from '$lib/server/guards';

export const load: PageServerLoad = async (event) => {
	const currentUser = requireAuth(event);
	const users = await db
		.select({
			id: user.id,
			email: user.email,
			name: user.name,
			firstName: user.firstName,
			lastName: user.lastName,
			isAdmin: user.isAdmin,
			aboutMyself: user.aboutMyself,
			profilePicturePath: user.profilePicturePath,
			createdAt: user.createdAt
		})
		.from(user)
		.orderBy(asc(user.email));

	return { users, currentUser };
};

export const actions: Actions = {
	createUser: async (event) => {
		requireAdmin(event);

		const formData = await event.request.formData();
		const email = formData.get('email')?.toString().trim() ?? '';
		const password = formData.get('password')?.toString() ?? '';
		const firstName = formData.get('firstName')?.toString().trim() ?? '';
		const lastName = formData.get('lastName')?.toString().trim() ?? '';
		const aboutMyself = formData.get('aboutMyself')?.toString().trim() ?? '';
		const isAdmin = formData.get('isAdmin') === 'on';

		if (!email || !password) {
			return fail(400, { message: 'Email and password are required.' });
		}

		const displayName = `${firstName} ${lastName}`.trim() || email;

		try {
			await auth.api.signUpEmail({
				body: {
					email,
					password,
					name: displayName,
					callbackURL: '/admin/users'
				}
			});

			await db
				.update(user)
				.set({ firstName, lastName, aboutMyself, isAdmin, name: displayName })
				.where(eq(user.email, email));
		} catch {
			return fail(400, { message: 'Could not create user. The email may already exist.' });
		}

		return { success: true };
	},
	updateUser: async (event) => {
		requireAdmin(event);

		const formData = await event.request.formData();
		const id = formData.get('id')?.toString() ?? '';
		const firstName = formData.get('firstName')?.toString().trim() ?? '';
		const lastName = formData.get('lastName')?.toString().trim() ?? '';
		const aboutMyself = formData.get('aboutMyself')?.toString().trim() ?? '';
		const isAdmin = formData.get('isAdmin') === 'on';

		if (!id) {
			return fail(400, { message: 'Missing user id.' });
		}

		const displayName = `${firstName} ${lastName}`.trim();
		await db
			.update(user)
			.set({
				firstName,
				lastName,
				aboutMyself,
				isAdmin,
				name: displayName || firstName || lastName || 'User'
			})
			.where(eq(user.id, id));

		return { success: true };
	},
	deleteUser: async (event) => {
		const currentUser = requireAdmin(event);

		const formData = await event.request.formData();
		const id = formData.get('id')?.toString() ?? '';
		if (!id) {
			return fail(400, { message: 'Missing user id.' });
		}
		if (id === currentUser.id) {
			return fail(400, { message: 'You cannot delete yourself.' });
		}

		await db.delete(user).where(and(eq(user.id, id)));
		return { success: true };
	}
};
