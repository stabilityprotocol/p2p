import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/p2p/',
  plugins: [preact(), nodePolyfills()]
})
