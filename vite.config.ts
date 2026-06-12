import react from '@vitejs/plugin-react'
import { seedDesignPlugin } from '@seed-design/vite-plugin'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import svgr from 'vite-plugin-svgr'

// PWA theme_color/background_color: 라이트 모드 --seed-color-bg-layer-default (palette-gray-00) 기준
const PWA_LAYER_DEFAULT = '#ffffff'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr(),
    seedDesignPlugin({
      colorMode: 'light-only',
      fontScaling: true,
      // index.html / index.css에서 color-scheme: light 고정
      injectColorSchemeTag: false,
    }),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icons.svg', 'logo_symbol-gray.png'],
      manifest: {
        name: 'Brit',
        short_name: 'Brit',
        description: '개인 간 코인 거래',
        theme_color: PWA_LAYER_DEFAULT,
        background_color: PWA_LAYER_DEFAULT,
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: 'logo_symbol-gray.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: 'logo_symbol-gray.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: 'favicon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        navigateFallback: '/index.html',
      },
      devOptions: {
        enabled: true,
      },
    }),
  ],
  resolve: {
    tsconfigPaths: true,
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: false,
  },
})
