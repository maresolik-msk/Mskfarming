import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  css: {
    preprocessorOptions: {},
  },
  optimizeDeps: {
    include: ['mapbox-gl'],
  },
  build: {
    rollupOptions: {
      external: (id: string) =>
        id.startsWith('figma:asset/'),
      output: {
        globals: (id: string) =>
          id.startsWith('figma:asset/') ? 'null' : id,
      },
    },
  },
})
