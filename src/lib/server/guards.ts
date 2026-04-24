import { error, redirect } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';

export function requireAuth(event: RequestEvent): NonNullable<App.Locals['user']> {
	if (!event.locals.user) {
		throw redirect(302, '/auth/login');
	}

	return event.locals.user;
}

export function requireAdmin(event: RequestEvent): NonNullable<App.Locals['user']> {
	const user = requireAuth(event);
	if (!user.isAdmin) {
		throw error(403, 'Forbidden');
	}
	return user;
}
