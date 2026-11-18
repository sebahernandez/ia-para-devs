# Proposal

## Why

OpenAI anunció el 16 de noviembre de 2026 agentes de uso de computadora para equipos de salud: leen pantallas, hacen clic y se mueven entre la historia clínica electrónica y los portales de las aseguradoras para resolver trámites como autorizaciones, derivaciones y altas. Es un caso concreto del paso de la IA que conversa a la IA que ejecuta trabajo dentro de sistemas sin API, con una empresa (CVS Health) que ya lo usa en producción. El blog puede explicarlo en español mientras el tema está vigente, con la cautela que piden cifras publicadas por el propio fabricante.

## What Changes

- Se agrega un post nuevo en la categoría `herramientas` a partir del borrador entregado por el usuario, adaptado al tono y la estructura del blog.
- El post se publica con `featured: true` y `draft: false`, por pedido explícito: reemplaza al destacado actual de la portada, que pasa a `featured = false` en la misma operación.
- **Supuesto**: la categoría es `herramientas` ("SDKs, IDEs, agentes y utilidades prácticas"), porque el anuncio trata de agentes y de un producto, no del lanzamiento de un modelo. Efecto: la tarjeta no muestra logo de modelo, que solo aplica a `modelos`.
- **Supuesto**: se conserva el título del borrador y `pubDate` es 2026-11-17.
- **Supuesto**: no se incrustan videos ni gráficos; el borrador no los incluye y no se pidieron.
- Se publica con el script existente `scripts/publish-post.ts <slug>`; no hay código nuevo.

## Capabilities

### New Capabilities

Ninguna. Es un cambio de contenido: `skip_specs: true`.

### Modified Capabilities

Ninguna. Aplican sin cambios `post-content` (español neutral, datos verificados contra sus fuentes, cifras atribuidas al fabricante, metadatos), `post-publishing` (publicación por slug, autor `slagosdev`, un solo destacado) y `deployment`.

## Impact

- **Contenido / datos**: una fila nueva en `posts` (Neon/Postgres) con `featured = true`; el destacado actual pasa a `false` en la misma transacción.
- **Archivos**: `src/content/posts/openai-agentes-uso-de-computadora-salud.md`.
- **Publicación**: rebuild de Netlify según `deployment`; requiere aprobación explícita.
- **Sin cambios** de esquema, componentes, scripts ni APIs.
- **Pendiente de verificación**: las cifras y nombres provienen del borrador del usuario, que cita tres fuentes por título y sin URL. Deben confirmarse contra esas fuentes antes de redactar.
