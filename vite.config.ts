import path from 'path'
import { defineConfig, type ViteDevServer } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
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
  plugins: [
    react(),
    ttsPlugin(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['globalposter.png'],
      manifest: {
        name: "Sparki's Adventures Academy",
        short_name: 'Sparki',
        description: 'Safe AI, coding & homework adventures for kids',
        theme_color: '#3b82f6',
        background_color: '#f0f9ff',
        display: 'standalone',
        start_url: '/',
        icons: [
          { src: '/pwa-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/pwa-512.png', sizes: '512x512', type: 'image/png' },
        ],
      },
      workbox: {
        navigateFallback: '/index.html',
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.pathname.endsWith('.mp4'),
            handler: 'CacheFirst',
            options: {
              cacheName: 'video-cache',
              expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 * 30 },
            },
          },
          {
            urlPattern: ({ url }) =>
              url.pathname.endsWith('.json') && url.pathname.includes('curriculum-'),
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'curriculum-cache',
              expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 7 },
            },
          },
          {
            urlPattern: ({ url }) => url.pathname.startsWith('/api/'),
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              networkTimeoutSeconds: 6,
              expiration: { maxEntries: 50, maxAgeSeconds: 60 * 5 },
            },
          },
        ],
      },
    }),
  ],
  build: {
    chunkSizeWarningLimit: 700,
  },
  server: {
    proxy: {
      // All /api/* requests go to local API server (config, process-homework, generate-adventure-video)
      '/api': { target: 'http://localhost:3001', changeOrigin: true },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
