<script lang="ts">
	import { Hari } from '$lib/types';
	import { readable } from 'svelte/store';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<svelte:head>
	<title>schbdblb</title>
</svelte:head>

<div class="grid grid-cols-2 md:grid-cols-3 gap-4">
	{#each Object.entries(data) as [hari, jadwal]}
		<div>
			<h2 class="capitalize font-semibold">{Hari[Number(hari)]}</h2>
			<ol class="space-y-2 list-decimal">
				{#each jadwal as { nama, dosen, mulai, ruangan, selesai }}
					<li class="ml-4">
						<p>Nama: {nama}</p>
						<p>Jam: {mulai} - {selesai}</p>
						<p>Ruangan: Ruang {ruangan}</p>
						<p>Dosen: {dosen}</p>
					</li>
				{/each}
			</ol>
		</div>
	{/each}
</div>
