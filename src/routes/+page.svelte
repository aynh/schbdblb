<script lang="ts">
	import { Kelas } from '$lib/types';

	const daftarKelas = Object.values(Kelas)
		.filter((it) => typeof it === 'string')
		.map((kelas) => kelas as string);
</script>

<svelte:head>
	<title>schbdblb</title>
</svelte:head>

<div class="flex flex-col items-center justify-evenly h-full">
	<h1 class="font-semibold text-2xl">Pilih kelas</h1>
	<ul class="flex md:w-sm lt-md:flex-col justify-evenly text-xl underline lt-md:space-y-1">
		{#each daftarKelas as kelas}
			<li>
				<a href="/{kelas}">Kelas {kelas.toUpperCase()}</a>
			</li>
		{/each}
	</ul>
</div>
