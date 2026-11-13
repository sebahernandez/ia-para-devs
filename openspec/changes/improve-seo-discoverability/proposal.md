# Proposal: improve-seo-discoverability

## Why

El blog casi no recibe visitas. Una revisión de producción (https://iaparadevs.com, 2026-11-12) encontró fallas técnicas que dificultan que los buscadores descubran y muestren el sitio, y además no hay forma de medir el tráfico.

**Hallazgos verificados en producción:**

1. **`robots.txt` apunta a un sitemap de otro dominio.** Dice `Sitemap: https://blog-ia.example.com/sitemap-index.xml`, un dominio de ejemplo que no existe. El sitemap real (`/sitemap-index.xml`, 332 URLs) funciona, pero `robots.txt` no lleva a él. Fuente: `public/robots.txt`.
2. **La imagen Open Graph no existe.** Todas las páginas declaran `og:image` = `/og-default.png` y esa URL devuelve 404. Al compartir un post en X, LinkedIn, WhatsApp o Slack no aparece imagen, y eso baja los clics desde redes.
3. **No hay datos estructurados.** Ninguna página tiene JSON-LD (`BlogPosting`, `WebSite`). Google tiene menos señales sobre el autor, la fecha y el tipo de contenido.
4. **Las páginas de tags son contenido delgado.** Hay 191 páginas de tag para 127 posts, y 101 de ellas listan un solo post. Esas páginas están en el sitemap y compiten con los posts por el presupuesto de rastreo.
5. **La medición está a medias.** Google Search Console está verificado como propiedad de dominio (registro DNS TXT `google-site-verification`) y ya registra datos. Bing Webmaster Tools no está verificado (no hay registro de Bing en el DNS). No hay analítica en el HTML. Como `robots.txt` apunta a otro dominio, el sitemap solo le llega a Google si se envió a mano en Search Console.
6. **Google sí indexa, pero muestra poco el sitio.** Datos de Search Console, últimos 3 meses (2026-08-11 a 2026-11-10):
   - 780 impresiones y 8 clics en total (CTR 1%). Por mes: 215, 219, 268 y 78 (noviembre parcial). El volumen está plano, no crece.
   - 81 posts tuvieron al menos una impresión, así que la indexación funciona. El problema es la demanda y la posición, no que Google no vea las páginas.
   - Casi todas las consultas tienen 1 o 2 impresiones. Las únicas con volumen son "model context protocol an open standard" (72, posición 70), "cómo construir un servidor mcp" (48, posición 24) y "fable 5.1" (4, posición 88).
   - Las páginas más cerca de la primera página son `mcp-servidores-propios-tutorial` (86 impresiones, posición 18,7), `vector-search-pgvector` (82, posición 12,9) y `primeros-pasos-anthropic-api` (40, posición 9,2).
   - México da 226 impresiones en posición media 38 y 0 clics; España da 264 en posición 12 y 5 clics.
   - En móvil la posición media es 30, contra 15 en escritorio.
   - Aparecen páginas de tag duplicadas que solo difieren en mayúsculas (`/tags/gpt-6/` y `/tags/GPT-6/`).

**Lo que está bien:** `lang="es"`, `title`, `description` y `canonical` únicos por página, `og:*` y `twitter:*` completos (salvo la imagen), `article:published_time`, un `h1` por página, RSS válido, 404 real y redirección de `www` y `http` a `https://iaparadevs.com` con 301.

## What Changes

- Corregir `robots.txt` para que apunte a `https://iaparadevs.com/sitemap-index.xml`, y probarlo para que no vuelva a romperse.
- Agregar `public/og-default.png` (1200×630) con la marca del blog.
- Agregar JSON-LD `BlogPosting` en cada post y `WebSite` en la portada.
- Marcar las páginas de tag como `noindex, follow` y sacarlas del sitemap.
- Pasos manuales para el usuario: en Search Console, confirmar que el sitemap correcto está enviado y revisar el informe de indexación; dar de alta el sitio en Bing Webmaster Tools (se puede importar desde Search Console).

## Sugerencias fuera de este cambio (contenido y distribución)

El SEO técnico solo evita que el sitio sea invisible. Las visitas dependen sobre todo del contenido y de la distribución:

- **Fechas retroactivas.** El repositorio empezó el 2026-06-18, pero hay posts fechados desde enero de 2025. Google puede leer muchos posts publicados de golpe con fechas antiguas como contenido generado a escala. Conviene dejar de usar fechas pasadas en los posts nuevos.
- **Autoría y experiencia (E-E-A-T).** Una página de autor con quién escribe, enlaces a GitHub o LinkedIn y experiencia real. Opiniones propias, pruebas hechas por el autor y código que se pueda correr distinguen el blog de los resúmenes de lanzamientos.
- **Empujar las páginas que ya están cerca.** `mcp-servidores-propios-tutorial` y `vector-search-pgvector` están entre las posiciones 12 y 19 para búsquedas con algo de volumen. Ampliarlas con código completo, un título que repita la búsqueda ("Cómo crear un servidor MCP paso a paso") y enlaces internos desde otros posts es lo que más rápido puede traer clics.
- **Tags normalizados.** Guardar los tags en minúsculas evita páginas duplicadas como `/tags/GPT-6/`.
- **Intención de búsqueda.** Los títulos de lanzamiento ("X: qué trae de nuevo") compiten con los sitios oficiales y los medios grandes. Las guías que responden preguntas concretas en español ("cómo usar la API de Claude en Node", "X vs Y para programar") tienen menos competencia.
- **Distribución.** Compartir cada post en comunidades en español (X, LinkedIn, Reddit, Discord, dev.to con canonical al blog) trae las primeras visitas y los primeros enlaces, y Google descubre e indexa antes un sitio que recibe enlaces.

## Non-Goals

- Script de analítica en el sitio. Search Console da impresiones, clics y estado de indexación sin agregar JavaScript ni banner de cookies. Si se quiere tráfico total, se decide en otro cambio (Netlify Analytics o Plausible).
- Imagen Open Graph distinta por post.
- `lastmod` en el sitemap.
- Reescribir o refechar posts existentes.

## Capabilities

### New Capabilities

- `site-seo`: lo que el sitio expone a buscadores y redes (robots, sitemap, Open Graph, datos estructurados, indexación de tags).

### Modified Capabilities

Ninguna.

## Impact

- `public/robots.txt`, `public/og-default.png` (nuevo)
- `src/layouts/BaseLayout.astro`, `src/layouts/PostLayout.astro`, `src/pages/index.astro`, `src/pages/tags/[slug].astro`
- `astro.config.mjs` (filtro del sitemap)
- `tests/features.test.ts`
- Sin cambios en la base de datos. Rollback: revertir el commit.
