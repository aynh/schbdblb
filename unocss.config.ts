import { defineConfig, presetIcons, presetUno, transformerDirectives } from 'unocss';

const config = defineConfig({
	transformers: [transformerDirectives()],
	presets: [presetUno(), presetIcons({ scale: 1.2 })],
});

export default config;
