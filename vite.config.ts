import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import type { Plugin } from 'vite'

// Inline plugin: intercepts all figma:asset/ imports and replaces with transparent PNG
const TRANSPARENT_PNG =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='

function figmaAssetsPlugin(): Plugin {
  return {
    name: 'vite-plugin-figma-assets',
    resolveId(id: string) {
      if (id.startsWith('figma:asset/')) {
        return '\0figma-asset:' + id
      }
    },
    load(id: string) {
      if (id.startsWith('\0figma-asset:figma:asset/')) {
        return `export default "${TRANSPARENT_PNG}"`
      }
    },
  }
}

export default defineConfig({
  plugins: [react(), figmaAssetsPlugin()],
  optimizeDeps: {
    include: ['mapbox-gl'],
  },
  build: {
    chunkSizeWarningLimit: 3000,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
        },
      },
    },
  },
})
