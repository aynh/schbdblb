import { jadwal } from '$lib/server/schedule';
import { Hari } from '$lib/types';
import type { PageServerLoad } from './$types';

export const load = (() => {
	const padded = (n: number) => n.toString().padStart(2, '0');
	return Object.fromEntries(
		Object.entries(jadwal).map(([hari, jadwal]) => [
			Hari[Number(hari)],
			jadwal.map(({ periode: { mulai, selesai }, ...rest }) => ({
				...rest,
				mulai: `${padded(mulai.jam)}:${padded(mulai.menit ?? 0)}`,
				selesai: `${padded(selesai.jam)}:${padded(selesai.menit ?? 0)}`,
			})),
		]),
	);
}) satisfies PageServerLoad;
