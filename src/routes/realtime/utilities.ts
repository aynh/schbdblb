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

export type ResolvedJadwal = Jadwal & { hari: Hari };

export const resolveNextJadwal = (entries: [Hari, Jadwal[]][], base: Jadwal): ResolvedJadwal => {
	const nameEntries = entries.map(([, values]) => values.map(({ nama }) => nama));
	const entryIndex = nameEntries.findIndex((values) => values.includes(base.nama));

	const names = nameEntries[entryIndex];
	const [hari, jadwal] = entries[entryIndex];
	// coba pilih jadwal selanjutnya dihari yang sama
	const next = jadwal.at(names.indexOf(base.nama) + 1);
	if (next !== undefined) {
		return { hari, ...next };
	}

	// kalau tidak ada, ambil jadwal pertama dihari berikutnya
	const [hari_, jadwal_] = entries[(entryIndex + 1) % entries.length];
	return { hari: hari_, ...jadwal_[0] };
};

export const resolvePreviousJadwal = (entries: [Hari, Jadwal[]][], date: Date): ResolvedJadwal => {
	// coba mencari jadwal sebelumnya di hari yang sama
	const todayEntry = entries.find(([hari]) => hari === date.getDay());
	if (todayEntry !== undefined) {
		const [hari, jadwalToday] = todayEntry;
		const [jam, menit] = [date.getHours(), date.getMinutes()];
		const match = jadwalToday.find(({ periode: { selesai } }, index) => {
			// jika waktu jadwal sudah dilewati:
			if (selesai.jam < jam || (selesai.jam === jam && menit >= (selesai.menit ?? 0))) {
				const next = jadwalToday.at(index + 1)?.periode.mulai;
				return (
					// jika tidak ada jadwal selanjutnya
					next === undefined ||
					// atau jika jadwal selanjutnya belum lewat
					next.jam > jam ||
					(next.jam === jam && menit <= (next.menit ?? 0))
				);
			}
		});

		if (match !== undefined) {
			return { hari, ...match };
		}
	}

	const date_ = new Date(date.valueOf());
	while (true) {
		// cari jadwal dihari kemarin-kemarin sampai ada hari yang memiliki jadwal
		date_.setDate(date_.getDate() - 1);

		const entry = entries.find(([hari]) => hari === date_.getDay());
		if (entry !== undefined) {
			// gunakan jadwal terakhir
			const [hari, jadwal] = entry;
			return { hari, ...jadwal.at(-1)! };
		}
	}
};
