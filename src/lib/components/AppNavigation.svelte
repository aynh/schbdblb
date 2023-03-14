<script lang="ts">
	import { computePosition, offset, shift } from '@floating-ui/dom';
	import { onMount } from 'svelte';

	let dark = false;

	const toggleDark = () => {
		dark = document.documentElement.classList.toggle('dark');
	};

	let floatingReference: HTMLElement;
	let floatingElement: HTMLElement;
	let floating = false;

	const toggleFloating = async () => {
		floating = !floating;
		if (floating) {
			const { x, y } = await computePosition(floatingReference, floatingElement, {
				middleware: [shift(), offset({ mainAxis: 8, crossAxis: -8 })],
			});
			floatingElement.style.backgroundColor = getComputedStyle(document.body).backgroundColor;
			floatingElement.style.position = 'absolute';
			floatingElement.style.transform = `translate(${x}px, ${y}px)`;
		} else {
			floatingElement.style.backgroundColor =
				floatingElement.style.position =
				floatingElement.style.transform =
					'';
		}
	};

	onMount(() => {
		const handleClick = async (event: Event) => {
			// jika floating sedang aktif:
			if (floating) {
				const target = event.target as Node;
				// jika di click diluar dari floatingElement dan floatingReference:
				if (!floatingElement.contains(target) && !floatingReference.contains(target)) {
					// hilangkan floating
					await toggleFloating();
				}
			}
		};

		document.addEventListener('click', handleClick, true);
		return () => {
			document.removeEventListener('click', handleClick, true);
		};
	});
</script>

<div class="w-full border border-b-solid px-8 py-4">
	<nav class="relative flex items-center justify-between">
		<a class="flex-1 font-semibold uppercase text-lg" href="/">schbdblb</a>
		<ul
			bind:this={floatingElement}
			class:hidden={!floating}
			class="dropdown underline md:flex md:space-x-4"
		>
			<li>
				<a href="/">Jadwal Harian</a>
			</li>
			<li>
				<a href="/realtime">Jadwal Realtime</a>
			</li>
		</ul>
		<div class="flex-1 flex justify-end space-x-2">
			<button
				on:click={() => toggleDark()}
				class:i-lucide-moon={dark}
				class:i-lucide-sun={!dark}
				class="w-6 md:w-8 h-6 md:h-8"
			/>
			<button
				bind:this={floatingReference}
				on:click={() => toggleFloating()}
				class="md:hidden w-6 h-6 i-lucide-menu"
			/>
		</div>
	</nav>
</div>

<style>
	@media (max-width: 767.9px) {
		/* lt-md breakpoint */
		.dropdown {
			--uno: 'border border-solid p-2 pt-1 space-y-2';
		}
	}
</style>
