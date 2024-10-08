import { defineConfig } from 'vite';
import UnoCSS from 'unocss/vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  worker: {
    format: 'es',
  },
  build: {
    target: 'esnext',
  },
  plugins: [
    react(),
    VitePWA({
      includeAssets: [
        'favicon.svg',
        'favicon.ico',
        'robots.txt',
        'apple-touch-icon.png',
      ],
      manifest: {
        name: `Grandivory's Mods Optimizer`,
        short_name: 'GIMO',
        description: `Grandivory's mods optimizer will allow you to equip the optimum mod set on every character you have in Star Wars: Galaxy of Heroes™. It will fetch your mods and characters, and find the best set to equip for each character in a list you provide.`,
        theme_color: '#000000',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
    }),
    UnoCSS(),
  ],
  resolve: {
    alias: {
      "#": path.resolve(__dirname, "./src"),
      "#lib": path.resolve(__dirname, "./src/lib"),
      "#ui": path.resolve(__dirname, "./src/components/ui"),
    },
  },
  server: {
    port: 3000,
  }
});
