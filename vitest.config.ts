import { defineConfig } from 'vitest/config';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import path from 'path';

export default defineConfig({
	plugins: [svelte()],
	resolve: {
		conditions: ['browser'],
	},
	test: {
		passWithNoTests: true,
		include: ['src/**/*.test.ts'],
		environment: 'happy-dom',
		setupFiles: ['src/test-setup.ts'],
		globals: true,
		alias: {
			$lib: path.resolve('./src/lib'),
			'$app/stores': path.resolve('./src/test-mocks/app-stores.ts'),
			'$app/navigation': path.resolve('./src/test-mocks/app-navigation.ts'),
			'$env/dynamic/public': path.resolve('./src/test-mocks/env-public.ts'),
		},
	},
});
