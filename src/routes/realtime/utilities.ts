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

if (import.meta.vitest) {
	const { describe, expect, it } = import.meta.vitest;

	describe('periode in range', () => {
		type Args = Parameters<typeof periodeIsInRange>;

		describe.each<Args>([
			[{ mulai: { jam: 8 }, selesai: { jam: 10 } }, 8, 0],
			[{ mulai: { jam: 8 }, selesai: { jam: 10 } }, 10, 0],
			[{ mulai: { jam: 8, menit: 20 }, selesai: { jam: 10, menit: 40 } }, 8, 20],
			[{ mulai: { jam: 8, menit: 20 }, selesai: { jam: 10, menit: 40 } }, 10, 40],
		])('exactly at mulai and selesai', (...args) => {
			it('should match', () => {
				expect(periodeIsInRange(...args)).toBe(true);
			});
		});

		describe.each([
			...Array.from({ length: 7 }, (_, n) => [n + 1, -(n + 1)]),
			...Array.from({ length: 7 }, (_, n) => [-(n + 1), n + 1]),
		])('incremented by $1 $2', (a, b) => {
			const periode = { mulai: { jam: 8, menit: 20 }, selesai: { jam: 10, menit: 40 } };

			it('should not match', () => {
				expect(periodeIsInRange(periode, a, b)).toBe(false);
			});
		});

		describe.each<Args>([
			[{ mulai: { jam: 9 }, selesai: { jam: 10 } }, 9, 20],
			[{ mulai: { jam: 9 }, selesai: { jam: 10 } }, 9, 40],
			[{ mulai: { jam: 9, menit: 20 }, selesai: { jam: 10, menit: 40 } }, 9, 40],
			[{ mulai: { jam: 9, menit: 20 }, selesai: { jam: 10, menit: 40 } }, 10, 20],
		])('in range', (...args) => {
			it('should match', () => {
				expect(periodeIsInRange(...args)).toBe(true);
			});
		});
	});

	describe('resolve next jadwal', async () => {
		const { Hari } = await import('$lib/types');
		const { periode } = await import('$lib/server/schedule');

		const jadwal: Record<number, Jadwal[]> = {
			[Hari.senin]: [
				{ nama: 'SBD 2', dosen: 'TRI WAHYU Q, M.Kom', periode: periode[0], ruangan: 2 },
				{ nama: 'KOMPAK', dosen: 'AMALIA, MSI', periode: periode[1], ruangan: 2 },
			],
			[Hari.selasa]: [
				{ nama: 'VISUAL 1', dosen: 'M. SAIDI N, M.Kom', periode: periode[0], ruangan: 6 },
				{ nama: 'STR DATA', dosen: 'MUTIA F, M.Kom', periode: periode[1], ruangan: 6 },
			],
			[Hari.rabu]: [
				{ nama: 'PANCA', dosen: 'SULAIMAN, M.Pd', periode: periode[2], ruangan: 6 },
				{ nama: 'KOMDAT', dosen: 'M. RUSDI, M.Kom', periode: periode[3], ruangan: 6 },
			],
		};
		const jadwalEntries = Object.entries(jadwal).map(
			([key, values]) => [Number(key), values] as [number, Jadwal[]],
		);

		describe.each<{ from: Jadwal; to: [Hari, Jadwal] }>([
			{ from: jadwal[Hari.selasa][0], to: [Hari.selasa, jadwal[Hari.selasa][1]] }, // next in the same day
			{ from: jadwal[Hari.senin][1], to: [Hari.selasa, jadwal[Hari.selasa][0]] }, // next in different day
			{ from: jadwal[Hari.rabu][1], to: [Hari.senin, jadwal[Hari.senin][0]] }, // next in different day (wrap around)
		])('should resolve next', ({ from, to }) => {
			it(`${from.nama} -> ${to[1].nama}`, () => {
				expect(resolveNextJadwal(jadwalEntries, from)).toStrictEqual(to);
			});
		});
	});
}
