# Tasks

## 1. Robots y sitemap

- [x] 1.1 Corregir la línea `Sitemap:` de `public/robots.txt` a `https://iaparadevs.com/sitemap-index.xml`
- [x] 1.2 En `tests/features.test.ts`, probar que la línea `Sitemap:` de `public/robots.txt` es `<site>/sitemap-index.xml`, con `site` leído de `astro.config.mjs`. Verificar con `npm test`
- [x] 1.3 En `astro.config.mjs`, excluir `/tags/` en el `filter` del sitemap

## 2. Imagen Open Graph

- [x] 2.1 Crear `public/og-default.png` de 1200×630 con `logo-white.svg` y el nombre del blog sobre el fondo oscuro del sitio, renderizando un HTML temporal del scratchpad con Chrome headless; verificar dimensiones y que pese menos de 300 KB

## 3. Head

- [x] 3.1 En `src/layouts/BaseLayout.astro`, agregar las props opcionales `jsonLd` (imprime `<script type="application/ld+json">`) y `noindex` (imprime `<meta name="robots" content="noindex, follow">`)
- [x] 3.2 En `src/layouts/PostLayout.astro`, pasar el JSON-LD `BlogPosting` según `design.md`
- [x] 3.3 En `src/pages/index.astro`, pasar el JSON-LD `WebSite`
- [x] 3.4 En `src/pages/tags/[slug].astro`, pasar `noindex`

## 4. Verificación local

- [x] 4.1 Correr `npm run build` y revisar en `dist/`: `robots.txt` correcto; el sitemap sin URLs de `/tags/` y con todos los posts; un post con un `BlogPosting` cuyo JSON se puede parsear y cuyo `url` coincide con el canonical; la portada con `WebSite`; una página de tag con `noindex, follow` y un post sin él
- [x] 4.2 Validar el JSON-LD de un post con el validador de schema.org (pegando el HTML generado) sin errores

## 5. Entrega

- [x] 5.1 Con el visto bueno explícito del usuario: commit, `git push` y rebuild de Netlify según `deployment`; verificar en producción que `robots.txt` apunta al dominio correcto, que `/og-default.png` responde 200 con `image/png` y que un post tiene su `BlogPosting`
- [ ] 5.2 Pasos manuales del usuario (no los ejecuta el agente): en Search Console (propiedad de dominio `iaparadevs.com`, ya verificada), confirmar en "Sitemaps" que `https://iaparadevs.com/sitemap-index.xml` está enviado y sin errores, y reenviarlo tras el deploy; importar la propiedad en Bing Webmaster Tools desde Search Console; a las dos semanas revisar en Search Console el informe "Páginas" (indexadas y motivos de exclusión)
