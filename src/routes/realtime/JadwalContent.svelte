<script context="module" lang="ts">
	export enum StatusJadwal {
		sebelumnya,
		sekarang,
		selanjutnya,
	}
</script>

<script lang="ts">
	import { time } from '$lib/stores';
	import { Hari, type Jadwal } from '$lib/types';
	import { intervalToDuration, set as setTime } from 'date-fns';

	export let hari: Hari;
	export let status: StatusJadwal;
	export let jadwal: Jadwal;

	$: ({ periode } = jadwal);
	$: [mulai, selesai] = [periode.mulai, periode.selesai].map(({ jam, menit }) => {
		const date = $time.getDate() + hari - $time.getDay();
		return setTime($time, { date, hours: jam, minutes: menit ?? 0, milliseconds: 0, seconds: 0 });
	});

	$: duration = intervalToDuration({
		start: $time,
		end: status === StatusJadwal.selanjutnya ? mulai : selesai,
	});

	let content = '';
	$: {
		const { days = 0, hours = 0, minutes = 0, seconds = 0 } = duration;
		const jam = days * 24 + hours;

		const s = `${jam} jam, ${minutes} menit, dan ${seconds} detik`;
		if (status === StatusJadwal.sebelumnya) {
			content = `Selesai ${s} lalu`;
		} else if (status === StatusJadwal.sekarang) {
			content = `Tinggal ${s} lagi`;
		} else {
			content = `${s} lagi mulai`;
		}
	}
</script>

<p>Hari: {Hari[hari]}</p>
<p>Nama: {jadwal.nama}</p>
<p>Ruangan: Ruang {jadwal.ruangan}</p>
<p>Dosen: {jadwal.dosen}</p>
<p>{content}</p>
