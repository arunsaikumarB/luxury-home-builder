import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    watch: {
      // Large local MP4s cause EBUSY crashes on Windows file watchers.
      // Ignore only media binaries — keep the folder itself watched so new files are picked up.
      ignored: [
        '**/public/videos/**/*.mp4',
        '**/public/videos/**/*.mov',
        '**/public/videos/**/*.webm',
        '**/HERO VIDEO/**',
      ],
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/gsap') || id.includes('node_modules/@gsap')) {
            return 'gsap'
          }
          if (id.includes('node_modules/framer-motion')) {
            return 'motion'
          }
          if (id.includes('node_modules/lenis')) {
            return 'lenis'
          }
        },
      },
    },
  },
})
