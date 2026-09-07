import { fileURLToPath, URL } from 'node:url';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
	// Relative, so the same build works from a GitHub Pages project subpath
	// (`/chuckie-egg/`) and from a custom domain at the root without a rebuild.
	base: './',
	plugins: [react()],
	resolve: {
		alias: {
			// The Create React App setup resolved `classes/...` and `components/...`
			// from `src` via tsconfig `baseUrl`. Vite does not read `baseUrl`, so the
			// same roots are declared here and mirrored in tsconfig `paths`.
			classes: fileURLToPath(new URL('./src/classes', import.meta.url)),
			components: fileURLToPath(new URL('./src/components', import.meta.url)),
			services: fileURLToPath(new URL('./src/services', import.meta.url)),
		},
	},
	server: {
		host: true,
		port: 3000,
		open: false,
	},
	preview: {
		host: true,
		port: 4173,
	},
	build: {
		outDir: 'dist',
		emptyOutDir: true,
		sourcemap: true,
		target: 'es2022',
	},
});
