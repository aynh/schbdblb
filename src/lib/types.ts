export enum Hari {
	minggu,
	senin,
	selasa,
	rabu,
	kamis,
	jumat,
	sabtu,
}

export interface Jadwal {
	nama: string;
	dosen: string;
	periode: Periode;
	ruangan: Ruangan;
}

export type Periode = Record<'mulai' | 'selesai', { jam: number; menit?: number }>;
export type Ruangan = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
