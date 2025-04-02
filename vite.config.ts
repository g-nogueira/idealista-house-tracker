import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import tailwindcss from '@tailwindcss/vite';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
	plugins: [svelte(), tailwindcss()],
	build: {
		// minify: false,
		outDir: 'dist',
		rollupOptions: {
			input: {
				popup: resolve(__dirname, 'src/popup/popup.html'),
				background: resolve(__dirname, 'src/background/background.ts'),
				contentScript: resolve(__dirname, 'src/content-script/content-script.ts')
			},
			output: {
				entryFileNames: '[name].js',
				chunkFileNames: '[name].[hash].js',
				assetFileNames: '[name][extname]'
			}
		}
	},
	resolve: {
		alias: {
			'$lib': resolve(__dirname, 'src/lib')
		}
	},
});

