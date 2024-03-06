import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), visualizer(), tsconfigPaths()],
  base: '/framer-animations/',
  resolve: {
    preserveSymlinks: true
  }
})
