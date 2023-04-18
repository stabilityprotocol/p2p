import { resolve } from 'path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
    define: {
        global: {},
    },
    plugins: [dts({ insertTypeEntry: true })],
    build: {
        target: 'es2020',
        lib: {
            entry: resolve(__dirname, 'src/index.ts'),
            name: 'EventEmitterP2P',
            fileName: 'stble-p2p',
        },
        sourcemap: true,
    },
})