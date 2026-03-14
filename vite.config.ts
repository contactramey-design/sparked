import path from 'path'
import { defineConfig, type ViteDevServer } from 'vite'
import react from '@vitejs/plugin-react'
async function ttsPlugin() {
  const { ttsMiddleware } = await import('./server/tts-middleware.js')
  return {
    name: 'tts-api',
    configureServer(server: ViteDevServer) {
      server.middlewares.use(ttsMiddleware())
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), ttsPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
