import react from '@vitejs/plugin-react'
import { seedDesignPlugin } from '@seed-design/vite-plugin'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// PWA theme_color/background_color: 라이트 모드 --seed-color-bg-layer-default (palette-gray-00) 기준
const PWA_LAYER_DEFAULT = '#ffffff'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    seedDesignPlugin({
      colorMode: 'system',
      fontScaling: true,
      injectColorSchemeTag: true,
    }),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icons.svg'],
      manifest: {
        name: 'NT',
        short_name: 'NT',
        description: 'SEED Design PWA with Stackflow navigation',
        theme_color: PWA_LAYER_DEFAULT,
        background_color: PWA_LAYER_DEFAULT,
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: 'favicon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any maskable',
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
