import { jadwal, processJadwal } from '$lib/server/schedule';
import type { PageServerLoad } from './$types';

export const load = (() => {
	return processJadwal(jadwal);
}) satisfies PageServerLoad;
