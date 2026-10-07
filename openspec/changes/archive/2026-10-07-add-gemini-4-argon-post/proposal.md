# Proposal

## Why

Google presentó Gemini 4 Argon el 30 de septiembre de 2026: lidera 12 de los 18 benchmarks que publicó frente a GPT-6 Astra y Claude Opus 5.5, pero sale en acceso restringido. Hay mucha búsqueda de "cómo usarlo" y "en qué plan está" y poca respuesta clara en español; el blog puede dar esa respuesta mientras el tema sigue caliente, apoyado en el video de Vitoria Ferreira.

## What Changes

- Se agrega un post nuevo en la categoría `modelos` sobre el lanzamiento de Gemini 4 Argon que cubre: qué es, cómo usarlo, en qué planes está disponible, precios y benchmarks.
- El post incrusta el video de Vitoria Ferreira (`https://www.youtube.com/watch?v=MHr2L3N27Vw`) con una nota en texto pequeño que indica que se comparte con autorización de su creadora.
- El post se publica con `featured: true` y `draft: false`. Efecto colateral conocido: `createPost()` deja un solo destacado, así que cualquier post que hoy esté destacado deja de estarlo.
- El script one-off `scripts/publish-sonnet-post.ts` (sin commitear) se generaliza a `scripts/publish-post.ts <slug>` para no duplicarlo por cada post.

## Capabilities

### New Capabilities
- `posts/gemini-4-argon-launch`: contenido obligatorio y listón de calidad del post de lanzamiento de Gemini 4 Argon — datos verificados, honestidad sobre la disponibilidad, video acreditado y publicación como destacado.

### Modified Capabilities
<!-- Ninguna. `post-content` (español neutral) y `deployment` aplican sin cambiar sus requisitos. -->

## Impact

- **Contenido / datos**: una fila nueva en `posts` (Neon/Postgres) con `featured = true`; el destacado anterior pasa a `false` en la misma transacción.
- **Archivos**: `src/content/posts/gemini-4-argon-como-usarlo-planes-benchmarks.md` (fuente del post) y `scripts/publish-post.ts` (renombrado desde `publish-sonnet-post.ts`).
- **Publicación**: rebuild de Netlify según la capability `deployment`.
- **Sin cambios** de esquema, componentes ni APIs.
- **Dependencia externa**: exactitud sujeta a las fuentes del anuncio citadas en `design.md`; los benchmarks son cifras reportadas por Google.
