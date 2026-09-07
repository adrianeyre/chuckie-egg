import { fileURLToPath, URL } from 'node:url';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			classes: fileURLToPath(new URL('./src/classes', import.meta.url)),
			components: fileURLToPath(new URL('./src/components', import.meta.url)),
			services: fileURLToPath(new URL('./src/services', import.meta.url)),
		},
	},
	test: {
		// The components render into a DOM and read `window`, so a browser-like
		// environment is required rather than the default `node` one.
		environment: 'jsdom',
		globals: true,
		setupFiles: ['./src/setupTests.ts'],
		include: ['src/**/*.test.{ts,tsx}'],
		coverage: {
			provider: 'v8',
			reporter: ['text', 'lcov'],
			include: ['src/**/*.{ts,tsx}'],
			exclude: ['src/**/*.test.{ts,tsx}', 'src/**/interfaces/**', 'src/index.tsx'],
		},
	},
});
