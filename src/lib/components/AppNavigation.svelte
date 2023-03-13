<script lang="ts">
	import { computePosition, offset, shift } from '@floating-ui/dom';

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
</script>

<div class="w-full border border-b-solid px-8 py-4">
	<nav class="relative flex items-center justify-between">
		<a class="font-semibold uppercase text-lg" href="/">schbdblb</a>
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
		<button
			bind:this={floatingReference}
			on:click={() => toggleFloating()}
			class="md:hidden w-6 h-6 i-lucide-menu"
		/>
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
