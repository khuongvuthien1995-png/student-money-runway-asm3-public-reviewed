import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ command, isPreview }) => ({
  plugins: [react()],
  // Only the development server proxies; built/preview deployments use same-origin /api.
  ...(command === 'serve' && !isPreview ? {
    server: { proxy: { '/api': { target: 'http://127.0.0.1:8000', changeOrigin: false } } },
  } : {}),
}))
