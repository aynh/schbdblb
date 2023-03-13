<script>
	import AppNavigation from '$lib/components/AppNavigation.svelte';
	import 'the-new-css-reset';
</script>

<div class="flex flex-col h-100vh">
	<AppNavigation />
	<div class="flex-1">
		<slot />
	</div>
</div>

<style uno:preflights global>
	body {
		--uno: 'font-sans bg-[#ffffff] dark:bg-[#121212] text-[#000000] dark:text-[#ffffffde]';
	}
</style>
