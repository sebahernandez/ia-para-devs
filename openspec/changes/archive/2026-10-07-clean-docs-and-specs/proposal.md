# Proposal

## Why

Las specs principales mezclan capacidades duraderas del sistema (`deployment`, `post-content`) con specs de un solo artículo (`posts/gemini-4-argon-launch`), y el flujo real de publicación de posts (archivo fuente → base de datos → rebuild) no está escrito en ninguna spec. Además quedan sueltos un `categories.md` que solo repite 11 líneas de código, un cambio terminado sin archivar (`add-sonnet-5-5-post`) y un `openspec/config.yaml` sin contexto del proyecto, por lo que cada propuesta nueva arranca a ciegas y tiende a crear otra spec por post.

## What Changes

- Eliminar `categories.md` de la raíz: duplica `src/utils/categories.ts` y nada lo referencia.
- Mantener `DEPLOY.md` como guía operativa y agregarle el comando para publicar un post.
- Eliminar la spec principal `posts/gemini-4-argon-launch`: describe un artículo, no un comportamiento del sistema. Su detalle queda en `openspec/changes/archive/2026-10-07-add-gemini-4-argon-post/`.
- Archivar `add-sonnet-5-5-post` (10/10 tareas completas) sin sincronizar su delta, para que no cree otra spec por post.
- Pasar a `post-content` las reglas editoriales que se repetían en las specs por post: datos verificados, crédito de videos de terceros y metadatos obligatorios.
- Crear la capability `post-publishing` con el comportamiento de publicación que hoy existe en código y no está especificado.
- Completar `context` y `rules` en `openspec/config.yaml` (stack, dónde viven los posts, idioma, y la regla de no crear specs por post).

No se modifica código de la aplicación ni contenido publicado.

## Capabilities

### New Capabilities

- `post-publishing`: cómo un post pasa de archivo fuente a estar publicado: base de datos como fuente de verdad, publicación idempotente por slug, un solo destacado, borradores ocultos y rebuild posterior.

### Modified Capabilities

- `post-content`: se agregan requisitos de exactitud de datos, crédito de videos de terceros y metadatos obligatorios. El requisito de idioma no cambia.

## Impact

- **Archivos eliminados**: `categories.md`, `openspec/specs/posts/` (incluye `gemini-4-argon-launch/spec.md`).
- **Archivos editados**: `DEPLOY.md`, `openspec/config.yaml`.
- **OpenSpec**: `add-sonnet-5-5-post` pasa a `openspec/changes/archive/`; al archivar este cambio, las specs vigentes quedan en `deployment`, `post-content` y `post-publishing`.
- **Código y base de datos**: sin cambios. `post-publishing` documenta el comportamiento actual de `scripts/publish-post.ts` y `src/lib/admin-posts.ts`.
- **Deploy**: no requiere rebuild; el sitio publicado no cambia.
