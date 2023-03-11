import { defineConfig, presetUno, transformerDirectives } from 'unocss';

const config = defineConfig({
	transformers: [transformerDirectives()],
	presets: [presetUno()],
});

export default config;
