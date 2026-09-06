import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    VitePWA({
      // Re-fetches the new service worker and activates it on the next
      // load automatically — the alternative ('prompt') needs its own UI
      // to ask the visitor to refresh, which this site has no reason to
      // build just to avoid the classic "stuck on a stale cached version"
      // PWA failure mode.
      registerType: 'autoUpdate',
      includeAssets: ['assets/favicon-32.png', 'assets/favicon-64.png'],
      manifest: {
        name: 'The White Lion Amersham',
        short_name: 'White Lion',
        description: 'Authentic Indian cuisine and traditional British pub classics in Little Chalfont, Amersham.',
        start_url: '/',
        display: 'standalone',
        // Matches the site's own navy-800 header/drawer background and
        // warm-cream page background, so the OS splash screen and the
        // installed app's title bar look like a continuation of the site
        // rather than a generic white/black default.
        theme_color: '#212c38',
        background_color: '#fffcf5',
        icons: [
          { src: '/assets/pwa-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/assets/pwa-512.png', sizes: '512x512', type: 'image/png' },
          { src: '/assets/pwa-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        // Explicit extension list rather than a broad glob — hero.mp4 (10MB)
        // lives alongside these in public/assets and must never be
        // precached: forcing every visitor to download it on install
        // would make "installable" actively worse than not installing.
        globPatterns: ['**/*.{js,css,html,svg,png,ico,woff,woff2}'],
        runtimeCaching: [
          {
            // Photos: fine to cache for fast repeat visits, but capped so
            // the cache can't grow unbounded across dozens of menu/venue
            // images.
            urlPattern: ({ request, url }) => request.destination === 'image' && url.pathname.startsWith('/assets/'),
            handler: 'CacheFirst',
            options: {
              cacheName: 'site-images',
              expiration: { maxEntries: 60, maxAgeSeconds: 60 * 60 * 24 * 30 },
            },
          },
          {
            // The hero video specifically: always network, never written to
            // any Workbox cache — this is the one asset installability
            // must not silently balloon in size.
            urlPattern: /\/assets\/hero\.mp4$/,
            handler: 'NetworkOnly',
          },
        ],
      },
    }),
  ],
  server: {
    port: 3000,
    open: false
  }
});
