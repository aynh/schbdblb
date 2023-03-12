<script lang="ts">
	import { time } from '$lib/stores';
	import { Hari, type Jadwal } from '$lib/types';
	import { formatDuration, intervalToDuration, set as setTime } from 'date-fns';

	export let active: boolean;
	export let hari: Hari;
	export let jadwal: Jadwal;
	$: ({ nama, dosen, periode, ruangan } = jadwal);

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
		intervalToDuration({ start: $time, end: active ? selesai : mulai }),
	).replace(/(day|hour|minute|second)s?/g, (_, v) => localeReplacement[v]);
	$: content = active ? `Tinggal ${duration} lagi` : `${duration} lagi mulai`;
</script>

<div>
	<p>Hari: {Hari[hari]}</p>
	<p>Nama: {nama}</p>
	<p>Ruangan: Ruang {ruangan}</p>
	<p>Dosen: {dosen}</p>
	<p>{content}</p>
</div>
