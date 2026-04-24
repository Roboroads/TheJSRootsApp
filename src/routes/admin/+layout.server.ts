import type { LayoutServerLoad } from './$types';
import { requireAuth } from '$lib/server/guards';

export const load: LayoutServerLoad = async (event) => {
	const user = requireAuth(event);
	return { user };
};
