# Design

## Context

Ver `proposal.md`. `BaseLayout.astro` arma el `<head>` de las páginas públicas; el admin usa `AdminLayout.astro`, aparte. `scripts/publish-post.ts` lee `src/content/posts/<slug>.md` con `gray-matter`, valida el autor y llama a `createPost` de `src/features/posts/admin.ts`. Ese módulo ya tiene `updatePost(id, input)`, `getPostForEdit(id)` y `listAllPostsForAdmin()` (filas con `id` y `slug`). `PostLayout.astro` ya muestra `updatedDate` y lo emite como `dateModified` en el JSON-LD.

## Goals / Non-Goals

**Goals:**
- Medir visitas y su origen sin cookies.
- Editar posts publicados con el mismo flujo de archivo fuente que la publicación.
- Llevar los dos posts a la primera página para sus búsquedas.

**Non-Goals:** ver `proposal.md`.

## Decisions

**Umami Cloud con variable pública.** En `BaseLayout`: `const umamiId = import.meta.env.PUBLIC_UMAMI_WEBSITE_ID;` y `{umamiId && <script defer src="https://cloud.umami.is/script.js" data-website-id={umamiId} />}`. El ID no es secreto (queda en el HTML), pero va en una variable para que los builds locales no midan. Alternativa descartada: Google Analytics 4, porque usa cookies y exige banner de consentimiento para la UE (España es el país con más impresiones). Plausible quedó descartado por costo.

**`update-post.ts` hermano de `publish-post.ts`.** Mismo parseo y misma validación de autor. Busca el `id` por slug con `listAllPostsForAdmin()`, aborta si no existe y llama a `updatePost(id, input)` con `pubDate`, `featured` y `draft` tomados del post actual (`getPostForEdit`) y `updatedDate = new Date()`. Alternativa descartada: editar en el panel admin, porque el contenido nuevo no quedaría versionado en el repo y el agente no puede usar el admin.

**Exportar antes de reescribir.** El primer paso de cada post es volcar su `contentMd` actual a `src/content/posts/<slug>.md` con un comando `tsx` de un solo uso, y commitearlo. Así git guarda la versión anterior y el diff de la reescritura se puede revisar.

**Formato de los posts reescritos.**
- Slug igual (la URL conserva la posición).
- Título que empieza por la búsqueda: "Cómo crear un servidor MCP paso a paso (TypeScript)" y "pgvector en PostgreSQL: cómo usarlo para búsqueda vectorial".
- La introducción responde en dos o tres líneas qué es y qué va a lograr el lector.
- Encabezados `##` en forma de pregunta o de paso ("¿Qué es un servidor MCP?", "Paso 1: instalar el SDK").
- Código completo y ejecutable, verificado contra la documentación actual del SDK de MCP y de pgvector (context7) al momento de escribir.
- Una sección final "Preguntas frecuentes" con respuestas de dos o tres líneas, sin datos estructurados `FAQPage`.
- Español neutral y autor `slagosdev`, según `post-content`.

**Enlaces internos.** Un enlace con texto descriptivo (no "aquí") hacia cada post reescrito desde los posts relacionados que ya tienen impresiones: `anthropic-mcp-protocol` y `mcp-vs-herramientas-propias` hacia el tutorial de MCP; `embeddings-comparativa`, `reranking-rag-precision` y `embeddings-late-chunking` hacia pgvector. Se agrega una oración donde encaje y no se reescribe el resto del post. Cada uno pasa por exportar y luego `update-post.ts`.

## Risks / Trade-offs

- **La reescritura puede bajar la posición en vez de subirla** → El slug no cambia y la versión anterior queda en git. Se compara en Search Console a las tres o cuatro semanas.
- **Código desactualizado** → Se verifica contra la documentación actual antes de publicar y se indica la versión del SDK en el post.
- **El tráfico de IA es poco y Umami muestra poco al principio** → Es esperable; la analítica sirve para ver la tendencia, no para decidir con una semana de datos.
- **Bloqueadores de anuncios ocultan visitas en Umami** → Las cifras de Umami son un piso, no el total.
