import { jadwal } from '$lib/server/schedule';
import type { PageServerLoad } from '../$types';

export const load = (() => {
	return jadwal;
}) satisfies PageServerLoad;
