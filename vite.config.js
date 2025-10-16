import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
	build: {
		rollupOptions: {
			input: {
				bim: resolve(__dirname, 'bim/index.html'),
			}
		}
	},
})