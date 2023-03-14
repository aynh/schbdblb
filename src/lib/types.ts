export enum Hari {
	minggu,
	senin,
	selasa,
	rabu,
	kamis,
	jumat,
	sabtu,
}

export enum Kelas {
	'2a',
	'2b',
}

export interface Jadwal {
	nama: string;
	dosen: string;
	periode: Periode;
	ruangan: number;
}

export type Periode = Record<'mulai' | 'selesai', { jam: number; menit?: number }>;
