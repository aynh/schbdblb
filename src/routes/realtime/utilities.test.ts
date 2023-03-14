import { periode } from '$lib/server/schedule';
import { Hari, type Jadwal } from '$lib/types';
import { describe, expect, it } from 'vitest';
import { periodeIsInRange, resolveNextJadwal, resolvePreviousJadwal } from './utilities';

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

describe('resolve jadwal', async () => {
	const jadwal: Record<number, Jadwal[]> = {
		[Hari.senin]: [
			{ nama: 'SBD 2', dosen: 'TRI WAHYU Q, M.Kom', periode: periode[0], ruangan: 2 },
			{ nama: 'KOMPAK', dosen: 'AMALIA, MSI', periode: periode[1], ruangan: 2 },
		],
		[Hari.selasa]: [
			{ nama: 'VISUAL 1', dosen: 'M. SAIDI N, M.Kom', periode: periode[0], ruangan: 6 },
			{ nama: 'STR DATA', dosen: 'MUTIA F, M.Kom', periode: periode[1], ruangan: 6 },
		],
		[Hari.jumat]: [
			{ nama: 'PANCA', dosen: 'SULAIMAN, M.Pd', periode: periode[2], ruangan: 6 },
			{ nama: 'KOMDAT', dosen: 'M. RUSDI, M.Kom', periode: periode[3], ruangan: 6 },
		],
	};
	const jadwalEntries = Object.entries(jadwal).map(
		([key, values]) => [Number(key), values] as [number, Jadwal[]],
	);

	describe.each<{ from: Jadwal; to: ReturnType<typeof resolveNextJadwal> }>([
		{ from: jadwal[Hari.selasa][0], to: { hari: Hari.selasa, ...jadwal[Hari.selasa][1] } }, // next in the same day
		{ from: jadwal[Hari.senin][1], to: { hari: Hari.selasa, ...jadwal[Hari.selasa][0] } }, // next in different day
		{ from: jadwal[Hari.jumat][1], to: { hari: Hari.senin, ...jadwal[Hari.senin][0] } }, // next in different day (wrap around)
	])('should resolve next', ({ from, to }) => {
		it(`${from.nama} -> ${to.nama}`, () => {
			expect(resolveNextJadwal(jadwalEntries, from)).toStrictEqual(to);
		});
	});

	describe.each<{
		hari: Hari;
		jam?: number;
		menit?: number;
		to: ReturnType<typeof resolvePreviousJadwal>;
	}>([
		{
			// in-between 2 jadwal
			hari: Hari.senin,
			jam: 9,
			menit: 40,
			to: { hari: Hari.senin, ...jadwal[Hari.senin][0] },
		},
		{
			// before jadwal has started
			hari: Hari.selasa,
			jam: 7,
			to: { hari: Hari.senin, ...jadwal[Hari.senin][1] },
		},
		{
			// after ALL jadwal has started
			hari: Hari.selasa,
			jam: 12,
			menit: 20,
			to: { hari: Hari.selasa, ...jadwal[Hari.selasa][1] },
		},
		{
			// in a day without jadwal
			hari: Hari.rabu,
			to: { hari: Hari.selasa, ...jadwal[Hari.selasa][1] },
		},
		{
			// in a day without jadwal (wrap-around)
			hari: Hari.minggu,
			to: { hari: Hari.jumat, ...jadwal[Hari.jumat][1] },
		},
	])('should resolve previous', ({ hari, jam, menit, to }) => {
		it(`${Hari[hari]} ${jam}:${menit} -> ${to.nama}`, () => {
			const date = new Date();
			date.setHours(jam ?? 0);
			date.setMinutes(menit ?? 0);
			if (date.getDay() !== hari) {
				date.setDate(date.getDate() + hari - date.getDay());
			}

			expect(resolvePreviousJadwal(jadwalEntries, date)).toStrictEqual(to);
		});
	});
});
