<script lang="ts">
	import { time } from '$lib/stores';
	import { Hari } from '$lib/types';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	$: keys = Object.keys(data);
	let hari = Hari[$time.getDay()];

	$: jadwal = data[hari];
	$: jadwalIndex = keys.indexOf(hari);
	$: previous = keys.at(jadwalIndex - 1)!;
	$: next = keys.at((jadwalIndex + 1) % keys.length)!;

	onMount(() => {
		if (jadwal === undefined) {
			// jika jadwal hari ini kosong, ganti ke jadwal pertama
			hari = keys[0];
		} else {
			const jadwalTerakhir = jadwal.at(-1)!;
			const [jam, menit] = jadwalTerakhir.selesai.split(':').map(Number);
			// jika jadwal hari ini sudah selesai, ganti ke jadwal besok
			if ($time.getHours() > jam || ($time.getHours() === jam && $time.getMinutes() > menit)) {
				const hari_ = Hari[$time.getDay() + 1];
				// jika jadwal besok kosong, ganti ke jadwal pertama saja
				if (data[hari_] === undefined) {
					hari = keys[0];
				} else {
					hari = hari_;
				}
			}
		}
	});
</script>

<svelte:head>
	<title>schbdblb - Jadwal Harian</title>
</svelte:head>

<div class="flex flex-col items-center justify-evenly h-full">
	<h1 class="capitalize font-semibold text-2xl">Jadwal hari {hari}</h1>
	<div class="flex flex-col items-center space-y-4">
		{#each jadwal as { nama, dosen, mulai, ruangan, selesai }}
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
			<span class="flex-1">sebelumnya ({previous})</span>
		</button>

		<button on:click={() => (hari = next)}>
			<span class="flex-1">selanjutnya ({next})</span>
			<div class="i-lucide-chevron-right" />
		</button>
	</div>
</div>

<style>
	button {
		--uno: 'text-center w-full md:w-2/5 flex items-center justify-between border border-solid p-2 px-3 cursor-pointer select-none hover:bg-blue-200 dark:hover:bg-blue-800';
	}
</style>
