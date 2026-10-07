# Proposal

## Why

Claude Sonnet 5.5 se lanzó el 28 de septiembre de 2026 y es la noticia del día en el mundo de los modelos de lenguaje: rinde casi como Opus 5.5 pero al mismo precio que Sonnet 5, con salida ~30% más rápida y hasta 30% menos costo por tarea. Es contenido de alta relevancia y búsqueda inmediata para un blog de IA en español, y encaja de lleno en la categoría `modelos`. Publicarlo ahora, mientras el tema está caliente, aprovecha una ventana de tráfico orgánico.

## What Changes

- Se agrega un post nuevo al blog sobre el lanzamiento de Claude Sonnet 5.5, centrado en sus **beneficios** para quien lo usa (velocidad, costo, calidad de escritura y diseño, coding, seguridad).
- El post se publica en la categoría `modelos`, en español neutral (según el estándar `post-content`), con un ángulo atractivo y original en vez de una nota de prensa genérica.
- Se define un estándar de calidad/veracidad para posts de lanzamiento de modelos (exactitud de cifras y benchmarks, foco en beneficios, estructura escaneable) como criterios de aceptación verificables para este y futuros posts del mismo tipo.

## Capabilities

### New Capabilities
- `posts/sonnet-5-5-launch`: Define el contenido requerido y el listón de calidad del post de lanzamiento de Claude Sonnet 5.5 — cifras verificadas, foco en beneficios, ángulo original y cumplimiento editorial.

### Modified Capabilities
<!-- Ninguna. El estándar de idioma `post-content` ya existe y este post debe cumplirlo, pero sus requisitos no cambian. -->

## Impact

- **Contenido / datos**: una fila nueva en la tabla `posts` (Neon/Postgres), categoría `modelos`. Se crea vía `createPost()` (`src/lib/admin-posts.ts`) o el panel admin; `content_html` se genera desde `content_md` con `renderMarkdown`.
- **Publicación**: tras guardar, el deploy sigue el flujo existente (`triggerRebuild` → Netlify), según la capability `deployment`.
- **Sin cambios de código**: no se tocan esquema, componentes ni APIs; es una adición de contenido.
- **Dependencia externa**: exactitud sujeta a las fuentes del anuncio (Anthropic y prensa del 28-09-2026) citadas en `design.md`.
