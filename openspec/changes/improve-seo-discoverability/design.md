# Design

## Context

Ver `proposal.md`. El `<head>` de todas las páginas sale de `src/layouts/BaseLayout.astro`, que recibe `title`, `description`, `image`, `type` y `pubDate`. Los posts pasan por `src/layouts/PostLayout.astro`. El sitemap lo genera `@astrojs/sitemap` con un `filter` en `astro.config.mjs` que ya excluye `/admin/` y `/api/`. `robots.txt` es un archivo estático en `public/`. El autor de todos los posts es `slagosdev` (spec `post-content`).

## Goals / Non-Goals

**Goals:**
- Arreglar lo roto (robots, imagen OG) con el menor cambio posible.
- Agregar datos estructurados sin dependencias nuevas.
- Sacar del índice las páginas de tag delgadas.

**Non-Goals:** ver `proposal.md`.

## Decisions

**robots.txt sigue estático.** Basta con corregir la URL. Generarlo con un endpoint de Astro sería código nuevo para un valor que no cambia. Un test lee `public/robots.txt` y compara la línea `Sitemap:` con `site` de `astro.config.mjs`, así un cambio de dominio no lo deja desfasado sin aviso.

**Imagen OG estática, una sola.** `public/og-default.png` de 1200×630 hecha a partir de `public/logo-white.svg` sobre el fondo oscuro del sitio, con el nombre "Blog IA para devs". Se genera una vez con Chrome headless (ya usado en el proyecto para capturas) a partir de un HTML temporal en el scratchpad, y se commitea. No se agrega librería de imágenes.

**JSON-LD con una prop opcional en BaseLayout.** `BaseLayout` recibe `jsonLd?: object` y lo imprime con `<script type="application/ld+json" set:html={JSON.stringify(jsonLd)} />`. `PostLayout` arma el `BlogPosting` con los datos del post: `author` = `{ "@type": "Person", "name": "slagosdev" }`, `publisher` = `{ "@type": "Organization", "name": "Blog IA para devs", "logo": … }`, `datePublished` = `pubDate.toISOString()`, `url` e `image` iguales al canonical y a `og:image`. `index.astro` pasa el `WebSite`. Alternativa descartada: una librería de schema, porque son dos objetos literales.

**Tags con `noindex, follow`.** `BaseLayout` recibe `noindex?: boolean` y, si es `true`, imprime el meta robots. `tags/[slug].astro` lo pasa siempre. En `astro.config.mjs` el `filter` del sitemap también excluye `/tags/`. Alternativa descartada: `noindex` solo en tags con un post, porque cambia la indexación de una página cada vez que se publica un post y no aporta: las categorías ya cubren la navegación temática.

**Medición sin código.** Search Console ya está verificado por DNS TXT como propiedad de dominio. Falta Bing Webmaster Tools, que permite importar la propiedad desde Search Console sin tocar el HTML. Son pasos manuales del usuario porque requieren su cuenta.

## Risks / Trade-offs

- **Los tags dejan de traer tráfico de búsqueda** → Hoy casi no hay páginas indexadas, así que no hay tráfico que perder. Si Search Console muestra que un tag atrae búsquedas, se lo vuelve indexable en otro cambio.
- **JSON-LD inválido** → Se valida el HTML generado con el Rich Results Test de Google (o el validador de schema.org) antes del deploy.
- **Resultados lentos** → Google tarda días o semanas en volver a rastrear. El cambio no promete visitas; quita bloqueos y habilita medir.
- **Rollback** → Revertir el commit.
