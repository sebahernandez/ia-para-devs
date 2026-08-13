// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import netlify from '@astrojs/netlify';

// output: 'static' -> las páginas públicas se siguen generando en build-time
// (ahora consultando Neon en vez de Markdown). El adaptador de Netlify solo
// habilita las rutas de /admin y /api/admin, marcadas con `prerender = false`,
// para que corran on-demand como Netlify Functions.
export default defineConfig({
  site: 'https://iaparadevs.com',
  output: 'static',
  adapter: netlify(),
  integrations: [
    tailwind({
      applyBaseStyles: false, // manejamos el reset desde nuestro propio CSS
    }),
    sitemap({
      // El panel de admin y sus API routes no son contenido público.
      filter: (page) => {
        const path = new URL(page).pathname;
        return !path.startsWith('/admin/') && !path.startsWith('/api/');
      },
    }),
  ],
  build: {
    format: 'directory',
  },
});