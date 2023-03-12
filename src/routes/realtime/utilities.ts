import type { Hari, Jadwal, Periode } from '$lib/types';

export const periodeIsInRange = ({ mulai, selesai }: Periode, jam: number, menit: number) => {
	if (jam === mulai.jam) {
		return menit >= (mulai.menit ?? 0);
	} else if (jam === selesai.jam) {
		return menit <= (selesai.menit ?? 0);
	} else {
		return jam > mulai.jam && jam < selesai.jam;
	}
};

export const resolveNextJadwal = (
	entries: [number, Jadwal[]][],
	jadwalNow?: Jadwal,
): [Hari, Jadwal] => {
	const entryIndex = entries.findIndex(([, values]) => values.includes(jadwalNow!));
	if (entryIndex !== -1) {
		const [hari, jadwal] = entries[entryIndex];
		const jadwalIndex = jadwal.indexOf(jadwalNow!);
		if (jadwalIndex < jadwal.length - 1) {
			return [hari, jadwal[jadwalIndex + 1]];
		}
	}

	const [hari, jadwal] = entries[(entryIndex + 1) % entries.length];
	return [hari, jadwal[0]];
};
