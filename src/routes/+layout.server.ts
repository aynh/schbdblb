import { jadwal } from '$lib/server/schedule';
import type { LayoutServerLoad } from './$types';

export const load = (() => {
	return jadwal;
}) satisfies LayoutServerLoad;
