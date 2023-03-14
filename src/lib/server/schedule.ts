import { Hari, Kelas, type Jadwal, type Periode } from '$lib/types';

export const periode: Periode[] = [
	{
		mulai: { jam: 8 },
		selesai: { jam: 9, menit: 30 },
	},
	{
		mulai: { jam: 9, menit: 45 },
		selesai: { jam: 11, menit: 15 },
	},
	{
		mulai: { jam: 13 },
		selesai: { jam: 14, menit: 30 },
	},
	{
		mulai: { jam: 14, menit: 40 },
		selesai: { jam: 16 },
	},
	{
		mulai: { jam: 16, menit: 20 },
		selesai: { jam: 17, menit: 50 },
	},
	{
		mulai: { jam: 19, menit: 15 },
		selesai: { jam: 20, menit: 30 },
	},
	{
		mulai: { jam: 20, menit: 40 },
		selesai: { jam: 22, menit: 5 },
	},
];

export const jadwal: { [key in Kelas]: { [key in Hari | number]?: Jadwal[] } } = {
	[Kelas['2a']]: {
		[Hari.senin]: [
			{ nama: 'KOMPAK', dosen: 'AMALIA, MSI', periode: periode[0], ruangan: 1 },
			{ nama: 'SBD 1', dosen: 'TRI WAHYU Q, M.Kom', periode: periode[1], ruangan: 1 },
		],
		[Hari.selasa]: [
			{ nama: 'STR DATA', dosen: 'MUTIA F, M.Kom', periode: periode[0], ruangan: 5 },
			{ nama: 'VISUAL 1', dosen: 'M. SAIDI N, M.Kom', periode: periode[1], ruangan: 5 },
		],
		[Hari.rabu]: [
			{ nama: 'KOMDAT', dosen: 'M. RUSDI, M.Kom', periode: periode[2], ruangan: 5 },
			{ nama: 'PANCA', dosen: 'SULAIMAN, M.Pd', periode: periode[3], ruangan: 5 },
		],
		[Hari.kamis]: [
			{ nama: 'DISKRIT', dosen: 'ADANI D, M.Kom', periode: periode[0], ruangan: 1 },
			{ nama: 'SIM', dosen: 'HAYATI N, M.Pd', periode: periode[1], ruangan: 1 },
		],
		[Hari.jumat]: [{ nama: 'ALGO 2', dosen: 'PUTRA, M.Kom', periode: periode[1], ruangan: 1 }],
	},
	[Kelas['2b']]: {
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
		[Hari.kamis]: [
			{ nama: 'SIM', dosen: 'HAYATI N, M.Pd', periode: periode[0], ruangan: 2 },
			{ nama: 'DISKRIT', dosen: 'ADANI D, M.Kom', periode: periode[1], ruangan: 2 },
		],
		[Hari.jumat]: [{ nama: 'ALGO 2', dosen: 'PUTRA, M.Kom', periode: periode[0], ruangan: 2 }],
	},
};

if (import.meta.vitest) {
	const { expect, it } = import.meta.vitest;

	it('periode harus valid', () => {
		for (const { mulai, selesai } of periode) {
			expect(mulai.jam).toBeLessThanOrEqual(selesai.jam);
			if (mulai.jam === selesai.jam) {
				expect(mulai.menit ?? 0).toBeLessThan(selesai.menit ?? 0);
			}

			for (const { jam, menit } of [mulai, selesai]) {
				expect(jam).not.toBeNaN();
				expect(jam).toBeGreaterThanOrEqual(0);
				expect(jam).toBeLessThanOrEqual(24);

				if (menit !== undefined) {
					expect(menit).not.toBeNaN();
					expect(menit).toBeGreaterThanOrEqual(0);
					expect(menit).toBeLessThanOrEqual(60);
				}
			}
		}
	});

	it('jadwal harus terurut', () => {
		const periodeMulaiJam = periode.map(({ mulai: { jam } }) => jam);
		const sorted = Object.entries(jadwal)
			.sort(([a], [b]) => Number(a) - Number(b))
			.map(([key, value]): [string, [string, (typeof jadwal)[Kelas][number]][]] => [
				key,
				Object.entries(value)
					.sort(([a], [b]) => Number(a) - Number(b))
					.map(([valueKey, valueValue]): [string, (typeof jadwal)[Kelas][Hari]] => [
						valueKey,
						valueValue!.sort(
							(a, b) =>
								periodeMulaiJam.indexOf(a.periode.mulai.jam) -
								periodeMulaiJam.indexOf(b.periode.mulai.jam),
						),
					]),
			]);

		expect(sorted).toStrictEqual(
			Object.entries(jadwal).map(([key, value]) => [key, Object.entries(value)]),
		);
	});
}
