<script lang="ts">
	import { time } from '$lib/stores';
	import type { Jadwal } from '$lib/types';
	import { periodeIsInRange, resolveNextJadwal } from './utilities';
	import type { PageData } from './$types';
	import JadwalContent from './JadwalContent.svelte';

	export let data: PageData;

	$: today = $time.getDay();
	$: jadwalEntries = Object.entries(data)
		.map(([key, values]) => [Number(key), values] as [number, Jadwal[]])
		.sort(([a], [b]) => a - b);
	$: jadwalToday = data[today];

	$: jadwalNow = jadwalToday?.find(({ periode }) =>
		periodeIsInRange(periode, $time.getHours(), $time.getMinutes()),
	);
	$: [jadwalNextHari, jadwalNext] = resolveNextJadwal(jadwalEntries, jadwalNow);
</script>

<svelte:head>
	<title>schbdblb - Jadwal Realtime</title>
</svelte:head>

<div class="flex flex-col items-center justify-evenly h-100vh">
	<h1 class="capitalize font-semibold text-3xl">jadwal realtime</h1>
	<div class="md:w-full lt-md:h-2/3 flex lt-md:flex-col justify-evenly">
		<div class="flex flex-col items-center space-y-1">
			<h2 class="capitalize font-semibold text-xl">sekarang</h2>
			{#if jadwalNow !== undefined}
				<JadwalContent active={true} hari={today} jadwal={jadwalNow} />
			{:else}
				<p>null</p>
			{/if}
		</div>
		<div class="flex flex-col items-center space-y-1">
			<h2 class="capitalize font-semibold text-xl">selanjutnya</h2>
			<JadwalContent active={false} hari={jadwalNextHari} jadwal={jadwalNext} />
		</div>
	</div>
</div>
