import { jadwal, periode } from '$lib/server/schedule';
import { Hari, Kelas } from '$lib/types';
import { error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load = (({ params: { kelas } }) => {
	const match = jadwal[Kelas[kelas as keyof typeof Kelas]];
	if (match !== undefined) {
		return match;
	}

	throw error(404);
}) satisfies LayoutServerLoad;
