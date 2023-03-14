<script lang="ts">
	import { time } from '$lib/stores';
	import type { Jadwal } from '$lib/types';
	import {
		periodeIsInRange,
		resolveNextJadwal,
		resolvePreviousJadwal,
		type ResolvedJadwal,
	} from './utilities';
	import type { PageData } from './$types';
	import JadwalContent, { StatusJadwal } from './JadwalContent.svelte';

	export let data: PageData;

	$: today = $time.getDay();
	$: jadwalToday = data[today];

	$: jadwalEntries = Object.entries(data)
		.map(([key, values]) => [Number(key), values] as [number, Jadwal[]])
		.sort(([a], [b]) => a - b);

	$: jadwalPrevious = resolvePreviousJadwal(jadwalEntries, $time);

	let jadwalNow: ResolvedJadwal | undefined = undefined;
	$: {
		const match = jadwalToday?.find(({ periode }) =>
			periodeIsInRange(periode, $time.getHours(), $time.getMinutes()),
		);
		if (match !== undefined) {
			jadwalNow = { hari: today, ...match };
		} else {
			jadwalNow = undefined;
		}
	}

	$: jadwalNext = resolveNextJadwal(jadwalEntries, jadwalNow ?? jadwalPrevious);

	$: daftarJadwal = [
		[StatusJadwal.sebelumnya, jadwalPrevious],
		[StatusJadwal.sekarang, jadwalNow],
		[StatusJadwal.selanjutnya, jadwalNext],
	] as [StatusJadwal, ResolvedJadwal][];
</script>

<svelte:head>
	<title>schbdblb - Jadwal Realtime</title>
</svelte:head>

<div class="flex flex-col items-center h-full">
	<div class="flex-grow-1 md:flex-grow-1.5 flex items-end">
		<h1 class="capitalize font-semibold text-3xl">jadwal realtime</h1>
	</div>
	<div class="flex-grow-5 md:w-full lg:w-3/4 flex lt-md:flex-col items-center justify-evenly">
		{#each daftarJadwal as [status, jadwal_]}
			<div class="md:flex-1 flex flex-col items-center space-y-1">
				<h2 class="capitalize font-semibold text-xl">{StatusJadwal[status]}</h2>
				<div class="md:min-h-24">
					{#if jadwal_ !== undefined}
						{@const { hari, ...jadwal } = jadwal_}
						<JadwalContent {hari} {jadwal} {status} />
					{:else}
						<p>null</p>
					{/if}
				</div>
			</div>
		{/each}
	</div>
</div>
