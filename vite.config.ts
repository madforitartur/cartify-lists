
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { VitePWA } from 'vite-plugin-pwa';
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'cartify-icon-192.png', 'cartify-icon-512.png'],
      manifest: {
        name: 'Cartify',
        short_name: 'Cartify',
        description: 'Gerenciador de Listas de Compras',
        theme_color: '#8B5CF6',
        icons: [
          {
            src: 'cartify-icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'cartify-icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      devOptions: {
        enabled: true
      }
    })
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
