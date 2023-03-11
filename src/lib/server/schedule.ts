import { Hari, type Jadwal, type Periode } from '$lib/types';

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

export const jadwal: { [key in Hari]?: Jadwal[] } = {
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
};
