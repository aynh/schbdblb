<script lang="ts">
	import { time } from '$lib/stores';
	import { Hari, type Periode } from '$lib/types';
	import { periodeIsPast } from '$lib/utilities';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	$: keys = Object.keys(data).map(Number);
	let hari = $time.getDay() as Hari;

	$: jadwal = data[hari]!;
	$: jadwalIndex = keys.indexOf(hari);
	$: previous = keys.at(jadwalIndex - 1)!;
	$: next = keys.at((jadwalIndex + 1) % keys.length)!;

	const formatPeriodeValue = ({ jam, menit = 0 }: Periode[keyof Periode]) => {
		const pad = (n: number) => n.toString().padStart(2, '0');
		return `${pad(jam)}:${pad(menit)}`;
	};

	onMount(() => {
		if (jadwal === undefined) {
			// jika jadwal hari ini kosong, ganti ke jadwal pertama
			hari = keys[0];
		} else {
			const jadwalTerakhir = jadwal.at(-1)!;
			// jika jadwal hari ini sudah selesai, ganti ke jadwal besok
			if (periodeIsPast(jadwalTerakhir.periode, $time.getHours(), $time.getMinutes())) {
				const besok = $time.getDay() + 1;
				// jika jadwal besok kosong, ganti ke jadwal pertama saja
				hari = data[besok] === undefined ? keys[0] : besok;
			}
		}
	});
</script>

<svelte:head>
	<title>schbdblb - Jadwal Harian</title>
</svelte:head>

<div class="flex flex-col items-center justify-evenly h-full">
	<h1 class="capitalize font-semibold text-2xl">Jadwal hari {Hari[hari]}</h1>
	<div class="flex flex-col items-center space-y-4">
		{#each jadwal as { nama, dosen, periode, ruangan }}
			{@const [mulai, selesai] = [periode.mulai, periode.selesai].map(formatPeriodeValue)}
			<div class="w-full">
				<p>Nama: {nama}</p>
				<p>Jam: {mulai} - {selesai}</p>
				<p>Ruangan: Ruang {ruangan}</p>
				<p>Dosen: {dosen}</p>
			</div>
		{/each}
	</div>
	<div
		class="w-3/4 md:w-1/2 lg:w-2/5 capitalize flex lt-md:flex-col items-center md:justify-between lt-md:space-y-1"
	>
		<button on:click={() => (hari = previous)}>
			<div class="i-lucide-chevron-left" />
			<span class="flex-1">sebelumnya ({Hari[previous]})</span>
		</button>

		<button on:click={() => (hari = next)}>
			<span class="flex-1">selanjutnya ({Hari[next]})</span>
			<div class="i-lucide-chevron-right" />
		</button>
	</div>
</div>

<style>
	button {
		--uno: 'text-center w-full md:w-2/5 flex items-center justify-between border border-solid p-2 px-3 cursor-pointer select-none hover:bg-blue-200 dark:hover:bg-blue-800';
	}
</style>
