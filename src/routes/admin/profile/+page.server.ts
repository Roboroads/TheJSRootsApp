import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { eq } from 'drizzle-orm';
import { mkdir, writeFile } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { auth } from '$lib/server/auth';
import { db } from '$lib/server/db';
import { user } from '$lib/server/db/schema';
import { requireAuth } from '$lib/server/guards';

export const load: PageServerLoad = async (event) => {
	const currentUser = requireAuth(event);
	const [current] = await db
		.select({
			id: user.id,
			email: user.email,
			firstName: user.firstName,
			lastName: user.lastName,
			aboutMyself: user.aboutMyself,
			profilePicturePath: user.profilePicturePath
		})
		.from(user)
		.where(eq(user.id, currentUser.id));

	return { current };
};

export const actions: Actions = {
	updateProfile: async (event) => {
		const currentUser = requireAuth(event);
		const formData = await event.request.formData();
		const firstName = formData.get('firstName')?.toString().trim() ?? '';
		const lastName = formData.get('lastName')?.toString().trim() ?? '';
		const aboutMyself = formData.get('aboutMyself')?.toString().trim() ?? '';
		const picture = formData.get('profilePicture');

		const updates: Partial<typeof user.$inferInsert> = {
			firstName,
			lastName,
			aboutMyself,
			name: `${firstName} ${lastName}`.trim() || currentUser.email
		};

		if (picture instanceof File && picture.size > 0) {
			if (!picture.type.startsWith('image/')) {
				return fail(400, { message: 'Profile picture must be an image.' });
			}
			if (picture.size > 3 * 1024 * 1024) {
				return fail(400, { message: 'Profile picture max size is 3MB.' });
			}

			const extension = extname(picture.name) || '.png';
			const relativePath = `images/profile-pictures/${currentUser.id}${extension}`;
			const absoluteDirectory = join(process.cwd(), 'static', 'images', 'profile-pictures');
			const absolutePath = join(process.cwd(), 'static', relativePath);

			await mkdir(absoluteDirectory, { recursive: true });
			await writeFile(absolutePath, Buffer.from(await picture.arrayBuffer()));
			updates.profilePicturePath = `/${relativePath}`;
			updates.image = `/${relativePath}`;
		}

		await db.update(user).set(updates).where(eq(user.id, currentUser.id));
		return { success: true };
	},
	changePassword: async (event) => {
		const currentUser = requireAuth(event);
		const formData = await event.request.formData();
		const currentPassword = formData.get('currentPassword')?.toString() ?? '';
		const newPassword = formData.get('newPassword')?.toString() ?? '';

		if (!currentPassword || newPassword.length < 8) {
			return fail(400, {
				message: 'Current password and a new password of 8+ chars are required.'
			});
		}

		try {
			await auth.api.changePassword({
				headers: event.request.headers,
				body: { currentPassword, newPassword, revokeOtherSessions: false }
			});
		} catch {
			return fail(400, { message: 'Password change failed. Check your current password.' });
		}

		await db.update(user).set({ updatedAt: new Date() }).where(eq(user.id, currentUser.id));
		return { success: true };
	}
};
