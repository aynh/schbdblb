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
	import { formatDuration, intervalToDuration, set as setTime } from 'date-fns';

	export let hari: Hari;
	export let status: StatusJadwal;
	export let jadwal: Jadwal;

	$: ({ periode } = jadwal);
	$: [mulai, selesai] = [periode.mulai, periode.selesai].map(({ jam, menit }) => {
		const date = $time.getDate() + hari - $time.getDay();
		return setTime($time, { date, hours: jam, minutes: menit ?? 0, milliseconds: 0, seconds: 0 });
	});

	const localeReplacement = {
		day: 'hari',
		hour: 'jam',
		minute: 'menit',
		second: 'detik',
	} as Record<string, string>;
	$: duration = formatDuration(
		intervalToDuration({ start: $time, end: status === StatusJadwal.sekarang ? selesai : mulai }),
	).replace(/(day|hour|minute|second)s?/g, (_, v) => localeReplacement[v]);

	let content = '';
	$: {
		if (status === StatusJadwal.sebelumnya) {
			content = `Selesai ${duration} lalu`;
		} else if (status === StatusJadwal.sekarang) {
			content = `Tinggal ${duration} lagi`;
		} else {
			content = `${duration} lagi mulai`;
		}
	}
</script>

<p>Hari: {Hari[hari]}</p>
<p>Nama: {jadwal.nama}</p>
<p>Ruangan: Ruang {jadwal.ruangan}</p>
<p>Dosen: {jadwal.dosen}</p>
<p>{content}</p>
