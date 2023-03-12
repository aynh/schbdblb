import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import UnoCSS from 'unocss/vite';

export default defineConfig({
	define: {
		'import.meta.vitest': 'undefined',
	},
	plugins: [UnoCSS({ mode: 'svelte-scoped' }), sveltekit()],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}'],
		includeSource: ['src/**/*.{js,ts}'],
	},
});
