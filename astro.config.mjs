// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

// SSG puro: `output: 'static'` ya hace que Astro genere todo en build-time.
// Combinado con Content Collections de tipo `content` (Markdown), cada .md
// se transforma en una página HTML estática automáticamente.
export default defineConfig({
  site: 'https://blog-ia.example.com',
  output: 'static',
  integrations: [
    tailwind({
      applyBaseStyles: false, // manejamos el reset desde nuestro propio CSS
    }),
    sitemap(),
  ],
  build: {
    format: 'directory',
  },
  markdown: {
    shikiConfig: {
      theme: 'github-dark-default',
      wrap: true,
    },
  },
});